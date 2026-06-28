const express = require('express');
const path = require('path');
const crypto = require('crypto');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY          = process.env.DEEPSEEK_API_KEY;
const UPI_ID           = process.env.UPI_ID || 'your@upi';
const MODEL            = 'deepseek/deepseek-v4-flash';
const RAZORPAY_KEY_ID  = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET  = process.env.RAZORPAY_KEY_SECRET;
const SUPA_URL         = 'https://rnmovgktobwyrifwrrji.supabase.co';
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ── /api/chat ────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt, temperature, maxTokens } = req.body;
    const allMessages = [];
    if (systemPrompt) allMessages.push({ role: 'system', content: systemPrompt });
    allMessages.push(...messages);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://healthpulse-ai-k9hn.onrender.com',
        'X-Title': 'HealthPulse MedLearn'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens || 1400, temperature: temperature || 0.3, messages: allMessages })
    });
    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });
    res.json({ success: true, reply: data.choices[0].message.content });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

// ── /api/mcq ─────────────────────────────────────────────────
app.post('/api/mcq', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://healthpulse-ai-k9hn.onrender.com',
        'X-Title': 'HealthPulse MedLearn'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
    });
    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });
    res.json({ success: true, reply: data.choices[0].message.content });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

// ── /api/create-order (Razorpay) ─────────────────────────────
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, plan } = req.body;
    const amountPaise = amount * 100;

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        notes: { plan }
      })
    });

    const order = await response.json();
    if (order.error) return res.json({ success: false, error: order.error.description });
    res.json({ success: true, orderId: order.id, amount: amountPaise, keyId: RAZORPAY_KEY_ID });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

// ── /api/verify-payment ──────────────────────────────────────
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, plan } = req.body;

    // Signature verify करो
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', RAZORPAY_SECRET).update(body).digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.json({ success: false, error: 'Payment verification failed!' });
    }

    // Premium days calculate करो
    const days = plan === 'yearly' ? 365 : 30;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    // Supabase में save करो
    const supaRes = await fetch(`${SUPA_URL}/rest/v1/premium_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_SERVICE_KEY,
        'Authorization': `Bearer ${SUPA_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        email,
        plan,
        expires_at: expiresAt,
        payment_id: razorpay_payment_id
      })
    });

    if (!supaRes.ok) {
      const err = await supaRes.text();
      return res.json({ success: false, error: 'DB error: ' + err });
    }

    res.json({ success: true, message: 'Premium activated!', expiresAt });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

// ── /api/check-premium ───────────────────────────────────────
app.get('/api/check-premium', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ success: true, isPremium: false });

    const response = await fetch(
      `${SUPA_URL}/rest/v1/premium_users?email=eq.${encodeURIComponent(email)}&select=*`,
      {
        headers: {
          'apikey': SUPA_SERVICE_KEY,
          'Authorization': `Bearer ${SUPA_SERVICE_KEY}`
        }
      }
    );

    const data = await response.json();
    if (!data || data.length === 0) return res.json({ success: true, isPremium: false });

    const user = data[0];
    const isActive = new Date(user.expires_at) > new Date();
    res.json({
      success: true,
      isPremium: isActive,
      plan: user.plan,
      expiresAt: user.expires_at
    });
  } catch (err) { res.json({ success: false, isPremium: false }); }
});

// ── /api/premium-list ────────────────────────────────────────
app.get('/api/premium-list', async (req, res) => {
  try {
    const response = await fetch(
      `${SUPA_URL}/rest/v1/premium_users?select=email,expires_at`,
      {
        headers: {
          'apikey': SUPA_SERVICE_KEY,
          'Authorization': `Bearer ${SUPA_SERVICE_KEY}`
        }
      }
    );
    const data = await response.json();
    const activeEmails = (data || [])
      .filter(u => new Date(u.expires_at) > new Date())
      .map(u => u.email);
    res.json({ premiumEmails: activeEmails });
  } catch (err) { res.json({ premiumEmails: [] }); }
});

// ── /api/premium-status ──────────────────────────────────────
app.get('/api/premium-status', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.json({ success: true, isPremium: false });
  try {
    const response = await fetch(
      `${SUPA_URL}/rest/v1/premium_users?email=eq.${encodeURIComponent(email)}&select=*`,
      { headers: { 'apikey': SUPA_SERVICE_KEY, 'Authorization': `Bearer ${SUPA_SERVICE_KEY}` } }
    );
    const data = await response.json();
    if (!data || data.length === 0) return res.json({ success: true, isPremium: false });
    const user = data[0];
    const isActive = new Date(user.expires_at) > new Date();
    res.json({ success: true, isPremium: isActive, expiry: user.expires_at });
  } catch (err) { res.json({ success: true, isPremium: false }); }
});

// ── Serve index.html ─────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 HealthPulse running on port ${PORT}`));
