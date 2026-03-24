// Vercel Serverless Function — GA4 Analytics Data API
import { GoogleAuth } from 'google-auth-library';

const GA4_PROPERTY_ID = '518699898';

function getRollingDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD in local TZ
}

async function getAccessToken() {
  const credentials = JSON.parse(process.env.GOOGLE_ANALYTICS_CREDENTIALS || '{}');
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const client = await auth.getClient();
  const tokenResp = await client.getAccessToken();
  return tokenResp.token;
}

async function queryGA4(accessToken, postData) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`GA4 API ${resp.status}: ${err}`);
  }
  return resp.json();
}

function formatRows(rows, dimNames, metNames) {
  if (!rows) return [];
  return rows.map(row => {
    const obj = {};
    dimNames.forEach((d, i) => { obj[d] = row.dimensionValues?.[i]?.value || ''; });
    metNames.forEach((m, i) => { obj[m] = parseFloat(row.metricValues?.[i]?.value) || 0; });
    return obj;
  });
}

function getDimNames(data) {
  return (data.dimensionHeaders || data.dimensions || []).map(d => d.name);
}
function getMetNames(data) {
  return (data.metricHeaders || data.metrics || []).map(m => m.name);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const today = getRollingDate(0);    // today
    const weekAgo = getRollingDate(7); // 7 days ago
    const accessToken = await getAccessToken();

    const [pageData, sourceData, eventData, pageEventData, landingSourceData, engagementData] = await Promise.all([
      queryGA4(accessToken, {
        dateRanges: [{ startDate: weekAgo, endDate: today }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'totalUsers' }],
        limit: 25,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: weekAgo, endDate: today }],
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        limit: 10,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: weekAgo, endDate: today }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        limit: 20,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: weekAgo, endDate: today }],
        dimensions: [{ name: 'eventName' }, { name: 'pagePath' }],
        metrics: [{ name: 'eventCount' }],
        limit: 30,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: weekAgo, endDate: today }],
        dimensions: [{ name: 'pagePath' }, { name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }],
        limit: 30,
      }),
      queryGA4(accessToken, {
        dateRanges: [{ startDate: weekAgo, endDate: today }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'bounceRate' }, { name: 'averageSessionDuration' }, { name: 'screenPageViews' }],
        limit: 20,
      }),
    ]);

    let todayData = null;
    try {
      todayData = await queryGA4(accessToken, {
        dateRanges: [{ startDate: today, endDate: today }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
        limit: 10,
      });
    } catch (e) { /* today data may not be ready */ }

    const totalPageViews = (pageData.rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value), 0);
    const totalSessions = (sourceData.rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value), 0);
    const totalUsers = (sourceData.rows || []).reduce((s, r) => s + parseInt(r.metricValues[1].value), 0);

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      dateRange: `${weekAgo} to ${today} (rolling 7 days)`,
      summary: { totalPageViews, totalSessions, totalUsers },
      topPages: formatRows(pageData.rows, getDimNames(pageData), getMetNames(pageData)),
      trafficSources: formatRows(sourceData.rows, getDimNames(sourceData), getMetNames(sourceData)),
      events: formatRows(eventData.rows, getDimNames(eventData), getMetNames(eventData)),
      eventsByPage: formatRows(pageEventData.rows, getDimNames(pageEventData), getMetNames(pageEventData)),
      landingPageSources: formatRows(landingSourceData.rows, getDimNames(landingSourceData), getMetNames(landingSourceData)),
      engagement: formatRows(engagementData.rows, getDimNames(engagementData), getMetNames(engagementData)),
      today: todayData ? formatRows(todayData.rows, getDimNames(todayData), getMetNames(todayData)) : null,
    });
  } catch (error) {
    console.error('Analytics API error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch analytics data', message: error.message });
  }
}
