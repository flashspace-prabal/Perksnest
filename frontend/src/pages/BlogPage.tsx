import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { CalendarDays, ChevronRight } from "lucide-react";

import BlogCard from "@/components/blog/BlogCard";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogData, getBlogPageBySlug } from "@/data/blogPages";

const BlogPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = postId ? getBlogPageBySlug(postId) : null;

  useEffect(() => {
    document.title = post ? `${post.title} | PerksNest` : "Insights & Guides | PerksNest";
  }, [post]);

  if (post) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <article className="mt-6">
            <header className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_28px_80px_-48px_rgba(28,25,23,0.4)] sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">{post.category}</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">{post.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-stone-600">
                <span className="font-semibold text-stone-900">{post.author}</span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <div className="mt-8 overflow-hidden rounded-[1.6rem]">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
            </header>

            <div className="mt-8 space-y-6">
              {post.sections.map((section) => (
                <Card key={section.heading} className="rounded-[1.6rem] border-stone-200 shadow-none">
                  <CardContent className="p-6 sm:p-7">
                    <h2 className="text-3xl font-black tracking-tight text-stone-900">{section.heading}</h2>
                    {section.subheading ? (
                      <h3 className="mt-3 text-lg font-semibold text-stone-600">{section.subheading}</h3>
                    ) : null}
                    <div className="mt-5 space-y-4">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={`${section.heading}-${index}`} className="text-base leading-8 text-stone-700">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </article>
        </div>
      </div>
    );
  }

  const featuredPosts = blogData.slice(0, 4);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(12,74,110,0.08),_transparent_24%),linear-gradient(180deg,#fafaf9_0%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-stone-200 bg-white px-6 py-10 shadow-[0_28px_80px_-48px_rgba(28,25,23,0.4)] sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">PerksNest Blog</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">Insights & Guides</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700">
            Practical reads for founders and operators comparing tools, shaping workflows, and building a cleaner software stack.
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-stone-900">Latest Posts</h2>
              <p className="mt-2 text-sm text-stone-600">Four featured articles to kick off the new blog system.</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[1.8rem] border border-stone-200 bg-stone-900 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Explore More</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">Want to browse live deals instead?</h2>
              <p className="mt-2 text-sm leading-7 text-stone-300">Jump back into the marketplace to explore startup offers, credits, and discounts across the stack.</p>
            </div>
            <Button asChild className="h-11 rounded-full px-5 font-semibold">
              <Link to="/deals">
                Explore deals
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
