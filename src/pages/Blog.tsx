import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Clock, ArrowRight, Search, Calendar, Tag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts, categories, getBlogPostById, getRelatedPosts } from "@/data/blog";

const Blog = () => {
  // SEO: unique page title
  document.title = "Blog | PerksNest";

  const [blogEmail, setBlogEmail] = useState("");
  const [blogSubscribed, setBlogSubscribed] = useState(false);

  const handleBlogSubscribe = () => {
    if (!blogEmail.includes("@")) { toast.error("Enter a valid email"); return; }
    const isNew = subscribeToDigest(blogEmail, undefined, "weekly");
    setBlogSubscribed(true);
    toast.success(isNew ? "You're subscribed! 🎉" : "You're already subscribed!");
    setBlogEmail("");
  };

  const { postId } = useParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // If postId exists, show single post view
  if (postId) {
    const post = getBlogPostById(postId);

    if (!post) {
      return <Navigate to="/blog" replace />;
    }

    const relatedPosts = getRelatedPosts(postId);
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Back Button */}
          <div className="border-b border-border bg-card">
            <div className="container-wide py-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>

          {/* Article Hero */}
          <article className="container-wide py-12">
            <div className="max-w-4xl mx-auto">
              {/* Meta Info */}
              <div className="mb-6">
                <Link
                  to="/blog"
                  className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors mb-4"
                >
                  {post.category}
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {post.title}
                </h1>

                <p className="text-xl text-muted-foreground mb-6">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{post.author}</div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-12">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed space-y-6">
                  {post.fullContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-card border border-border rounded-xl">
                <div className="flex items-start gap-4">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Written by {post.author}</h3>
                    <p className="text-muted-foreground text-sm">
                      Contributing writer sharing insights on {post.category.toLowerCase()} and startup growth strategies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="bg-secondary/30 py-16">
              <div className="container-wide">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                    Related Articles
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="group"
                      >
                        <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-4">
                            <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2">
                              {relatedPost.category}
                            </span>
                            <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Newsletter CTA */}
          <section className="container-wide py-16">
            <div className="max-w-4xl mx-auto bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Get startup tips in your inbox
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Join 50,000+ founders who receive our weekly newsletter with the best deals and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                {!blogSubscribed ? (
                  <>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={blogEmail}
                      onChange={e => setBlogEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleBlogSubscribe()}
                      className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button onClick={handleBlogSubscribe} className="px-6 py-3 bg-primary-foreground text-primary font-semibold rounded-lg hover:bg-primary-foreground/90 transition-colors flex items-center justify-center gap-2">
                      Subscribe <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <p className="text-primary-foreground font-semibold text-center w-full">✅ You're subscribed! Check your inbox Monday.</p>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  // Blog index view
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="py-16 md:py-20 gradient-hero">
          <div className="container-wide">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                The PerksNest Blog
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Tips, guides, and insights to help your startup save money and grow faster.
              </p>
              
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-border bg-card sticky top-16 z-40">
          <div className="container-wide">
            <div className="overflow-x-auto py-4">
              <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container-wide py-12">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="group"
                  >
                    <article className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-[2/1] overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.authorAvatar} 
                            alt={post.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="text-sm">
                            <span className="font-medium text-foreground">{post.author}</span>
                            <span className="text-muted-foreground"> · {post.date}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Posts */}
          <section>
            <h2 className="text-2xl font-bold mb-8">
              {activeCategory === "All" ? "All Articles" : activeCategory}
            </h2>
            
            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="group"
                  >
                    <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img 
                              src={post.authorAvatar} 
                              alt={post.author}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs text-muted-foreground">{post.author}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{post.date}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            )}
          </section>

          {/* Newsletter CTA */}
          <section className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Get startup tips in your inbox
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Join 50,000+ founders who receive our weekly newsletter with the best deals and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="px-6 py-3 bg-primary-foreground text-primary font-semibold rounded-lg hover:bg-primary-foreground/90 transition-colors flex items-center justify-center gap-2">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;