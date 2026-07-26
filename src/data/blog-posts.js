export { SITE_URL, DEFAULT_AUTHOR } from './blog-config';

import post1 from './posts/errands-between-work-kids-and-everything-else';
import post2 from './posts/what-it-feels-like-when-someone-else-handles-errands';
import post3 from './posts/why-still-doing-post-office-runs-2026';
import post4 from './posts/how-does-emax-actually-work-columbus';
import post5 from './posts/how-emax-works-step-by-step';
import post6 from './posts/what-is-a-local-errand-service';
import post7 from './posts/what-errands-can-you-book-with-emax';
import post8 from './posts/is-it-safe-to-hire-an-errand-service';
import post9 from './posts/what-changes-in-your-week-without-errands';
import post10 from './posts/what-can-you-hand-off-to-emax';
import post11 from './posts/who-uses-an-errand-service-in-columbus';
import post12 from './posts/errand-service-vs-delivery-apps';
import post13 from './posts/is-it-safe-to-let-someone-else-handle-errands-columbus';
import post14 from './posts/how-much-does-an-errand-service-cost-columbus-indiana';
import post15 from './posts/25-real-examples-errands-people-outsource-columbus';
import post16 from './posts/event-support-services-columbus-indiana';
import post17 from './posts/same-day-errand-help-columbus-indiana';
import post18 from './posts/business-errand-services-columbus-indiana';
import post19 from './posts/why-we-started-emax-columbus-indiana';
import post20 from './posts/from-first-text-to-finished-errand-how-emax-works';

// Add new posts here — newest last keeps the array in chronological order
export const BLOG_POSTS = [post1, post2, post3, post4, post5, post6, post7, post8, post9, post10, post11, post12, post13, post14, post15, post16, post17, post18, post19, post20];

export function getBlogPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(currentSlug, count = 3) {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, count);
}
