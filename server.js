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
// BLOG SYSTEM — असली, substantive content for students
// हर post की अपनी URL है — Google इन्हें अलग-अलग index करेगा
// ══════════════════════════════════════════════════════

const BLOG_POSTS = {
  'mbbs-first-year-study-guide': {
    title: 'MBBS First Year में कैसे Study करें — Complete Guide 2026',
    description: 'MBBS पहले साल के लिए Anatomy, Physiology, Biochemistry पढ़ने का सही तरीका, Time-table, और Exam की तैयारी की पूरी Guide।',
    date: 'August 1, 2026',
    readTime: '8 min read',
    tag: 'MBBS',
    content: `
      <p>MBBS का पहला साल हर student के लिए सबसे मुश्किल होता है — नया environment, भारी syllabus, और Anatomy जैसे subjects जो school में कभी नहीं पढ़े। यह guide उन students के लिए है जो अभी शुरुआत कर रहे हैं।</p>

      <h2>1. तीन Core Subjects को समझो</h2>
      <p>First year में तीन subjects होते हैं: <strong>Anatomy, Physiology, और Biochemistry</strong>। इनमें से Anatomy सबसे ज़्यादा समय लेता है क्योंकि इसमें Dissection Hall की practical classes भी होती हैं।</p>
      <p>एक common गलती यह है कि students तीनों subjects को बराबर समय देते हैं। असल में Anatomy को कम से कम 40% समय देना चाहिए, बाकी दो को 30-30%।</p>

      <h2>2. Daily Study Routine</h2>
      <p>College के दिनों में यह routine काम करता है:</p>
      <ul>
        <li><strong>सुबह College से पहले:</strong> पिछले दिन की classes revise करो (30 मिनट)</li>
        <li><strong>College के बाद:</strong> उसी दिन की Anatomy/Physiology/Biochem नोट्स बनाओ (2 घंटे)</li>
        <li><strong>रात को:</strong> weak topics पर focus करो, MCQ practice करो (1 घंटा)</li>
      </ul>

      <h2>3. Diagrams बनाना सीखो</h2>
      <p>Anatomy और Physiology में diagrams बनाना सिर्फ marks के लिए नहीं है — यह चीज़ों को समझने और याद रखने का सबसे तेज़ तरीका है। हर topic पढ़ने के बाद उसका diagram अपने शब्दों में बनाने की कोशिश करो, किताब देखे बिना।</p>

      <h2>4. Group Study बनाम Solo Study</h2>
      <p>Anatomy के bones और Biochemistry के pathways group में पढ़ना आसान होता है — एक दूसरे से पूछ सकते हो। लेकिन Physiology के mechanisms को शांति से अकेले समझना बेहतर रहता है।</p>

      <h2>5. Hindi में समझना ठीक है</h2>
      <p>बहुत सारे students यह गलती करते हैं कि सब कुछ अंग्रेज़ी में ही समझने की कोशिश करते हैं, भले ही concept क्लियर न हो। अगर कोई मुश्किल topic पहले Hindi में समझ आए, फिर अंग्रेज़ी में उसकी terminology याद करो — यह ज़्यादा असरदार तरीका है और exam में भी अंग्रेज़ी में ही लिखना होता है, इसलिए दोनों भाषाओं में comfort ज़रूरी है।</p>

      <h2>6. MCQ Practice रोज़ करो</h2>
      <p>सिर्फ पढ़ना काफी नहीं है — हर subject के हर topic के बाद 10-15 MCQs solve करो। इससे पता चलता है कि actually समझ आया या सिर्फ पढ़ा गया।</p>

      <h2>Conclusion</h2>
      <p>MBBS का first year मुश्किल ज़रूर है, लेकिन एक structured routine और सही approach से यह manageable बन जाता है। रोज़ थोड़ा-थोड़ा पढ़ना, exam से पहले रात भर जागने से कहीं बेहतर काम करता है।</p>
    `
  },
  'bams-vs-mbbs-career-guide': {
    title: 'BAMS vs MBBS: कौन सा Course आपके लिए सही है?',
    description: 'BAMS और MBBS के बीच अंतर, Career Opportunities, Salary, और कौन सा course किसके लिए बेहतर है — पूरी जानकारी।',
    date: 'August 3, 2026',
    readTime: '7 min read',
    tag: 'Career',
    content: `
      <p>हर साल लाखों students NEET देने के बाद यह decision लेते हैं — MBBS करें या BAMS। दोनों ही Medical fields हैं, लेकिन इनकी approach, career path, और opportunities काफी अलग हैं।</p>

      <h2>Course की बनावट में अंतर</h2>
      <p><strong>MBBS</strong> Modern (Allopathic) Medicine पर based है — 5.5 साल का course जिसमें Surgery, Medicine, Pharmacology जैसे subjects होते हैं, western medical science के according।</p>
      <p><strong>BAMS</strong> (Bachelor of Ayurvedic Medicine and Surgery) पारंपरिक Ayurveda पर based है, लेकिन साथ में modern Anatomy और Physiology भी पढ़ाई जाती है। यह भी 5.5 साल का course है जिसमें 1 साल की internship शामिल है।</p>

      <h2>Admission Cut-off में अंतर</h2>
      <p>MBBS के लिए Government colleges में NEET का cut-off बहुत ज़्यादा होता है (Top ranks चाहिए)। BAMS के लिए cut-off comparatively कम होता है, जिससे यह उन students के लिए एक अच्छा option बनता है जिनका MBBS में सीधा admission नहीं हो पाता।</p>

      <h2>Career Opportunities</h2>
      <p>MBBS डॉक्टर modern hospitals, clinics में practice करते हैं, आगे MD/MS करके specialist बन सकते हैं। सैलरी और growth ज़्यादा होती है, लेकिन competition भी ज़्यादा है।</p>
      <p>BAMS डॉक्टर Ayurvedic clinics खोल सकते हैं, Government Ayurvedic hospitals में काम कर सकते हैं, Panchakarma centers चला सकते हैं। India में Ayurveda को लेकर awareness तेज़ी से बढ़ रही है, जिससे यह field भी अच्छी growth दिखा रहा है।</p>

      <h2>कौन सा Course चुनें?</h2>
      <p>अगर आपकी रुचि modern medicine, surgery, और western treatment methods में है — MBBS सही रहेगा। अगर आप natural healing, Ayurveda के principles में believe करते हैं, और holistic approach पसंद है — BAMS एक बेहतरीन option है।</p>
      <p>एक common गलतफहमी यह है कि BAMS को "second choice" समझा जाता है। असल में यह एक पूरी तरह अलग और valuable medical science है, न कि MBBS का सस्ता विकल्प।</p>

      <h2>Conclusion</h2>
      <p>दोनों courses अपनी जगह पूरी तरह valid career paths हैं। Decision लेते वक्त सिर्फ cut-off marks नहीं, बल्कि अपनी genuine रुचि को देखना ज़रूरी है — क्योंकि आगे 5.5 साल इसी field में पढ़ना है।</p>
    `
  },
  'nursing-exam-preparation-tips': {
    title: 'Nursing Exams की तैयारी कैसे करें — Practical Tips',
    description: 'GNM, B.Sc Nursing students के लिए Exam preparation, Time management, और Clinical practice की tips।',
    date: 'August 5, 2026',
    readTime: '6 min read',
    tag: 'Nursing',
    content: `
      <p>Nursing की पढ़ाई सिर्फ theory नहीं है — theory के साथ-साथ practical clinical skills भी उतनी ही ज़रूरी हैं। यह combination अक्सर students के लिए time management को मुश्किल बना देता है।</p>

      <h2>Theory और Practical का Balance</h2>
      <p>Nursing students का सबसे बड़ा challenge यह होता है कि Hospital duty के बाद theory पढ़ने की energy नहीं बचती। इसके लिए यह तरीका असरदार है:</p>
      <ul>
        <li>Duty के दौरान जो cases देखो, उनसे related topic उसी दिन पढ़ो — जैसे अगर IV Cannulation किया, तो उसी रात related theory revise करो</li>
        <li>Weekly off के दिन heavy subjects (जैसे Medical-Surgical Nursing) के लिए रखो</li>
      </ul>

      <h2>Core Subjects पर Focus</h2>
      <p>Nursing में Anatomy-Physiology, Medical-Surgical Nursing, Community Health Nursing, और Pharmacology सबसे ज़्यादा weightage वाले subjects हैं। इन्हें रोज़ थोड़ा-थोड़ा पढ़ना ज़रूरी है, exam के करीब सब कुछ cover करना संभव नहीं होता।</p>

      <h2>Drug Dosage Calculations की Practice</h2>
      <p>Nursing exams में और असली practice में भी, drug dosage calculation एक ऐसी skill है जिसमें गलती की गुंजाइश नहीं होती। रोज़ 5-10 calculation problems solve करने की आदत डालो — यह exam में confidence भी देता है और असली patient care में भी ज़रूरी है।</p>

      <h2>Clinical Postings को Seriously लो</h2>
      <p>बहुत से students clinical posting को सिर्फ attendance के लिए करते हैं। असल में यहीं से practical knowledge आता है जो theory exam में भी काम आता है — जब आप किसी procedure को खुद करते हो, तो उसकी theory अपने आप याद हो जाती है।</p>

      <h2>Group Discussion से पहले Self-Study</h2>
      <p>Case studies और care plans को पहले खुद से try करो, फिर group में discuss करो। सीधे group discussion में जाने से आपको अपनी असली समझ का पता नहीं चलता।</p>

      <h2>Conclusion</h2>
      <p>Nursing की पढ़ाई में consistency सबसे ज़रूरी है — duty और study का सही balance बनाकर, हर दिन थोड़ा-थोड़ा आगे बढ़ते रहना, आखिरी रात की तैयारी से कहीं बेहतर परिणाम देता है।</p>
    `
  }
};

function renderBlogPost(slug) {
  const post = BLOG_POSTS[slug];
  if (!post) return null;
  return `<!DOCTYPE html>
<html lang="hi">
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
    <h3>Vion AI से अभी पूछो 🚀</h3>
    <p>MBBS, BAMS, BDS, Nursing, Pharmacy — किसी भी सवाल का instant जवाब पाओ, Hindi या English में।</p>
    <a href="/">Free में शुरू करो →</a>
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
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog · Vion AI — Medical Students के लिए Guides</title>
<meta name="description" content="MBBS, BAMS, BDS, Nursing students के लिए Study Tips, Career Guides, और Exam Preparation की जानकारी।">
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
  <p>Medical students के लिए Study Guides, Career Tips, और Exam Preparation।</p>
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
