// Vercel Serverless Function — GA4 Analytics Data API
// Authenticates via service account and returns funnel data to the dashboard

const { google } = require('googleapis');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const GA4_PROPERTY_ID = '518699898';

async function getAccessToken() {
  const credentials = JSON.parse(process.env.GOOGLE_ANALYTICS_CREDENTIALS || '{}');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const client = await auth.getClient();
  const tokenResp = await client.getAccessToken();
  return tokenResp.token;
}

async function queryGA4(accessToken, postData) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GA4 API error: ${response.status} - ${err}`);
  }
  return response.json();
}

function formatRows(rows, dimNames, metNames) {
  if (!rows) return [];
  return rows.map(row => {
    const obj = {};
    dimNames.forEach((d, i) => { obj[d] = row.dimensionValues[i]?.value || ''; });
    metNames.forEach((m, i) => { obj[m] = parseFloat(row.metricValues[i]?.value) || 0; });
    return obj;
  });
}

export default async function handler(req, res) {
  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accessToken = await getAccessToken();

    const [
      // 1. Sessions by page (top pages)
      pageData,
      // 2. Sessions by source/channel
      sourceData,
      // 3. All events with counts
      eventData,
      // 4. Page + event breakdown
      pageEventData,
      // 5. Sessions by landing page + source
      landingSourceData,
      // 6. Bounce rate + avg session duration by page
      engagementData,
    ] = await Promise.all([
      queryGA4(accessToken, {
        dateRanges: [{ startDate: '2026-03-17', endDate: '2026-03-23' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'totalUsers' }],
        limit: 25,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: '2026-03-17', endDate: '2026-03-23' }],
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        limit: 10,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: '2026-03-17', endDate: '2026-03-23' }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBy: { metric: { metricName: 'eventCount' }, desc: true },
        limit: 20,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: '2026-03-17', endDate: '2026-03-23' }],
        dimensions: [{ name: 'eventName' }, { name: 'pagePath' }],
        metrics: [{ name: 'eventCount' }],
        limit: 30,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: '2026-03-17', endDate: '2026-03-23' }],
        dimensions: [{ name: 'pagePath' }, { name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }],
        limit: 30,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: '2026-03-17', endDate: '2026-03-23' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'bounceRate' }, { name: 'averageSessionDuration' }, { name: 'screenPageViews' }],
        limit: 20,
      }),
    ]);

    // Also get today's data (partial)
    let todayData = null;
    try {
      todayData = await queryGA4(accessToken, {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
        limit: 10,
      });
    } catch (e) {
      // GA4 today data sometimes not available yet
    }

    const result = {
      generatedAt: new Date().toISOString(),
      dateRange: '2026-03-17 to 2026-03-23 (7 days)',
      summary: {
        totalPageViews: pageData.rows ? pageData.rows.reduce((s, r) => s + parseInt(r.metricValues[0].value), 0) : 0,
        totalSessions: sourceData.rows ? sourceData.rows.reduce((s, r) => s + parseInt(r.metricValues[0].value), 0) : 0,
        totalUsers: sourceData.rows ? sourceData.rows.reduce((s, r) => s + parseInt(r.metricValues[1].value), 0) : 0,
      },
      topPages: formatRows(
        pageData.rows,
        pageData.dimensions.map(d => d.name),
        pageData.metrics.map(m => m.name)
      ),
      trafficSources: formatRows(
        sourceData.rows,
        sourceData.dimensions.map(d => d.name),
        sourceData.metrics.map(m => m.name)
      ),
      events: formatRows(
        eventData.rows,
        eventData.dimensions.map(d => d.name),
        eventData.metrics.map(m => m.name)
      ),
      eventsByPage: formatRows(
        pageEventData.rows,
        pageEventData.dimensions.map(d => d.name),
        pageEventData.metrics.map(m => m.name)
      ),
      landingPageSources: formatRows(
        landingSourceData.rows,
        landingSourceData.dimensions.map(d => d.name),
        landingSourceData.metrics.map(m => m.name)
      ),
      engagement: formatRows(
        engagementData.rows,
        engagementData.dimensions.map(d => d.name),
        engagementData.metrics.map(m => m.name)
      ),
      today: todayData ? formatRows(
        todayData.rows,
        todayData.dimensions.map(d => d.name),
        todayData.metrics.map(m => m.name)
      ) : null,
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error('Analytics API error:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch analytics data',
      message: error.message,
    });
  }
}
