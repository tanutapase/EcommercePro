import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "@/lib/utils";

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { cartItems, toggleCart } = useCart();
  const { wishlistItems } = useWishlist();

  const cartItemsCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const handleSearch = debounce((query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleSearch(value);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/products?category=1", label: "Fashion" },
    { href: "/products?category=2", label: "Electronics" },
    { href: "/products?category=3", label: "Home & Decor" },
    { href: "/products?category=4", label: "Sports" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer"
            >
              <h1 className="text-2xl font-bold text-secondary">
                Elite<span className="text-primary">Shop</span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`text-gray-700 hover:text-primary transition-colors duration-200 font-medium cursor-pointer ${
                    location === link.href ? "text-primary" : ""
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <motion.div
              className="relative hidden md:block"
              animate={{ width: isSearchFocused ? 280 : 256 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </motion.div>

            {/* Wishlist Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-gray-700 hover:text-primary transition-colors duration-200"
                onClick={() => navigate("/products?wishlist=true")}
              >
                <Heart className="h-5 w-5" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="bg-accent text-accent-foreground text-xs h-5 w-5 flex items-center justify-center p-0">
                        {wishlistCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Cart Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-gray-700 hover:text-primary transition-colors duration-200"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="bg-primary text-primary-foreground text-xs h-5 w-5 flex items-center justify-center p-0">
                        {cartItemsCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left ${
                            location === link.href ? "bg-primary/10 text-primary" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
