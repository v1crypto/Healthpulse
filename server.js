const express = require('express');
const path = require('path');
const crypto = require('crypto');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

const API_KEY          = process.env.DEEPSEEK_API_KEY;
const UPI_ID           = process.env.UPI_ID || 'your@upi';
const MODEL            = 'deepseek/deepseek-v4-flash';
const RAZORPAY_KEY_ID  = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET  = process.env.RAZORPAY_KEY_SECRET;
const SUPA_URL         = 'https://rnmovgktobwyrifwrrji.supabase.co';
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ══════════════════════════════════════════════════════
// BLOG SYSTEM — English content for global reach
// ══════════════════════════════════════════════════════

const BLOG_POSTS = {
  'mbbs-first-year-study-guide': {
    title: 'How to Study in MBBS First Year — Complete Guide 2026',
    description: 'The right way to study Anatomy, Physiology, and Biochemistry in MBBS first year, with a daily timetable and exam preparation strategy.',
    date: 'August 1, 2026',
    readTime: '8 min read',
    tag: 'MBBS',
    content: `
      <p>The first year of MBBS is the hardest transition for most students — a new environment, a heavy syllabus, and subjects like Anatomy that you've never encountered in school. This guide is for students who are just getting started.</p>

      <h2>1. Understand the Three Core Subjects</h2>
      <p>First year MBBS revolves around three subjects: <strong>Anatomy, Physiology, and Biochemistry</strong>. Of these, Anatomy takes up the most time because it includes practical Dissection Hall sessions alongside theory.</p>
      <p>A common mistake is giving all three subjects equal time. In reality, Anatomy deserves at least 40% of your study time, with Physiology and Biochemistry splitting the remaining 60%.</p>

      <h2>2. Build a Daily Study Routine</h2>
      <p>During college days, this routine tends to work well:</p>
      <ul>
        <li><strong>Before college:</strong> Revise the previous day's lecture notes (30 minutes)</li>
        <li><strong>After college:</strong> Make fresh notes on that day's Anatomy/Physiology/Biochem topics (2 hours)</li>
        <li><strong>At night:</strong> Focus on weak topics and practice MCQs (1 hour)</li>
      </ul>

      <h2>3. Learn to Draw Diagrams</h2>
      <p>Drawing diagrams in Anatomy and Physiology isn't just for exam marks — it's one of the fastest ways to actually understand and retain information. After studying each topic, try recreating its diagram from memory, without looking at the book.</p>

      <h2>4. Group Study vs. Solo Study</h2>
      <p>Anatomy's bones and Biochemistry's metabolic pathways are easier to memorize in a group — you can quiz each other. But Physiology's mechanisms are usually better understood quietly, on your own, without distractions.</p>

      <h2>5. Don't Rush Past Language Comfort</h2>
      <p>Many students make the mistake of forcing themselves to understand everything in English immediately, even when the concept isn't clear. If a difficult topic makes more sense when you first think it through in your native language, do that — then switch to English terminology once the concept clicks. Exams require English answers, so building comfort in both matters, but understanding always comes first.</p>

      <h2>6. Practice MCQs Every Day</h2>
      <p>Reading alone isn't enough — after every topic in every subject, solve 10-15 MCQs. This is the fastest way to find out whether you actually understood the material or just read through it.</p>

      <h2>Conclusion</h2>
      <p>MBBS first year is genuinely tough, but a structured routine and the right approach make it manageable. Studying a little every day consistently beats cramming the night before an exam, every single time.</p>
    `
  },
  'bams-vs-mbbs-career-guide': {
    title: 'BAMS vs MBBS: Which Course Is Right for You?',
    description: 'A complete comparison of BAMS and MBBS — course structure, career opportunities, salary potential, and how to decide which path fits you.',
    date: 'August 3, 2026',
    readTime: '7 min read',
    tag: 'Career',
    content: `
      <p>Every year, lakhs of students face this exact decision after NEET — should they pursue MBBS or BAMS? Both are legitimate medical fields, but their approach, career trajectory, and opportunities differ significantly.</p>

      <h2>Course Structure Differences</h2>
      <p><strong>MBBS</strong> is based on Modern (Allopathic) Medicine — a 5.5-year course covering Surgery, Medicine, and Pharmacology according to Western medical science principles.</p>
      <p><strong>BAMS</strong> (Bachelor of Ayurvedic Medicine and Surgery) is rooted in traditional Ayurveda, but also includes modern Anatomy and Physiology. It's also a 5.5-year course, including a mandatory 1-year internship.</p>

      <h2>Admission Cut-off Differences</h2>
      <p>MBBS cut-offs in government colleges via NEET are extremely competitive — you need top ranks. BAMS cut-offs are comparatively lower, making it a solid option for students who don't secure direct MBBS admission.</p>

      <h2>Career Opportunities</h2>
      <p>MBBS doctors practice in modern hospitals and clinics, and can pursue MD/MS to specialize further. Earning potential and growth are generally higher, but so is the competition.</p>
      <p>BAMS doctors can open Ayurvedic clinics, work in government Ayurvedic hospitals, or run Panchakarma centers. Awareness and demand for Ayurveda in India is growing rapidly, and this field is showing strong growth as a result.</p>

      <h2>How Should You Decide?</h2>
      <p>If your interest lies in modern medicine, surgery, and Western treatment methods — MBBS is the right fit. If you believe in natural healing principles rooted in Ayurveda and prefer a holistic approach — BAMS is an excellent option.</p>
      <p>A common misconception is treating BAMS as a "backup" or "second choice." In reality, it's a completely distinct and valuable medical science, not a cheaper alternative to MBBS.</p>

      <h2>Conclusion</h2>
      <p>Both courses are entirely valid career paths in their own right. When deciding, look beyond just the cut-off marks — consider your genuine interest, because you'll be spending 5.5 years deeply immersed in this field.</p>
    `
  },
  'nursing-exam-preparation-tips': {
    title: 'How to Prepare for Nursing Exams — Practical Tips',
    description: 'Exam preparation, time management, and clinical practice tips for GNM and B.Sc Nursing students.',
    date: 'August 5, 2026',
    readTime: '6 min read',
    tag: 'Nursing',
    content: `
      <p>Nursing education isn't just theory — clinical hands-on skills matter just as much. This combination often makes time management one of the biggest challenges nursing students face.</p>

      <h2>Balancing Theory and Practical Work</h2>
      <p>The biggest struggle for nursing students is having no energy left for theory after a full hospital duty shift. This approach tends to work well:</p>
      <ul>
        <li>Study the related theory topic the same day as your duty — for example, if you performed IV Cannulation, revise the related theory that same night while it's fresh</li>
        <li>Reserve your weekly off day for heavier subjects like Medical-Surgical Nursing</li>
      </ul>

      <h2>Focus on Core Subjects</h2>
      <p>Anatomy-Physiology, Medical-Surgical Nursing, Community Health Nursing, and Pharmacology carry the most weightage in nursing exams. These need daily, incremental study — trying to cover everything right before exams simply isn't realistic.</p>

      <h2>Practice Drug Dosage Calculations</h2>
      <p>In both nursing exams and real clinical practice, drug dosage calculation is a skill where mistakes aren't an option. Build a daily habit of solving 5-10 calculation problems — it builds exam confidence and is genuinely essential for patient safety later.</p>

      <h2>Take Clinical Postings Seriously</h2>
      <p>Many students treat clinical posting as just an attendance requirement. In reality, this is where practical knowledge comes from, and it directly reinforces theory exam preparation — when you actually perform a procedure yourself, the underlying theory tends to stick automatically.</p>

      <h2>Self-Study Before Group Discussion</h2>
      <p>Try working through case studies and care plans on your own first, then discuss them in a group. Jumping straight into group discussion without individual effort means you never really find out how well you understand the material on your own.</p>

      <h2>Conclusion</h2>
      <p>Consistency is everything in nursing studies — striking the right balance between duty and study, and making steady daily progress, produces far better results than any last-minute cramming session.</p>
    `
  }
};

function renderBlogPost(slug) {
  const post = BLOG_POSTS[slug];
  if (!post) return null;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${post.title} · Vion AI Blog</title>
<meta name="description" content="${post.description}">
<link rel="canonical" href="https://vionai.in/blog/${slug}">
<meta property="og:title" content="${post.title}">
<meta property="og:description" content="${post.description}">
<meta property="og:type" content="article">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#050508;color:#f0f0f5;font-family:'Outfit',sans-serif;line-height:1.7}
  .nav{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:rgba(5,5,8,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06);z-index:10}
  .brand{display:flex;align-items:center;gap:9px;text-decoration:none}
  .brand-icon{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#c2ff3d,#9d6cff);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#000}
  .brand-name{font-size:16px;font-weight:800;color:#f0f0f5}
  .brand-name em{font-style:normal;background:linear-gradient(135deg,#c2ff3d,#00e5ff);-webkit-background-clip:text;background-clip:text;color:transparent}
  .back{background:transparent;border:1.5px solid rgba(255,255,255,.12);color:#f0f0f5;padding:7px 16px;border-radius:99px;font-size:13px;font-weight:700;text-decoration:none}
  article{max-width:680px;margin:0 auto;padding:40px 20px 80px}
  .tag{display:inline-block;background:rgba(194,255,61,.08);border:1px solid rgba(194,255,61,.2);color:#c2ff3d;font-size:11px;font-family:'JetBrains Mono';font-weight:700;padding:4px 12px;border-radius:99px;margin-bottom:16px}
  h1{font-size:32px;font-weight:900;line-height:1.2;margin-bottom:16px}
  .meta{font-size:13px;color:#7070a0;margin-bottom:32px;font-family:'JetBrains Mono'}
  article h2{font-size:20px;font-weight:800;margin:32px 0 12px;color:#c2ff3d}
  article p{font-size:16px;color:#c8c8d8;margin-bottom:14px}
  article ul{padding-left:20px;margin-bottom:14px}
  article li{font-size:16px;color:#c8c8d8;margin-bottom:8px}
  article strong{color:#f0f0f5}
  .cta{background:linear-gradient(135deg,rgba(194,255,61,.08),rgba(157,108,255,.08));border:1px solid rgba(194,255,61,.2);border-radius:16px;padding:24px;margin-top:40px;text-align:center}
  .cta h3{font-size:18px;margin-bottom:8px}
  .cta p{font-size:14px;color:#9090b8;margin-bottom:16px}
  .cta a{display:inline-block;background:linear-gradient(135deg,#c2ff3d,#00e5ff);color:#000;padding:12px 28px;border-radius:99px;font-weight:800;text-decoration:none;font-size:14px}
</style>
</head>
<body>
<nav class="nav">
  <a href="/" class="brand"><div class="brand-icon">V</div><div class="brand-name">Vion <em>AI</em></div></a>
  <a href="/blog" class="back">← All Posts</a>
</nav>
<article>
  <div class="tag">${post.tag}</div>
  <h1>${post.title}</h1>
  <div class="meta">${post.date} · ${post.readTime}</div>
  ${post.content}
  <div class="cta">
    <h3>Ask Vion AI Now 🚀</h3>
    <p>Get instant answers for MBBS, BAMS, BDS, Nursing, Pharmacy — in Hindi or English.</p>
    <a href="/">Start Free →</a>
  </div>
</article>
</body>
</html>`;
}

function renderBlogIndex() {
  const posts = Object.entries(BLOG_POSTS).map(([slug, p]) => `
    <a href="/blog/${slug}" class="post-card">
      <div class="tag">${p.tag}</div>
      <h2>${p.title}</h2>
      <p>${p.description}</p>
      <div class="meta">${p.date} · ${p.readTime}</div>
    </a>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog · Vion AI — Guides for Medical Students</title>
<meta name="description" content="Study tips, career guides, and exam preparation content for MBBS, BAMS, BDS, and Nursing students.">
<link rel="canonical" href="https://vionai.in/blog">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#050508;color:#f0f0f5;font-family:'Outfit',sans-serif}
  .nav{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:rgba(5,5,8,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06)}
  .brand{display:flex;align-items:center;gap:9px;text-decoration:none}
  .brand-icon{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#c2ff3d,#9d6cff);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#000}
  .brand-name{font-size:16px;font-weight:800;color:#f0f0f5}
  .brand-name em{font-style:normal;background:linear-gradient(135deg,#c2ff3d,#00e5ff);-webkit-background-clip:text;background-clip:text;color:transparent}
  .back{background:transparent;border:1.5px solid rgba(255,255,255,.12);color:#f0f0f5;padding:7px 16px;border-radius:99px;font-size:13px;font-weight:700;text-decoration:none}
  .hero{max-width:680px;margin:0 auto;padding:48px 20px 24px}
  .hero h1{font-size:32px;font-weight:900;margin-bottom:10px}
  .hero p{font-size:15px;color:#7070a0}
  .posts{max-width:680px;margin:0 auto;padding:0 20px 60px;display:flex;flex-direction:column;gap:14px}
  .post-card{display:block;background:#0d0d18;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;text-decoration:none;transition:border-color .2s}
  .post-card:hover{border-color:rgba(194,255,61,.3)}
  .tag{display:inline-block;background:rgba(194,255,61,.08);border:1px solid rgba(194,255,61,.2);color:#c2ff3d;font-size:10px;font-family:'JetBrains Mono';font-weight:700;padding:3px 10px;border-radius:99px;margin-bottom:10px}
  .post-card h2{font-size:18px;font-weight:800;color:#f0f0f5;margin-bottom:6px;line-height:1.3}
  .post-card p{font-size:13px;color:#9090b8;margin-bottom:10px;line-height:1.6}
  .post-card .meta{font-size:11px;color:#5a5a72;font-family:'JetBrains Mono'}
</style>
</head>
<body>
<nav class="nav">
  <a href="/" class="brand"><div class="brand-icon">V</div><div class="brand-name">Vion <em>AI</em></div></a>
  <a href="/" class="back">← Home</a>
</nav>
<div class="hero">
  <h1>Vion AI Blog</h1>
  <p>Study guides, career tips, and exam preparation for medical students.</p>
</div>
<div class="posts">${posts}</div>
</body>
</html>`;
}

app.get('/blog', (req, res) => res.send(renderBlogIndex()));
app.get('/blog/:slug', (req, res) => {
  const html = renderBlogPost(req.params.slug);
  if (!html) return res.status(404).send('Post not found');
  res.send(html);
});

// ══════════════════════════════════════════════════════
// EXISTING API ROUTES
// ══════════════════════════════════════════════════════

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
        'HTTP-Referer': 'https://vionai.in',
        'X-Title': 'Vion AI MedLearn'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens || 1400, temperature: temperature || 0.3, messages: allMessages })
    });
    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });
    res.json({ success: true, reply: data.choices[0].message.content });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

app.post('/api/mcq', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://vionai.in',
        'X-Title': 'Vion AI MedLearn'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
    });
    const data = await response.json();
    if (data.error) return res.json({ success: false, error: data.error.message });
    res.json({ success: true, reply: data.choices[0].message.content });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, plan } = req.body;
    const amountPaise = amount * 100;
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${auth}` },
      body: JSON.stringify({ amount: amountPaise, currency: 'INR', notes: { plan } })
    });
    const order = await response.json();
    if (order.error) return res.json({ success: false, error: order.error.description });
    res.json({ success: true, orderId: order.id, amount: amountPaise, keyId: RAZORPAY_KEY_ID });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, plan } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', RAZORPAY_SECRET).update(body).digest('hex');
    if (expectedSig !== razorpay_signature) return res.json({ success: false, error: 'Payment verification failed!' });
    const days = plan === 'yearly' ? 365 : 30;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const supaRes = await fetch(`${SUPA_URL}/rest/v1/premium_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_SERVICE_KEY,
        'Authorization': `Bearer ${SUPA_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ email, plan, expires_at: expiresAt, payment_id: razorpay_payment_id })
    });
    if (!supaRes.ok) { const err = await supaRes.text(); return res.json({ success: false, error: 'DB error: ' + err }); }
    res.json({ success: true, message: 'Premium activated!', expiresAt });
  } catch (err) { res.json({ success: false, error: err.message }); }
});

app.get('/api/check-premium', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ success: true, isPremium: false });
    const response = await fetch(`${SUPA_URL}/rest/v1/premium_users?email=eq.${encodeURIComponent(email)}&select=*`, {
      headers: { 'apikey': SUPA_SERVICE_KEY, 'Authorization': `Bearer ${SUPA_SERVICE_KEY}` }
    });
    const data = await response.json();
    if (!data || data.length === 0) return res.json({ success: true, isPremium: false });
    const user = data[0];
    const isActive = new Date(user.expires_at) > new Date();
    res.json({ success: true, isPremium: isActive, plan: user.plan, expiresAt: user.expires_at });
  } catch (err) { res.json({ success: false, isPremium: false }); }
});

app.get('/api/premium-list', async (req, res) => {
  try {
    const response = await fetch(`${SUPA_URL}/rest/v1/premium_users?select=email,expires_at`, {
      headers: { 'apikey': SUPA_SERVICE_KEY, 'Authorization': `Bearer ${SUPA_SERVICE_KEY}` }
    });
    const data = await response.json();
    const activeEmails = (data || []).filter(u => new Date(u.expires_at) > new Date()).map(u => u.email);
    res.json({ premiumEmails: activeEmails });
  } catch (err) { res.json({ premiumEmails: [] }); }
});

app.get('/api/premium-status', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.json({ success: true, isPremium: false });
  try {
    const response = await fetch(`${SUPA_URL}/rest/v1/premium_users?email=eq.${encodeURIComponent(email)}&select=*`, {
      headers: { 'apikey': SUPA_SERVICE_KEY, 'Authorization': `Bearer ${SUPA_SERVICE_KEY}` }
    });
    const data = await response.json();
    if (!data || data.length === 0) return res.json({ success: true, isPremium: false });
    const user = data[0];
    const isActive = new Date(user.expires_at) > new Date();
    res.json({ success: true, isPremium: isActive, expiry: user.expires_at });
  } catch (err) { res.json({ success: true, isPremium: false }); }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Vion AI running on port ${PORT}`));
