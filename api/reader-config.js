// Send only the client key intended for public use. Never forward a private API key.
module.exports = function readerConfig(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).end();
  const url = process.env.ASEVERSE_SUPABASE_URL || '';
  const key = process.env.ASEVERSE_SUPABASE_PUBLISHABLE_KEY || '';
  const enabled = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url) && /^sb_publishable_[a-zA-Z0-9_-]+$/.test(key);
  res.status(200).json(enabled ? {url: url.replace(/\/$/, ''), key} : {enabled: false});
};
