import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Filter, User, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import newsData from "@/data/news.json";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
}

const OCLNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    // TODO: Replace with Supabase call
    setArticles(newsData.articles);
    setFilteredArticles(newsData.articles);
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter && categoryFilter !== "All") {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, categoryFilter]);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Expansion": "bg-success/10 text-success border-success/20",
      "Technology": "bg-primary/10 text-primary border-primary/20",
      "Sustainability": "bg-warning/10 text-warning border-warning/20",
      "Announcements": "bg-brand-red/10 text-brand-red border-brand-red/20",
      "Awards": "bg-purple-100 text-purple-700 border-purple-200"
    };
    return colors[category as keyof typeof colors] || "bg-muted/10 text-muted-foreground border-muted/20";
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Button
                onClick={() => setSelectedArticle(null)}
                variant="outline"
                className="mb-6 border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
              >
                ← Back to News
              </Button>

              <Card className="border-2 border-brand-red bg-card-light">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <Badge className={`${getCategoryColor(selectedArticle.category)} border mb-4`}>
                      {selectedArticle.category}
                    </Badge>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {selectedArticle.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedArticle.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedArticle.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-64 md:h-96 object-cover rounded-lg border-2 border-brand-red/20"
                    />
                  </div>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {selectedArticle.excerpt}
                    </p>
                    
                    <div className="text-foreground leading-relaxed">
                      {selectedArticle.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        {/* Header */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                OCL News & Updates
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest news, announcements, and developments from DaakBox
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-brand-red bg-card-light mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-brand-red" />
                    Filter & Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 border-brand-red/30 focus:border-brand-red bg-background pl-10"
                      />
                    </div>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red bg-background">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        {newsData.categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button 
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("All");
                      }}
                      variant="outline"
                      className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Articles Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Card className="border-2 border-brand-red bg-card-light h-full hover:shadow-lg 
                                     transition-all duration-200 hover:scale-105 cursor-pointer"
                            onClick={() => setSelectedArticle(article)}>
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={`${getCategoryColor(article.category)} border`}>
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.date).toLocaleDateString()}
                            <Clock className="w-4 h-4 ml-2" />
                            2 min read
                          </div>
                          
                          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                            {article.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <User className="w-4 h-4" />
                              {article.author}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-brand-red hover:text-brand-red hover:bg-brand-red/10"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-brand-red bg-card-light">
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Articles Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria to find more articles.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16"
            >
              <Card className="border-2 border-brand-red bg-gradient-to-r from-brand-red/5 to-brand-red/10">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Stay Updated
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Subscribe to our newsletter to get the latest updates, announcements, and industry insights 
                    delivered directly to your inbox.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      placeholder="Enter your email"
                      className="border-2 border-brand-red/30 focus:border-brand-red bg-background"
                    />
                    <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold whitespace-nowrap">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OCLNews;