import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPage } from "@/data/blogPages";

interface BlogCardProps {
  post: BlogPage;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="h-full overflow-hidden rounded-[1.5rem] border-stone-200 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">{post.category}</p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">{post.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-stone-600">{post.excerpt}</p>
        <Button asChild variant="outline" className="mt-6 h-11 w-fit rounded-full px-5 font-semibold">
          <Link to={`/blog/${post.slug}`}>
            Read more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
