import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Heart, ShoppingCart, Menu, X, Zap, Sun, Moon, Bell } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { cartItems, toggleCart } = useCart();
  const { wishlistItems } = useWishlist();

  const cartItemsCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "All Products" },
    { href: "/products?category=1", label: "Fashion" },
    { href: "/products?category=2", label: "Electronics" },
    { href: "/products?category=3", label: "Home & Decor" },
    { href: "/products?category=4", label: "Sports" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-lg shadow-black/5 border-b border-white/40"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100/80"
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
        <span className="opacity-90">✨ Free shipping on orders over $50 &nbsp;·&nbsp; New arrivals every week</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>

          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl blue-gradient flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Elite<span className="gradient-text">Shop</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ y: -1 }}
                  className={`nav-link px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-gray-50 ${
                    location === link.href ? "active text-blue-600 bg-blue-50" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.form
                  key="search-open"
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onSubmit={handleSearch}
                  className="hidden md:flex items-center relative overflow-hidden"
                >
                  <Input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-9 rounded-full border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  />
                  <Search className="absolute left-3 h-3.5 w-3.5 text-gray-400" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-1 h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div key="search-closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden md:flex h-9 w-9 p-0 rounded-full hover:bg-gray-100 text-gray-600"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="hidden md:flex h-9 w-9 p-0 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0 rounded-full hover:bg-rose-50 text-gray-600 hover:text-rose-500"
                onClick={() => navigate("/products?wishlist=true")}
              >
                <Heart className="h-4 w-4" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-badge-pulse"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={toggleCart}
                className="relative h-9 rounded-full bg-gray-900 hover:bg-gray-800 text-white gap-2 px-4 shadow-lg shadow-gray-900/10 transition-all"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Cart</span>
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-9 w-9 p-0 rounded-full">
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-xl blue-gradient flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white fill-white" />
                      </div>
                      <span className="text-xl font-bold">Elite<span className="gradient-text">Shop</span></span>
                    </div>
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 rounded-full text-sm"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    </form>
                  </div>
                  <nav className="flex-1 p-4 overflow-auto">
                    {navLinks.map((link, i) => (
                      <Link key={link.href} href={link.href}>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-xl mb-1 text-sm font-medium cursor-pointer transition-colors ${
                            location === link.href
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {link.label}
                        </motion.div>
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full gap-2"
                        onClick={() => { navigate("/products?wishlist=true"); setIsMobileMenuOpen(false); }}
                      >
                        <Heart className="h-4 w-4" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full gap-2 bg-gray-900 text-white"
                        onClick={() => { toggleCart(); setIsMobileMenuOpen(false); }}
                      >
                        <ShoppingCart className="h-4 w-4" /> Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
