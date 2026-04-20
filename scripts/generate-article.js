#!/usr/bin/env node
'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://thelaunchedge.vercel.app';
const PUBLIC_DIR = path.join(__dirname, '../public');
const ESSAYS_DIR = path.join(PUBLIC_DIR, 'essays');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

function getNextIssueNumber() {
  let maxNum = 47;
  if (!fs.existsSync(ESSAYS_DIR)) return maxNum + 1;
  for (const cluster of fs.readdirSync(ESSAYS_DIR)) {
    const clusterPath = path.join(ESSAYS_DIR, cluster);
    if (!fs.statSync(clusterPath).isDirectory()) continue;
    for (const file of fs.readdirSync(clusterPath)) {
      if (!file.endsWith('.html') || file === 'index.html') continue;
      const content = fs.readFileSync(path.join(clusterPath, file), 'utf8');
      const m = content.match(/№\s*0*(\d+)/);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1]));
    }
  }
  return maxNum + 1;
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toLowerCase().replace(',', '');
}

function buildHtml(article, topic, issueNum, isoDate, displayDate) {
  const slug = topic.slug;
  const cluster = topic.cluster;
  const canonicalUrl = `${SITE_URL}/essays/${cluster}/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.metaDescription,
        datePublished: isoDate,
        dateModified: isoDate,
        author: { '@type': 'Organization', name: 'The Launch Edge', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'The Launch Edge', url: SITE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        keywords: (article.keywords || topic.keywords).join(', '),
        articleSection: topic.clusterLabel,
        inLanguage: 'en-SG',
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Essays', item: `${SITE_URL}/essays` },
          { '@type': 'ListItem', position: 3, name: topic.clusterLabel, item: `${SITE_URL}/essays/${cluster}` },
          { '@type': 'ListItem', position: 4, name: article.title, item: canonicalUrl },
        ],
      },
    ],
  };

  // Build body HTML
  let body = '';

  for (const sec of article.sections || []) {
    body += `\n  <h2>${sec.h2}</h2>\n  ${sec.content}`;
    if (sec.pullQuote) body += `\n  <div class="pullquote">${sec.pullQuote}</div>`;
  }

  if (article.frameworkList) {
    body += `\n  <h2>${article.frameworkList.h2}</h2>\n  <ul class="rules">`;
    for (const item of article.frameworkList.items) {
      body += `\n    <li><span class="n">${item.n}</span><div><b>${item.label}.</b> ${item.content}</div></li>`;
    }
    body += `\n  </ul>`;
  }

  if (article.faqs && article.faqs.length) {
    body += `\n  <h2>Frequently asked questions.</h2>\n  <div class="faq">`;
    for (const faq of article.faqs) {
      body += `\n    <div class="faq-item"><h3>${faq.q}</h3><p>${faq.a}</p></div>`;
    }
    body += `\n  </div>`;
  }

  const issueLabel = String(issueNum).padStart(3, '0');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${article.title} — Edge Notes · The Launch Edge</title>
<meta name="description" content="${article.metaDescription}" />
<meta name="keywords" content="${(article.keywords || topic.keywords).join(', ')}" />
<link rel="canonical" href="${canonicalUrl}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${article.title}" />
<meta property="og:description" content="${article.metaDescription}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:site_name" content="The Launch Edge" />
<meta property="article:published_time" content="${isoDate}" />
<meta property="article:section" content="${topic.clusterLabel}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${article.title}" />
<meta name="twitter:description" content="${article.metaDescription}" />
<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/article.css">
</head>
<body>
<header class="masthead"><div class="wrap">
  <a href="/" class="back">← Edge <em>Notes</em></a>
  <div class="meta"><span>№ ${issueLabel} · ${topic.clusterLabel}</span><span>${displayDate}</span><span>${article.readTime}</span></div>
</div></header>

<article class="article"><div class="wrap">
  <div class="kicker"><span class="bar"></span> Essay · ${topic.clusterLabel.toLowerCase()}</div>
  <h1>${article.titleHtml || article.title}</h1>
  <p class="deck">${article.deck}</p>
${body}

  <div class="cta-block">
    <h3>Get the next essay.</h3>
    <p>Sunday editions, no listicles. ~1,200 operators and founders read them.</p>
    <a href="/#writing" class="btn">Subscribe →</a>
  </div>
</div></article>

<footer class="foot"><div class="wrap"><a href="/">← Back to The Launch Edge</a><span>Edge Notes № ${issueLabel} · ${displayDate} · Singapore</span></div></footer>

<script>
const root = document.documentElement;
const saved = localStorage.getItem('tle-theme');
if (saved === 'dark') root.setAttribute('data-theme', 'dark');
</script>
</body>
</html>`;
}

function addToSitemap(topic, isoDate) {
  if (!fs.existsSync(SITEMAP_PATH)) return;
  let xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const loc = `${SITE_URL}/essays/${topic.cluster}/${topic.slug}`;
  if (xml.includes(loc)) return; // already present
  const entry = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  xml = xml.replace('</urlset>', `${entry}\n</urlset>`);
  fs.writeFileSync(SITEMAP_PATH, xml);
}

async function generateArticle(topic) {
  const client = new Anthropic();
  const issueNum = getNextIssueNumber();
  const now = new Date();
  const isoDate = now.toISOString().split('T')[0];
  const displayDate = formatDate(now);

  console.log(`\n→ [${topic.cluster}] ${topic.title}`);
  console.log(`  Keywords: ${topic.keywords.slice(0, 3).join(', ')}`);

  const prompt = `You are writing for The Launch Edge, a Singapore-based operator consulting firm. The principal ran launches and growth for foodpanda Asia (14 markets) and foodora Europe, led subscriptions/retention/growth product at a YC-backed fintech live in 150+ countries, and earlier worked in Singapore Government economic development. 40+ consulting engagements across SEA, Europe, Türkiye, Taiwan, Australia.

BRAND VOICE:
- First-person plural always: "we", "our practice", "our bench" — never "I"
- Operator-led voice: write from inside the work, not above it
- Dense insight, zero filler. Every sentence must earn its place.
- No bullet-point listicles. Use prose, or the <ul class="rules"> framework format
- Pull quotes land like a punch — one devastating sentence
- Casual confidence: not corporate, not startup-bro
- Examples: always specific — real industries, real geographies, real numbers
- Audience: founders/CEOs in Asia (mostly SEA), operators, senior executives

TOPIC: ${topic.title}
CLUSTER: ${topic.clusterLabel}
PRIMARY KEYWORDS: ${topic.keywords.join(', ')}
SECONDARY KEYWORDS: ${(topic.secondaryKeywords || []).join(', ')}

Generate a JSON object for a 2,200-word SEO article. Return ONLY valid JSON — no markdown, no explanation, no code fences.

Schema:
{
  "title": "string — exact H1 title, include primary keyword naturally",
  "titleHtml": "string — same title with <em> wrapping 1-2 key words for italic accent",
  "deck": "string — 2-sentence lede. Sentence 1: counterintuitive claim or high stakes. Sentence 2: what this essay delivers.",
  "metaDescription": "string — max 150 chars, includes primary keyword, creates curiosity or urgency",
  "keywords": ["array of 6-8 keywords"],
  "readTime": "X min",
  "sections": [
    {
      "h2": "string — declarative or punchy, no question marks",
      "content": "string — 3-4 <p> tags, 280-350 words, specific examples, operator voice",
      "pullQuote": "string or null — include for exactly ONE section, 1 devastating sentence"
    }
  ],
  "frameworkList": {
    "h2": "string — e.g. 'The five things we do first.'",
    "items": [
      { "n": "01", "label": "Item label", "content": "2-3 sentence sharp explanation" }
    ]
  },
  "faqs": [
    { "q": "string — question using search keywords", "a": "string — 2-3 sentence direct answer" }
  ]
}

Requirements:
- 5 sections (sections array) + 1 frameworkList + 4 FAQs
- Exactly 1 pullQuote across all sections
- frameworkList has 5 items
- Total ~2,200 words
- Concrete Asia-specific examples with industries, numbers, geographies
- Last section = practical "What to do next." or "How we'd start."
- FAQs target real search intent around the keywords`;

  process.stdout.write('  Generating');
  let jsonText = '';

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      jsonText += chunk.delta.text;
      if (jsonText.length % 500 < 5) process.stdout.write('.');
    }
  }
  console.log(' done');

  // Parse — strip any accidental markdown fencing
  const raw = jsonText.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  let article;
  try {
    article = JSON.parse(raw);
  } catch (e) {
    const m = raw.match(/\{[\s\S]+\}/);
    if (!m) throw new Error('Could not extract JSON from response:\n' + raw.slice(0, 300));
    article = JSON.parse(m[0]);
  }

  const html = buildHtml(article, topic, issueNum, isoDate, displayDate);

  const outDir = path.join(ESSAYS_DIR, topic.cluster);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${topic.slug}.html`);
  fs.writeFileSync(outPath, html);

  addToSitemap(topic, isoDate);

  console.log(`  ✓ Saved: public/essays/${topic.cluster}/${topic.slug}.html`);
  return outPath;
}

async function main() {
  const { topics } = require('./topics');
  const args = process.argv.slice(2);

  let queue = [];

  if (args.includes('--auto')) {
    const published = new Set();
    if (fs.existsSync(ESSAYS_DIR)) {
      for (const cluster of fs.readdirSync(ESSAYS_DIR)) {
        const cp = path.join(ESSAYS_DIR, cluster);
        if (!fs.statSync(cp).isDirectory()) continue;
        for (const f of fs.readdirSync(cp)) {
          if (f.endsWith('.html') && f !== 'index.html') published.add(f.replace('.html', ''));
        }
      }
    }
    queue = topics.filter(t => !published.has(t.slug)).slice(0, 1);
    if (!queue.length) { console.log('All topics published!'); process.exit(0); }

  } else if (args.includes('--seed')) {
    queue = topics.filter(t => t.seed);

  } else {
    const slugArg = args.find(a => a.startsWith('--slug='));
    if (slugArg) {
      const slug = slugArg.replace('--slug=', '');
      const t = topics.find(t => t.slug === slug);
      if (!t) { console.error(`Unknown slug: ${slug}`); process.exit(1); }
      queue = [t];
    } else {
      console.log('Usage:');
      console.log('  node scripts/generate-article.js --seed      # generate all 5 seed articles');
      console.log('  node scripts/generate-article.js --auto      # generate next unpublished topic');
      console.log('  node scripts/generate-article.js --slug=<s>  # generate specific article');
      process.exit(0);
    }
  }

  for (const topic of queue) {
    await generateArticle(topic);
  }

  console.log(`\n✓ Done. ${queue.length} article(s) generated.`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
