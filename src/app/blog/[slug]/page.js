import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, SITE_URL, getBlogPost, getRelatedPosts } from '@/data/blog-posts';
import BlogCommentForm from '@/components/BlogCommentForm';
import BlogReveal from '@/components/BlogReveal';

/* ── Static params for SSG ── */
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

/* ── Per-post SEO metadata ── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords.join(', '),
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [
        {
          url: post.image.src,
          width: 1200,
          height: 630,
          alt: post.image.alt,
        },
      ],
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
    },
  };
}

/* ── Page component ── */
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  /* JSON-LD Article structured data */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image.src,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'eMax Errands & More',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/emax-logo.jpeg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        <BlogReveal />

        {/* ── Breadcrumbs ── */}
        <nav
          aria-label="Breadcrumb"
          className="bg-stone border-b border-navy/10 pt-24"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-2 text-sm text-navy/50">
            <Link href="/" className="hover:text-navy transition-colors">Home</Link>
            <Chevron />
            <Link href="/blog" className="hover:text-navy transition-colors">Blog</Link>
            <Chevron />
            <span className="text-navy font-medium truncate max-w-[240px]">{post.title}</span>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="relative h-[380px] sm:h-[480px] overflow-hidden">
          <img
            src={post.image.src}
            alt={post.image.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto w-full px-5 sm:px-8 pb-10 sm:pb-14">
              {/* Category + tags */}
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <Link
                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                  className="px-3 py-1 bg-gold text-navy text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gold-deep transition-colors"
                >
                  {post.category}
                </Link>
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/15 text-white text-xs font-medium rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-2xl sm:text-4xl text-white leading-tight mb-4 max-w-3xl">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover ring-2 ring-gold/50"
                />
                <div className="text-sm text-white/80">
                  <span className="font-semibold text-white">{post.author.name}</span>
                  <span className="mx-2 text-white/40">·</span>
                  <time dateTime={post.date}>{post.dateFormatted}</time>
                  <span className="mx-2 text-white/40">·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body: article + sidebar ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1fr_300px] gap-10 xl:gap-16 items-start">

            {/* Main article */}
            <article>
              {/* Excerpt pull-quote */}
              <p className="text-[1.15rem] text-navy/70 leading-relaxed font-medium border-l-4 border-gold pl-5 mb-10 italic">
                {post.excerpt}
              </p>

              {/* Mobile TOC — hidden on lg+ where the sidebar takes over */}
              {post.toc?.length > 0 && (
                <div className="lg:hidden bg-stone rounded-2xl p-5 border border-navy/8 mb-8">
                  <p className="font-display font-bold text-navy text-sm uppercase tracking-[0.1em] mb-4">
                    In this article
                  </p>
                  <nav aria-label="Table of contents">
                    <ol className="flex flex-col gap-2 list-none m-0 p-0">
                      {post.toc.map((item, i) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <span className="mt-0.5 font-bold text-gold text-[11px] shrink-0 font-display">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <a
                            href={`#${item.id}`}
                            className="text-[13px] text-navy/60 hover:text-navy hover:underline underline-offset-2 transition-colors duration-150"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              )}

              {/* Content */}
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-navy/10">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-stone text-navy/65 text-xs font-semibold rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author card */}
              <div className="mt-10 p-6 sm:p-8 bg-cream rounded-2xl border border-navy/10 flex gap-5 items-start">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={72}
                  height={72}
                  className="rounded-full object-cover ring-2 ring-gold/30 shrink-0"
                />
                <div>
                  <p className="font-display font-bold text-navy text-lg leading-tight">
                    {post.author.name}
                  </p>
                  <p className="text-navy/50 text-sm mb-3">{post.author.role}</p>
                  <p className="text-navy/65 text-sm leading-relaxed">{post.author.bio}</p>
                </div>
              </div>

              {/* Comment form */}
              <div id="comments" className="mt-12">
                <h2 className="font-display font-black text-2xl text-navy mb-2">
                  Leave a Comment
                </h2>
                <p className="text-navy/50 text-sm mb-8">
                  Have a question or something to add? We read every comment.
                </p>
                <BlogCommentForm
                  postTitle={post.title}
                  postSlug={post.slug}
                />
              </div>
            </article>

            {/* ── Sticky sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-6">

                {/* Table of Contents */}
                {post.toc?.length > 0 && (
                  <div className="bg-stone rounded-2xl p-6 border border-navy/8">
                    <p className="font-display font-bold text-navy text-sm uppercase tracking-[0.1em] mb-4">
                      In this article
                    </p>
                    <nav aria-label="Table of contents">
                      <ol className="flex flex-col gap-2">
                        {post.toc.map((item, i) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              className="flex items-start gap-2 text-[13px] text-navy/60 hover:text-navy transition-colors duration-150 group"
                            >
                              <span className="mt-0.5 font-bold text-gold text-[11px] shrink-0">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span className="group-hover:underline underline-offset-2">
                                {item.label}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </div>
                )}

                {/* Book CTA */}
                <div className="bg-navy rounded-2xl p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
                    <SparkleIcon />
                  </div>
                  <p className="font-display font-bold text-white text-base mb-2">
                    Ready to hand off an errand?
                  </p>
                  <p className="text-white/55 text-xs leading-relaxed mb-5">
                    No app. No subscription. Just call or text and we'll handle it.
                  </p>
                  <a
                    href="tel:+18125659585"
                    className="block w-full py-3 rounded-full bg-gold text-navy text-sm font-bold hover:bg-gold-deep transition-colors"
                  >
                    (812) 565-9585
                  </a>
                </div>

                {/* Share */}
                <div className="bg-stone rounded-2xl p-5 border border-navy/8">
                  <p className="font-display font-bold text-navy text-sm uppercase tracking-[0.1em] mb-3">
                    Share this article
                  </p>
                  <div className="flex gap-2">
                    <ShareLink
                      href={`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/blog/${post.slug}`}
                      label="Share on Facebook"
                    >
                      <FbIcon />
                    </ShareLink>
                    <ShareLink
                      href={`https://twitter.com/intent/tweet?url=${SITE_URL}/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
                      label="Share on X (Twitter)"
                    >
                      <XIcon />
                    </ShareLink>
                    <ShareLink
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${SITE_URL}/blog/${post.slug}`}
                      label="Share on LinkedIn"
                    >
                      <LinkedInIcon />
                    </ShareLink>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <section className="bg-stone border-t border-navy/10 py-16">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
              <h2 className="font-display font-black text-2xl text-navy mb-8">
                More from the eMax Blog
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rPost, i) => (
                  <Link
                    key={rPost.slug}
                    href={`/blog/${rPost.slug}`}
                    className="group block reveal"
                    style={{ '--delay': `${i * 80}ms` }}
                  >
                    <article className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-navy/10 shadow-card svc-card">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={rPost.image.src}
                          alt={rPost.image.alt}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-navy text-white text-[11px] font-semibold rounded-full">
                            {rPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-display font-bold text-[0.975rem] text-navy leading-snug mb-2 group-hover:text-gold-deep transition-colors line-clamp-2">
                          {rPost.title}
                        </h3>
                        <p className="text-navy/50 text-xs mt-auto pt-3 border-t border-navy/8">
                          {rPost.dateFormatted} · {rPost.readTime}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

/* ── Micro-components ── */

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ShareLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex-1 flex items-center justify-center h-9 rounded-xl bg-white border border-navy/12 text-navy/60 hover:text-navy hover:border-navy/30 transition-all duration-200"
    >
      {children}
    </a>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fdbd2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function FbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}
