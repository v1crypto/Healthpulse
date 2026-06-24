const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.ANTHROPIC_API_KEY;
const UPI_ID  = process.env.UPI_ID || 'your@upi';

// ── /api/chat ────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt, temperature, maxTokens } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens || 1400,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });

    res.json({ success: true, reply: data.content[0].text });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ── /api/mcq ─────────────────────────────────────────────────
app.post('/api/mcq', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });

    res.json({ success: true, reply: data.content[0].text });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ── /api/premium-list ────────────────────────────────────────
app.get('/api/premium-list', (req, res) => {
  // Returns empty list — admin manages premium via Admin Panel in-app
  res.json({ premiumEmails: [] });
});

// ── /api/premium-status ──────────────────────────────────────
app.get('/api/premium-status', (req, res) => {
  // localStorage-based premium is handled on the frontend.
  // This endpoint just returns a safe default.
  res.json({ success: true, isPremium: false });
});

// ── /api/create-payment ──────────────────────────────────────
app.post('/api/create-payment', (req, res) => {
  const { amount, email, plan } = req.body;
  // UPI deep-link — opens GPay / PhonePe / Paytm on user's phone
  const note = encodeURIComponent(`HealthPulse Premium ${plan}`);
  const paymentUrl =
    `upi://pay?pa=${UPI_ID}&pn=HealthPulse&am=${amount}&cu=INR&tn=${note}`;
  res.json({ success: true, paymentUrl });
});

// ── Serve index.html for everything else ────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 HealthPulse running on port ${PORT}`));
