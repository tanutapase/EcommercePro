import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, Shield, Truck, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useLocation } from "wouter";

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

  const itemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - totalPrice);

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
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] p-0 flex flex-col border-l border-gray-100"
        style={{ background: "hsl(0,0%,99%)" }}
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold tracking-tight">Shopping Cart</SheetTitle>
                <p className="text-xs text-gray-400 font-medium">
                  {itemCount === 0 ? "No items" : `${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            {cartItems && cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 h-7 px-2 rounded-lg"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Free shipping progress */}
          {cartItems && cartItems.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {remainingForFreeShip > 0
                    ? <span>Add <strong className="text-gray-900">{formatPrice(remainingForFreeShip.toString())}</strong> for free shipping</span>
                    : <span className="text-green-600 font-semibold">🎉 You've unlocked free shipping!</span>
                  }
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col gap-4 p-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 skeleton rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                    <div className="h-3.5 skeleton rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !cartItems || cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center px-8 py-12"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <ShoppingBag className="h-9 w-9 text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-1.5">Your cart is empty</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Looks like you haven't added anything yet. Start exploring!
              </p>
              <Button
                onClick={() => { closeCart(); navigate("/products"); }}
                className="btn-primary rounded-full px-6"
              >
                Browse Products
              </Button>
            </motion.div>
          ) : (
            <ScrollArea className="h-full">
              <div className="px-6 py-4 space-y-3">
                <AnimatePresence initial={false}>
                  {cartItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        {item.product.isSale && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            SALE
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-sm font-bold text-gray-900">
                                {formatPrice(item.product.price)}
                              </span>
                              {item.product.originalPrice && parseFloat(item.product.originalPrice) > parseFloat(item.product.price) && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(item.product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                            className="h-7 w-7 p-0 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex-shrink-0 -mr-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                              className="h-6 w-6 p-0 rounded-md text-gray-600 hover:bg-white hover:shadow-sm"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-bold w-6 text-center text-gray-900">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                              className="h-6 w-6 p-0 rounded-md text-gray-600 hover:bg-white hover:shadow-sm"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">
                            {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        {cartItems && cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-100 bg-white"
          >
            {/* Coupon */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                <Tag className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Apply coupon code</span>
              </div>
            </div>

            {/* Totals */}
            <div className="px-6 py-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-gray-900">{formatPrice(totalPrice.toString())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className={totalPrice >= freeShippingThreshold ? "text-green-600 font-semibold" : "font-medium text-gray-900"}>
                  {totalPrice >= freeShippingThreshold ? "FREE" : formatPrice("9.99")}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice((totalPrice >= freeShippingThreshold ? totalPrice : totalPrice + 9.99).toString())}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="px-6 pb-3 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="h-3 w-3 text-green-500" /> Secure checkout
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Package className="h-3 w-3 text-blue-500" /> Easy returns
              </span>
            </div>

            {/* Buttons */}
            <div className="px-6 pb-6 space-y-2">
              <Button
                className="w-full btn-primary rounded-full h-12 text-base font-semibold gap-2"
                onClick={handleCheckout}
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full h-10 text-sm text-gray-500 hover:text-gray-700"
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
