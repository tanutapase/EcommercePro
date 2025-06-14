import { motion } from "framer-motion";
import ProductCard from "./product-card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory } from "@shared/schema";

interface ProductGridProps {
  products: ProductWithCategory[] | undefined;
  isLoading: boolean;
  title?: string;
  subtitle?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export default function ProductGrid({
  products,
  isLoading,
  title,
  subtitle,
  showLoadMore = false,
  onLoadMore,
  isLoadingMore = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {title && (
            <h2 className="text-3xl font-bold text-secondary mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600 text-lg">{subtitle}</p>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {showLoadMore && onLoadMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3"
          >
            {isLoadingMore ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Load More Products'
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
