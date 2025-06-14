import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Star, 
  StarHalf, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, formatRating, calculateDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import ProductGrid from "@/components/product/product-grid";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { ProductWithCategory, Review } from "@shared/schema";

export default function ProductDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productId = parseInt(params.id || "0");

  const { addToCart, isAddingToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { data: product, isLoading } = useQuery<ProductWithCategory>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/products", productId, "reviews"],
    enabled: !!product,
  });

  const { data: relatedProducts } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", "related", product?.categoryId],
    queryFn: async () => {
      if (!product?.categoryId) return [];
      const response = await fetch(`/api/products?categoryId=${product.categoryId}`);
      if (!response.ok) return [];
      const products = await response.json();
      return products.filter((p: ProductWithCategory) => p.id !== productId).slice(0, 4);
    },
    enabled: !!product?.categoryId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const rating = formatRating(product.rating || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const discountPercentage = product.originalPrice 
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  // Mock multiple product images for gallery effect
  const productImages = [
    product.image,
    product.image, // In a real app, you'd have multiple images
    product.image,
    product.image,
  ];

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on this item",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transaction",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Authentic products only",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "border-primary shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title and Category */}
            <div>
              {product.category && (
                <Badge variant="secondary" className="mb-2">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-secondary mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.reviewCount && product.reviewCount > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: fullStars }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                    {hasHalfStar && <StarHalf className="h-4 w-4 fill-current text-yellow-400" />}
                    {Array.from({ length: emptyStars }, (_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price and Badges */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge className="bg-accent text-accent-foreground">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {product.isSale && (
                  <Badge className="badge-sale">Sale</Badge>
                )}
                {product.isNew && (
                  <Badge className="badge-new">New</Badge>
                )}
                {product.inStock ? (
                  <Badge className="badge-success">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Premium quality product crafted with attention to detail. Perfect for those who appreciate fine craftsmanship and exceptional design."}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1 btn-primary"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.inStock}
                >
                  {isAddingToCart ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                  )}
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={isWishlisted ? 'text-red-500 border-red-200' : ''}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {product.description || "This premium product represents the perfect blend of quality, functionality, and style. Crafted with meticulous attention to detail, it meets the highest standards of excellence."}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Whether you're looking for everyday use or special occasions, this product delivers exceptional performance and reliability. Its thoughtful design ensures maximum satisfaction and long-lasting value.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Premium quality materials</li>
                      <li>Expert craftsmanship</li>
                      <li>Attention to detail</li>
                      <li>Designed for longevity</li>
                      <li>Satisfaction guaranteed</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Category:</span>
                        <span className="ml-2 text-gray-600">{product.category?.name || 'General'}</span>
                      </div>
                      <div>
                        <span className="font-medium">SKU:</span>
                        <span className="ml-2 text-gray-600">ELITE-{product.id.toString().padStart(6, '0')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Availability:</span>
                        <span className="ml-2 text-gray-600">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Brand:</span>
                        <span className="ml-2 text-gray-600">EliteShop</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Rating:</span>
                        <span className="ml-2 text-gray-600">{rating}/5 stars</span>
                      </div>
                      <div>
                        <span className="font-medium">Reviews:</span>
                        <span className="ml-2 text-gray-600">{product.reviewCount || 0} customer reviews</span>
                      </div>
                      <div>
                        <span className="font-medium">Shipping:</span>
                        <span className="ml-2 text-gray-600">Free shipping available</span>
                      </div>
                      <div>
                        <span className="font-medium">Returns:</span>
                        <span className="ml-2 text-gray-600">30-day return policy</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-b pb-6 last:border-b-0"
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.avatar || ''} />
                              <AvatarFallback>
                                {review.customerName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{review.customerName}</h4>
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: review.rating }, (_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                                  ))}
                                  {Array.from({ length: 5 - review.rating }, (_, i) => (
                                    <Star key={i} className="h-4 w-4 text-gray-300" />
                                  ))}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-gray-600">{review.comment}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ProductGrid
              products={relatedProducts}
              isLoading={false}
              title="Related Products"
              subtitle="You might also like these products"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
