export { SITE_URL, DEFAULT_AUTHOR } from './blog-config';

import post1 from './posts/errands-between-work-kids-and-everything-else';
import post2 from './posts/what-it-feels-like-when-someone-else-handles-errands';
import post3 from './posts/why-still-doing-post-office-runs-2026';
import post4 from './posts/how-does-emax-actually-work-columbus';
import post5 from './posts/how-emax-works-step-by-step';

// Add new posts here — newest last keeps the array in chronological order
export const BLOG_POSTS = [post1, post2, post3, post4, post5];

export function getBlogPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(currentSlug, count = 3) {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, count);
}
