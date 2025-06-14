import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useLocation } from "wouter";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function CartModal() {
  const [, navigate] = useLocation();
  const {
    cartItems,
    isLoading,
    isCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeCart,
  } = useCart();

  const totalPrice = cartItems?.reduce(
    (total, item) => total + parseFloat(item.product.price) * item.quantity,
    0
  ) || 0;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleQuantityChange = (productId: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Shopping Cart</span>
            </SheetTitle>
            <Badge variant="secondary" className="text-xs">
              {cartItems?.reduce((total, item) => total + item.quantity, 0) || 0} items
            </Badge>
          </div>
          {cartItems && cartItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="w-full"
            >
              Clear Cart
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : !cartItems || cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-6">Add some products to get started!</p>
              <Button onClick={() => { closeCart(); navigate("/products"); }}>
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center space-x-4 p-4 bg-card rounded-lg border"
                    >
                      <div className="relative">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        {item.product.isSale && (
                          <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-1 py-0">
                            Sale
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-bold text-primary">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.originalPrice && parseFloat(item.product.originalPrice) > parseFloat(item.product.price) && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatPrice(parseFloat(item.product.price) * item.quantity)} total
                        </p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t pt-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
            
            <div className="space-y-2">
              <Button
                className="w-full btn-primary"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { closeCart(); navigate("/products"); }}
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}
