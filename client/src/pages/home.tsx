import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Laptop, 
  Home, 
  Dumbbell,
  Star,
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  RotateCcw
} from "lucide-react";
import ProductGrid from "@/components/product/product-grid";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { formatPrice } from "@/lib/utils";
import type { Category, ProductWithCategory } from "@shared/schema";

export default function HomePage() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts, isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products"],
    select: (data) => data?.slice(0, 4), // Show first 4 products as featured
  });

  const categoryIcons = {
    "Fashion": ShoppingBag,
    "Electronics": Laptop,
    "Home & Decor": Home,
    "Sports": Dumbbell,
  };

  const categoryColors = {
    "purple": "from-purple-50 to-purple-100 text-purple-600",
    "blue": "from-blue-50 to-blue-100 text-blue-600",
    "green": "from-green-50 to-green-100 text-green-600",
    "orange": "from-orange-50 to-orange-100 text-orange-600",
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing quality products and fast delivery. I've been shopping here for over a year and never disappointed!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Great customer service and excellent product selection. The website is easy to navigate and checkout is smooth.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    },
    {
      name: "Emma Wilson",
      rating: 5,
      comment: "Love the product quality and the trendy designs. Perfect for my style and the prices are very reasonable!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer support",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative hero-gradient text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Discover Amazing Products
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Shop the latest trends with our curated collection of premium products. Quality guaranteed, style delivered.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button
                    size="lg" 
                    className="bg-white text-primary hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg px-8 py-4 text-lg font-semibold"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-200 px-8 py-4 text-lg font-semibold"
                  >
                    Explore Categories
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-bounce-soft">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Modern shopping scene"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our diverse range of premium products</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category, index) => {
              const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || ShoppingBag;
              const colorClass = categoryColors[category.color as keyof typeof categoryColors] || categoryColors.purple;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/products?category=${category.id}`}>
                    <Card className="group cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <CardContent className={`bg-gradient-to-br ${colorClass} rounded-2xl p-8 text-center`}>
                        <Icon className="h-12 w-12 mx-auto mb-4 group-hover:animate-bounce-soft" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid
            products={featuredProducts}
            isLoading={isLoading}
            title="Featured Products"
            subtitle="Handpicked favorites from our collection"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button size="lg" className="btn-primary">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Real reviews from satisfied customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-1 mb-4">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">Verified Customer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
