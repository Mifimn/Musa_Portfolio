export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passkey } = req.body;

  if (passkey && passkey === process.env.ADMIN_SECRET) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, error: 'ACCESS DENIED: INVALID KEY' });
}
