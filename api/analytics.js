// Vercel Serverless Function — GA4 Analytics Data API
// Uses direct HTTPS calls — no extra npm packages needed
import { createSign } from 'crypto';

const GA4_PROPERTY_ID = '518699898';
const CREDENTIALS = JSON.parse(process.env.GOOGLE_ANALYTICS_CREDENTIALS || '{}');

async function getAccessToken() {
  if (!CREDENTIALS.client_email || !CREDENTIALS.private_key) {
    throw new Error('GOOGLE_ANALYTICS_CREDENTIALS env var not set or invalid');
  }

  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const jwtClaim = Buffer.from(JSON.stringify({
    iss: CREDENTIALS.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const signingInput = `${jwtHeader}.${jwtClaim}`;
  const signingKey = CREDENTIALS.private_key.replace(/\\n/g, '\n');
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(signingKey, 'base64url');
  const signedJwt = `${signingInput}.${signature}`;

  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth2:grant-type:jwt-bearer',
      assertion: signedJwt,
    }),
  });
  const tokenData = await tokenResp.json();
  if (!tokenData.access_token) throw new Error('Failed to get access token: ' + JSON.stringify(tokenData));
  return tokenData.access_token;
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const accessToken = await getAccessToken();

    const [pageData, sourceData, eventData, pageEventData, landingSourceData, engagementData] = await Promise.all([
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

    let todayData = null;
    try {
      todayData = await queryGA4(accessToken, {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
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
      dateRange: '2026-03-17 to 2026-03-23 (7 days)',
      summary: { totalPageViews, totalSessions, totalUsers },
      topPages: formatRows(pageData.rows, pageData.dimensions.map(d => d.name), pageData.metrics.map(m => m.name)),
      trafficSources: formatRows(sourceData.rows, sourceData.dimensions.map(d => d.name), sourceData.metrics.map(m => m.name)),
      events: formatRows(eventData.rows, eventData.dimensions.map(d => d.name), eventData.metrics.map(m => m.name)),
      eventsByPage: formatRows(pageEventData.rows, pageEventData.dimensions.map(d => d.name), pageEventData.metrics.map(m => m.name)),
      landingPageSources: formatRows(landingSourceData.rows, landingSourceData.dimensions.map(d => d.name), landingSourceData.metrics.map(m => m.name)),
      engagement: formatRows(engagementData.rows, engagementData.dimensions.map(d => d.name), engagementData.metrics.map(m => m.name)),
      today: todayData ? formatRows(todayData.rows, todayData.dimensions.map(d => d.name), todayData.metrics.map(m => m.name)) : null,
    });
  } catch (error) {
    console.error('Analytics API error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch analytics data', message: error.message });
  }
}
