// Content calendar — 5 clusters, 24 topics
// seed: true = generate first (covers each cluster)
// published: auto-set by generator when file exists

const topics = [

  // ── CLUSTER 1: founder-craft ──────────────────────────────────────────
  {
    slug: 'why-your-consulting-engagement-failed',
    cluster: 'founder-craft',
    clusterLabel: 'Founder Craft',
    title: 'Why your consulting engagement failed before it started',
    keywords: ['consulting engagement', 'founder advice Singapore', 'how to hire a consultant', 'consulting scope'],
    secondaryKeywords: ['fractional consulting', 'scope memo', 'operator consulting Singapore'],
    seed: true,
  },
  {
    slug: 'how-to-brief-a-fractional-operator',
    cluster: 'founder-craft',
    clusterLabel: 'Founder Craft',
    title: 'How to brief a fractional operator (and get ten times the output)',
    keywords: ['fractional operator', 'fractional CPO brief', 'how to work with consultants', 'fractional leadership'],
    secondaryKeywords: ['operator consulting', 'brief a consultant', 'fractional executive Singapore'],
  },
  {
    slug: 'the-90-day-operator-plan',
    cluster: 'founder-craft',
    clusterLabel: 'Founder Craft',
    title: 'The 90-day operator plan: what actually happens when we start',
    keywords: ['fractional CPO first 90 days', 'operator onboarding', 'consulting first 90 days', 'fractional executive plan'],
    secondaryKeywords: ['fractional CPO Singapore', 'operator consulting SEA', 'startup fractional executive'],
  },
  {
    slug: 'positioning-for-solo-operators',
    cluster: 'founder-craft',
    clusterLabel: 'Founder Craft',
    title: 'Positioning for solo operators: how ex-corporate talent builds a practice',
    keywords: ['positioning for consultants', 'solo operator Singapore', 'ex-corporate consultant', 'build consulting practice'],
    secondaryKeywords: ['independent consultant Singapore', 'fractional leadership', 'consultant positioning Asia'],
  },

  // ── CLUSTER 2: asia-gtm ───────────────────────────────────────────────
  {
    slug: 'southeast-asia-market-entry-mistakes',
    cluster: 'asia-gtm',
    clusterLabel: 'Asia GTM',
    title: 'The five SEA market entry mistakes that kill funded startups',
    keywords: ['Southeast Asia market entry', 'SEA startup mistakes', 'market entry Singapore', 'SEA go-to-market'],
    secondaryKeywords: ['GTM strategy Southeast Asia', 'Indonesia market entry', 'launching in SEA', 'Singapore expansion'],
    seed: true,
  },
  {
    slug: 'singapore-vs-indonesia-first-market',
    cluster: 'asia-gtm',
    clusterLabel: 'Asia GTM',
    title: 'Singapore or Indonesia first: how to pick your SEA beachhead',
    keywords: ['Singapore vs Indonesia market entry', 'SEA beachhead market', 'first market Southeast Asia', 'Indonesia expansion'],
    secondaryKeywords: ['SEA go-to-market strategy', 'Southeast Asia startup strategy', 'Singapore market entry'],
  },
  {
    slug: 'hiring-your-first-country-manager',
    cluster: 'asia-gtm',
    clusterLabel: 'Asia GTM',
    title: 'Hiring your first country manager in Southeast Asia: what actually works',
    keywords: ['country manager Southeast Asia', 'hiring country manager Singapore', 'first hire SEA', 'country lead Asia'],
    secondaryKeywords: ['market entry hiring', 'SEA expansion team', 'country manager Indonesia'],
  },
  {
    slug: 'gtm-playbook-indonesia',
    cluster: 'asia-gtm',
    clusterLabel: 'Asia GTM',
    title: 'The Indonesia GTM playbook: what the Western frameworks miss',
    keywords: ['Indonesia GTM strategy', 'Indonesia market entry', 'go-to-market Indonesia', 'launching in Indonesia'],
    secondaryKeywords: ['Jakarta startup ecosystem', 'Indonesia B2B sales', 'Indonesia consumer market'],
  },

  // ── CLUSTER 3: ai-native ──────────────────────────────────────────────
  {
    slug: 'replace-three-workflows-with-one-agent',
    cluster: 'ai-native',
    clusterLabel: 'AI-Native',
    title: 'Replace three staff workflows with one agent: an honest guide for founders',
    keywords: ['AI workflow automation', 'LLM automation for business', 'AI agent for small business', 'replace workflows with AI'],
    secondaryKeywords: ['LLM business automation', 'AI-native operations', 'AI agent Singapore', 'WhatsApp AI automation'],
    seed: true,
  },
  {
    slug: 'ai-audit-what-we-find-in-four-weeks',
    cluster: 'ai-native',
    clusterLabel: 'AI-Native',
    title: 'What we find in four weeks: the AI audit that changes how founders think',
    keywords: ['AI audit for business', 'AI readiness assessment', 'AI implementation audit', 'LLM audit Singapore'],
    secondaryKeywords: ['AI consulting Singapore', 'AI-native business', 'AI workflow audit'],
  },
  {
    slug: 'long-running-agents-on-vps',
    cluster: 'ai-native',
    clusterLabel: 'AI-Native',
    title: 'Long-running agents on a VPS: what we ship, why we ship it this way',
    keywords: ['long-running AI agents', 'LLM agent VPS deployment', 'AI agent deployment', 'autonomous AI agent'],
    secondaryKeywords: ['LLM operations', 'AI agent server', 'agentic AI business'],
  },
  {
    slug: 'when-not-to-build-with-ai',
    cluster: 'ai-native',
    clusterLabel: 'AI-Native',
    title: 'When not to build with AI: the decision the vendor won\'t have with you',
    keywords: ['when to use AI', 'AI build decision', 'AI vs no-AI', 'AI implementation decision'],
    secondaryKeywords: ['AI consulting advice', 'AI ROI for SME', 'AI business case'],
  },

  // ── CLUSTER 4: growth-retention ───────────────────────────────────────
  {
    slug: 'subscription-retention-playbook-asia-fintech',
    cluster: 'growth-retention',
    clusterLabel: 'Growth & Retention',
    title: 'The subscription retention playbook for Series A fintechs in Asia',
    keywords: ['subscription retention Asia', 'fintech retention strategy', 'Series A fintech growth', 'subscription metrics fintech'],
    secondaryKeywords: ['retention strategy Singapore', 'fintech churn reduction', 'subscription product Asia', 'DAU retention fintech'],
    seed: true,
  },
  {
    slug: 'activation-funnel-rebuild',
    cluster: 'growth-retention',
    clusterLabel: 'Growth & Retention',
    title: 'How to rebuild an activation funnel without touching paid media',
    keywords: ['activation funnel optimisation', 'user activation strategy', 'onboarding funnel rebuild', 'activation without paid media'],
    secondaryKeywords: ['activation rate improvement', 'product-led activation', 'user onboarding SEA'],
  },
  {
    slug: 'retention-metrics-that-matter',
    cluster: 'growth-retention',
    clusterLabel: 'Growth & Retention',
    title: 'The three retention metrics most founders are reading wrong',
    keywords: ['retention metrics', 'churn analysis', 'retention rate calculation', 'cohort retention analysis'],
    secondaryKeywords: ['retention strategy startup', 'churn reduction', 'growth metrics Asia'],
  },
  {
    slug: 'growth-at-series-a-what-changes',
    cluster: 'growth-retention',
    clusterLabel: 'Growth & Retention',
    title: 'Growth at Series A: what changes, what breaks, what to hire first',
    keywords: ['Series A growth strategy', 'first growth hire', 'scaling at Series A', 'growth team Series A'],
    secondaryKeywords: ['Series A startup scaling', 'growth lead Singapore', 'first VP Growth hire'],
  },

  // ── CLUSTER 5: fractional-leadership ─────────────────────────────────
  {
    slug: 'what-a-fractional-cpo-actually-does',
    cluster: 'fractional-leadership',
    clusterLabel: 'Fractional Leadership',
    title: 'What a fractional CPO actually does in your first 90 days',
    keywords: ['fractional CPO', 'fractional Chief Product Officer', 'fractional CPO Singapore', 'what does fractional CPO do'],
    secondaryKeywords: ['fractional product officer', 'part-time CPO', 'fractional executive Singapore', 'CPO consultant Asia'],
    seed: true,
  },
  {
    slug: 'fractional-vs-full-time-when-to-choose',
    cluster: 'fractional-leadership',
    clusterLabel: 'Fractional Leadership',
    title: 'Fractional vs full-time: the decision framework no recruiter will give you',
    keywords: ['fractional vs full-time executive', 'fractional executive decision', 'when to hire fractional', 'fractional leadership benefits'],
    secondaryKeywords: ['fractional CPO vs hire', 'part-time executive Singapore', 'fractional CRO Asia'],
  },
  {
    slug: 'conglomerate-modernisation-where-to-start',
    cluster: 'fractional-leadership',
    clusterLabel: 'Fractional Leadership',
    title: 'Conglomerate modernisation: where to start when everything is broken',
    keywords: ['conglomerate modernisation', 'digital transformation Asia', 'family business modernisation', 'corporate transformation Singapore'],
    secondaryKeywords: ['conglomerate digital transformation', 'family office modernisation', 'legacy business AI'],
  },
  {
    slug: 'advisory-board-vs-retainer-consulting',
    cluster: 'fractional-leadership',
    clusterLabel: 'Fractional Leadership',
    title: 'Advisory board vs retainer consulting: what you actually need at each stage',
    keywords: ['advisory board vs consultant', 'startup advisory board', 'consulting retainer', 'advisor vs consultant Singapore'],
    secondaryKeywords: ['startup advisor Singapore', 'fractional advisor SEA', 'consultant retainer Asia'],
  },
];

module.exports = { topics };
