import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Plus, Star, StarHalf } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice, formatRating, calculateDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import type { ProductWithCategory } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithCategory;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart, isAddingToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const rating = formatRating(product.rating || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const discountPercentage = product.originalPrice 
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/product/${product.id}`}>
        <Card className="product-card group cursor-pointer overflow-hidden">
          <div className="relative overflow-hidden">
            <div className="aspect-square relative bg-gray-100">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`product-image w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isSale && (
                <Badge className="badge-sale text-xs font-semibold">
                  {discountPercentage > 0 ? `${discountPercentage}% Off` : 'Sale'}
                </Badge>
              )}
              {product.isNew && (
                <Badge className="badge-new text-xs font-semibold">New</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button
                variant="ghost"
                size="sm"
                className={`bg-white/90 backdrop-blur-sm shadow-md hover:bg-white p-2 h-auto ${
                  isWishlisted ? 'text-red-500' : 'text-gray-600'
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart 
                  className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} 
                />
              </Button>
            </motion.div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                {product.category && (
                  <p className="text-sm text-gray-500 capitalize">
                    {product.category.name}
                  </p>
                )}
              </div>

              {/* Rating */}
              {product.reviewCount && product.reviewCount > 0 && (
                <div className="star-rating">
                  {Array.from({ length: fullStars }, (_, i) => (
                    <Star key={i} className="star fill-current" />
                  ))}
                  {hasHalfStar && <StarHalf className="star fill-current" />}
                  {Array.from({ length: emptyStars }, (_, i) => (
                    <Star key={i} className="star empty" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
              )}

              {/* Price and Add to Cart */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  className="btn-primary p-2 h-auto"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.inStock}
                >
                  {isAddingToCart ? (
                    <div className="loading-spinner h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {!product.inStock && (
                <Badge variant="secondary" className="w-full justify-center">
                  Out of Stock
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
