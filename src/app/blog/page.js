import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/data/blog-posts';
import { GoldButton } from '@/components/shared';
import BlogReveal from '@/components/BlogReveal';

export const metadata = {
  title: 'Blog — Errand Tips & Community Stories | eMax Errands & More',
  description:
    'Practical errand tips, time-saving advice, and community stories from eMax Errands & More, your trusted local errand service in Columbus, Indiana.',
  keywords:
    'errand tips Columbus Indiana, time saving tips errands, local errand service blog, senior errand service Columbus, errand advice Indiana',
  alternates: {
    canonical: 'https://emaxerrands.com/blog',
  },
  openGraph: {
    title: 'The eMax Blog — Errand Tips & Community Stories',
    description:
      "Time-saving advice and community stories from Columbus, Indiana's local errand service.",
    type: 'website',
    url: 'https://emaxerrands.com/blog',
  },
};

/* Derive categories from the actual posts so nothing goes stale */
const CATEGORIES = ['All', ...new Set(BLOG_POSTS.map((p) => p.category))];

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const activeCategory = params.category ?? 'All';

  const featured = BLOG_POSTS.find((p) => p.featured);
  const filteredPosts =
    activeCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-white">
      <BlogReveal />

      {/* ── Hero ── */}
      <section className="bg-navy hex-pattern pt-36 pb-24 text-center">
        <div className="max-w-2xl mx-auto px-5">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] bg-gold/15 text-gold rounded-full mb-6 rise rise-1">
            The eMax Blog
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight mb-5 rise rise-2">
            Tips, Stories &amp;<br />Errand Advice
          </h1>
          <p className="text-white/65 text-lg leading-relaxed rise rise-3">
            Practical insights from your Columbus, Indiana errand team — helping
            you save time, stay independent, and live better.
          </p>
        </div>
      </section>

      {/* ── Category filter ── */}
      <div className="sticky top-[91px] z-30 bg-stone/95 backdrop-blur-sm border-b border-navy/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex gap-2 overflow-x-auto py-3">
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-navy/65 hover:bg-navy/8 hover:text-navy'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        {/* ── Featured post (only on "All" view) ── */}
        {featured && activeCategory === 'All' && (
          <section className="mb-16 reveal">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="bg-white rounded-3xl overflow-hidden border border-navy/10 shadow-card hover:shadow-gold transition-all duration-300 hover:-translate-y-1 grid md:grid-cols-[45%_55%]">
                {/* Image */}
                <div className="relative aspect-video md:aspect-auto overflow-hidden min-h-[260px]">
                  <img
                    src={featured.image.src}
                    alt={featured.image.alt}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-navy/10" />
                </div>
                {/* Content */}
                <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="px-2.5 py-1 bg-gold text-navy text-[11px] font-black uppercase tracking-wider rounded-full">
                      Featured
                    </span>
                    <span className="px-2.5 py-1 bg-navy/8 text-navy text-xs font-semibold rounded-full">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-navy leading-tight mb-4 group-hover:text-gold-deep transition-colors duration-200">
                    {featured.title}
                  </h2>
                  <p className="text-navy/60 leading-relaxed mb-6 line-clamp-3 text-[15px]">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mb-7">
                    <Image
                      src={featured.author.image}
                      alt={featured.author.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover ring-2 ring-gold/30"
                    />
                    <div className="text-sm text-navy/55">
                      <span className="font-semibold text-navy">
                        {featured.author.name}
                      </span>{' '}
                      · {featured.dateFormatted} · {featured.readTime}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-navy font-semibold text-[15px] group-hover:text-gold-deep transition-colors duration-200">
                    Read Article
                    <ArrowRight />
                  </span>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* ── Posts grid ── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-bold text-2xl text-navy">
              {activeCategory === 'All' ? 'All Articles' : activeCategory}
            </h2>
            <span className="text-sm text-navy/45 font-medium">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-navy/40">
              <p className="text-lg font-medium">No articles in this category yet.</p>
              <p className="text-sm mt-2">Check back soon — we publish new content regularly.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} delay={i + 1} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Newsletter / CTA strip ── */}
      <section className="bg-navy hex-pattern py-20">
        <div className="max-w-xl mx-auto px-5 text-center">
          <span className="inline-block w-12 h-1 bg-gold rounded-full mb-6" />
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
            Ready to reclaim your time?
          </h2>
          <p className="text-white/60 text-[15px] leading-relaxed mb-8">
            Let eMax Errands handle the to-do list while you focus on what matters
            most. No app, no subscription — just reliable local help.
          </p>
          <GoldButton href="tel:+18125659585">
            <PhoneIcon />
            Call or Text Now
          </GoldButton>
        </div>
      </section>
    </main>
  );
}

/* ── Sub-components (server-safe, no hooks) ── */

function BlogCard({ post, delay }) {
  const delayClass = delay <= 6 ? `delay-${delay}` : '';
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className={`h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-navy/10 shadow-card svc-card reveal ${delayClass}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.image.src}
            alt={post.image.alt}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <CategoryBadge category={post.category} />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-display font-bold text-[1.05rem] text-navy leading-snug mb-3 group-hover:text-gold-deep transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-navy/55 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2.5 pt-4 border-t border-navy/8">
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={28}
              height={28}
              className="rounded-full object-cover ring-2 ring-gold/20"
            />
            <span className="text-xs text-navy/45">
              {post.dateFormatted} · {post.readTime}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-navy/60 group-hover:text-gold-deep transition-colors duration-200">
              Read <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function CategoryBadge({ category }) {
  const palette = {
    Productivity: 'bg-gold text-navy',
    Community: 'bg-navy text-white',
    'Getting Started': 'bg-white/95 text-navy',
  };
  const cls = palette[category] ?? 'bg-white/90 text-navy';
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full ${cls}`}>
      {category}
    </span>
  );
}

function ArrowRight({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.32-1.32a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
