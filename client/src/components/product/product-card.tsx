import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, StarHalf, Eye, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
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
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="product-card cursor-pointer group">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
            {/* Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}

            <img
              src={product.image}
              alt={product.name}
              className={`product-image w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Gradient overlay on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isSale && discountPercentage > 0 && (
                <motion.span
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  className="badge-sale text-xs font-bold px-2.5 py-1 rounded-full shadow-lg"
                >
                  -{discountPercentage}%
                </motion.span>
              )}
              {product.isNew && (
                <motion.span
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="badge-new text-xs font-bold px-2.5 py-1 rounded-full shadow-lg"
                >
                  NEW
                </motion.span>
              )}
              {!product.inStock && (
                <span className="bg-gray-800/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <AnimatePresence>
                {isHovered && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.6, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleWishlistToggle}
                        className={`h-9 w-9 p-0 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-white/50 transition-all hover:scale-110 ${
                          isWishlisted ? "text-rose-500 bg-rose-50" : "text-gray-600 hover:text-rose-500"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.6, x: 10 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-white/50 text-gray-600 hover:text-blue-600 transition-all hover:scale-110"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Add Button (shows at bottom on hover) */}
            <AnimatePresence>
              {isHovered && product.inStock && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-3 left-3 right-3"
                >
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`w-full rounded-full text-xs font-semibold shadow-xl transition-all duration-300 ${
                      justAdded
                        ? "bg-green-500 hover:bg-green-500"
                        : "bg-gray-900/95 hover:bg-gray-900 text-white"
                    } backdrop-blur-sm`}
                  >
                    {isAddingToCart ? (
                      <span className="loading-spinner h-3 w-3 mr-2" />
                    ) : justAdded ? (
                      "✓ Added!"
                    ) : (
                      <>
                        <ShoppingCart className="h-3 w-3 mr-1.5" />
                        Quick Add
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {product.category && (
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-widest mb-1.5">
                {product.category.name}
              </p>
            )}

            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            {/* Stars */}
            {product.reviewCount && product.reviewCount > 0 && (
              <div className="star-rating mb-3">
                {Array.from({ length: fullStars }, (_, i) => (
                  <Star key={i} className="star h-3 w-3 fill-current" />
                ))}
                {hasHalfStar && <StarHalf className="star h-3 w-3 fill-current" />}
                {Array.from({ length: emptyStars }, (_, i) => (
                  <Star key={i} className="star empty h-3 w-3" />
                ))}
                <span className="text-xs text-gray-400 ml-1 font-medium">
                  ({product.reviewCount})
                </span>
              </div>
            )}

            {/* Price Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                  <span className="text-sm text-gray-400 line-through font-medium">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Mobile add button */}
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                className={`h-8 w-8 p-0 rounded-full md:hidden transition-all ${
                  justAdded
                    ? "bg-green-500 hover:bg-green-500"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {isAddingToCart ? (
                  <span className="loading-spinner h-3 w-3" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
