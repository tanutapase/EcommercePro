import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, X, Grid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "@/lib/utils";
import ProductGrid from "@/components/product/product-grid";
import type { Category, ProductWithCategory } from "@shared/schema";

export default function ProductsPage() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const search = params.get('search');
    const category = params.get('category');
    
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  }, [location]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", selectedCategory, searchQuery],
    queryFn: async ({ queryKey }) => {
      const [, categoryId, search] = queryKey;
      const params = new URLSearchParams();
      
      if (categoryId) params.append('categoryId', categoryId as string);
      if (search) params.append('search', search as string);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const handleSearch = debounce((query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.append('search', query.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    
    const newUrl = params.toString() ? `/products?${params}` : '/products';
    navigate(newUrl);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (categoryId) params.append('category', categoryId);
    
    const newUrl = params.toString() ? `/products?${params}` : '/products';
    navigate(newUrl);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    navigate('/products');
  };

  const sortedProducts = products ? [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'rating':
        return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
      case 'newest':
        return b.id - a.id;
      default:
        return a.name.localeCompare(b.name);
    }
  }) : [];

  const selectedCategoryName = categories?.find(c => c.id.toString() === selectedCategory)?.name;
  const hasActiveFilters = searchQuery.trim() || selectedCategory;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                {selectedCategoryName ? `${selectedCategoryName} Products` : 'All Products'}
              </h1>
              <p className="text-gray-600">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Discover our complete collection'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) => handleCategoryChange(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-600">Active filters:</span>
                        {searchQuery.trim() && (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <span>Search: {searchQuery}</span>
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleSearchChange("")}
                            />
                          </Badge>
                        )}
                        {selectedCategoryName && (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <span>Category: {selectedCategoryName}</span>
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleCategoryChange(null)}
                            />
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear all filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${sortedProducts.length} products found`}
          </p>
        </motion.div>

        {/* Products Grid */}
        <ProductGrid
          products={sortedProducts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
