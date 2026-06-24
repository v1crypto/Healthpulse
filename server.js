const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.DEEPSEEK_API_KEY;
const UPI_ID  = process.env.UPI_ID || 'your@upi';
const MODEL   = 'deepseek/deepseek-v4-flash';

// /api/chat
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
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens || 1400,
        temperature: temperature || 0.3,
        messages: allMessages
      })
    });

    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });
    res.json({ success: true, reply: data.choices[0].message.content });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// /api/mcq
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
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });
    res.json({ success: true, reply: data.choices[0].message.content });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// /api/premium-list
app.get('/api/premium-list', (req, res) => {
  res.json({ premiumEmails: [] });
});

// /api/premium-status
app.get('/api/premium-status', (req, res) => {
  res.json({ success: true, isPremium: false });
});

// /api/create-payment
app.post('/api/create-payment', (req, res) => {
  const { amount, plan } = req.body;
  const note = encodeURIComponent(`HealthPulse Premium ${plan}`);
  const paymentUrl = `upi://pay?pa=${UPI_ID}&pn=HealthPulse&am=${amount}&cu=INR&tn=${note}`;
  res.json({ success: true, paymentUrl });
});

// Serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 HealthPulse running on port ${PORT}`));
