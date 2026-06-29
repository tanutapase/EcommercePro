import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Laptop, Home, Dumbbell, Star, ArrowRight,
  Truck, Shield, Headphones, RotateCcw, Zap, Package,
  TrendingUp, CheckCircle, Timer, Sparkles, ChevronRight,
} from "lucide-react";
import ProductGrid from "@/components/product/product-grid";
import { formatPrice } from "@/lib/utils";
import type { Category, ProductWithCategory } from "@shared/schema";

/* ── Animated counter ─────────────────────────────────────── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Countdown timer ──────────────────────────────────────── */
function useCountdown(targetHours = 5) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });
  useEffect(() => {
    const end = Date.now() + targetHours * 3600 * 1000;
    const tick = setInterval(() => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
      if (diff === 0) clearInterval(tick);
    }, 1000);
    return () => clearInterval(tick);
  }, []);
  return time;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* ── Category icons & gradients ──────────────────────────── */
const CATEGORY_META: Record<string, { icon: any; gradient: string; bg: string; image: string }> = {
  Fashion: {
    icon: ShoppingBag,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
  },
  Electronics: {
    icon: Laptop,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
  },
  "Home & Decor": {
    icon: Home,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },
  Sports: {
    icon: Dumbbell,
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
  },
};

/* ── Main ─────────────────────────────────────────────────── */
export default function HomePage() {
  const countdown = useCountdown(5);

  const { data: categories } = useQuery<Category[]>({ queryKey: ["/api/categories"] });

  const { data: allProducts, isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = allProducts?.slice(0, 8);
  const saleProducts = allProducts?.filter((p) => p.isSale).slice(0, 4);

  const stats = [
    { value: 50000, suffix: "+", label: "Happy Customers" },
    { value: 1200, suffix: "+", label: "Products" },
    { value: 99, suffix: "%", label: "Satisfaction" },
    { value: 48, suffix: "h", label: "Avg. Delivery" },
  ];

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders over $50", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption", color: "text-violet-600", bg: "bg-violet-50" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated help team", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Package, title: "Premium Packaging", desc: "Gift-ready by default", color: "text-pink-600", bg: "bg-pink-50" },
    { icon: Zap, title: "Lightning Fast", desc: "Express delivery available", color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Verified Buyer",
      rating: 5,
      comment: "Absolutely love the quality! The products exceeded my expectations and the delivery was lightning fast. Will definitely shop again.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
      product: "Designer Collection",
    },
    {
      name: "Mike Chen",
      role: "Verified Buyer",
      rating: 5,
      comment: "The website experience is flawless — easy navigation, fast checkout, and premium packaging. This is how online shopping should feel.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces",
      product: "Tech Accessories",
    },
    {
      name: "Emma Wilson",
      role: "Verified Buyer",
      rating: 5,
      comment: "Found exactly what I was looking for at the best price. The curation is phenomenal and everything feels so premium.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3e1?w=80&h=80&fit=crop&crop=faces",
      product: "Home Decor",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center aurora-bg overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 blob blob-blue opacity-30 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 blob blob-purple opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 blob blob-gold opacity-15 pointer-events-none" />

        {/* Dot pattern */}
        <div className="absolute inset-0 section-dot-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column */}
            <div className="space-y-8">
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  Premium Collection · Summer 2025
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-gray-900">
                  Discover
                  <br />
                  <span className="gradient-text">Products</span>
                  <br />
                  You'll Love.
                </h1>
              </motion.div>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-500 leading-relaxed max-w-md"
              >
                Premium curated products with lightning-fast delivery, trusted quality, and unbeatable prices.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/products">
                  <Button
                    size="lg"
                    className="btn-primary rounded-full px-8 h-14 text-base font-semibold gap-2 magnetic-btn w-full sm:w-auto"
                  >
                    Shop Collection
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products?sale=true">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 h-14 text-base font-semibold gap-2 magnetic-btn border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                  >
                    <Zap className="h-4 w-4 text-amber-500" />
                    Explore Deals
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-3"
              >
                {[
                  { icon: "★★★★★", label: "50,000+ Reviews" },
                  { icon: "🚀", label: "Free Shipping" },
                  { icon: "🔒", label: "Secure Payments" },
                  { icon: "↩️", label: "Easy Returns" },
                ].map((t) => (
                  <span key={t.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-xs text-gray-600 font-medium">
                    <span>{t.icon}</span>
                    {t.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              {/* Main hero image */}
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50"
                  style={{ boxShadow: "0 40px 80px -20px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(255,255,255,0.5)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=800&fit=crop"
                    alt="Premium shopping"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </motion.div>

                {/* Floating card: discount */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -left-10 top-12 glass rounded-2xl p-4 shadow-xl min-w-[160px]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Flash Deal</p>
                      <p className="text-base font-black text-gray-900">30% OFF</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Ends in 5:00:00</div>
                </motion.div>

                {/* Floating card: review */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                  className="absolute -right-8 bottom-16 glass rounded-2xl p-4 shadow-xl min-w-[200px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces"
                      className="w-8 h-8 rounded-full object-cover"
                      alt="reviewer"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Sarah J.</p>
                      <div className="flex">
                        {[1,2,3,4,5].map(i => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-snug">"Absolutely amazing quality!"</p>
                </motion.div>

                {/* Floating card: orders */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 left-12 glass rounded-2xl p-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[
                        "photo-1438761681033-6461ffad8d80",
                        "photo-1472099645785-5658abf4ff4e",
                        "photo-1494790108755-2616b612b3e1",
                      ].map((p, i) => (
                        <img
                          key={i}
                          src={`https://images.unsplash.com/${p}?w=32&h=32&fit=crop&crop=faces`}
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                          alt=""
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">+2,400 orders</p>
                      <p className="text-[10px] text-gray-500">in the last 24h</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
          ══════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-black gradient-text mb-1">
                  <Counter end={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-gray-400 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORIES
          ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2 block">
                Browse
              </span>
              <h2 className="text-4xl font-black tracking-tight text-gray-900">
                Shop by Category
              </h2>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-1 text-gray-500 hover:text-blue-600 rounded-full hidden sm:flex">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories?.map((category, i) => {
              const meta = CATEGORY_META[category.name] || {
                icon: ShoppingBag,
                gradient: "from-gray-400 to-gray-600",
                bg: "bg-gray-50",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
              };
              const Icon = meta.icon;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/products?category=${category.id}`}>
                    <div className="category-card group bg-white overflow-hidden cursor-pointer">
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={meta.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        {i === 0 && (
                          <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Popular
                          </span>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{category.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FLASH SALE
          ══════════════════════════════════════════ */}
      {saleProducts && saleProducts.length > 0 && (
        <section className="py-24 bg-gray-950 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 animate-gradient"
            style={{
              background: "linear-gradient(-45deg, #1e1b4b, #0f172a, #1e3a5f, #0f172a)",
              backgroundSize: "400% 400%",
            }}
          />
          <div className="absolute inset-0 section-dot-pattern opacity-10" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide"
                  >
                    <Zap className="h-3 w-3" />
                    Flash Sale
                  </motion.span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">
                  Today's Deals
                </h2>
                <p className="text-gray-400 mt-1 text-sm">Limited quantities — don't miss out</p>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">Ends in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { value: pad(countdown.h), label: "HRS" },
                    { value: pad(countdown.m), label: "MIN" },
                    { value: pad(countdown.s), label: "SEC" },
                  ].map(({ value, label }, i) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className="text-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={value}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="countdown-digit"
                          >
                            {value}
                          </motion.div>
                        </AnimatePresence>
                        <p className="text-[9px] text-gray-500 font-bold mt-1 tracking-wider">{label}</p>
                      </div>
                      {i < 2 && <span className="text-gray-500 font-bold text-lg mb-4">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <ProductGrid
              products={saleProducts}
              isLoading={false}
            />

            <div className="text-center mt-10">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-gray-600 text-gray-300 hover:bg-white hover:text-gray-900 hover:border-white px-8 h-12 font-semibold gap-2"
                >
                  View All Deals <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS
          ══════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2 block">
                Handpicked
              </span>
              <h2 className="text-4xl font-black tracking-tight text-gray-900">
                Featured Products
              </h2>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-1 text-gray-500 hover:text-blue-600 rounded-full hidden sm:flex">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button size="lg" className="btn-primary rounded-full px-10 h-13 text-base font-semibold gap-2 magnetic-btn">
                Browse All Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY CHOOSE US
          ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3 block">
              Our Promise
            </span>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
              Why Choose EliteShop?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              We've built every detail of the experience with you in mind — from premium curation to hassle-free delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:border-gray-200 transition-all duration-300 cursor-default"
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3 block">
              Testimonials
            </span>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
              Loved by Thousands
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-500 text-sm">4.9 out of 5 · Based on 50,000+ reviews</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  "{t.comment}"
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <p className="text-xs text-gray-400">{t.role} · {t.product}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BOTTOM CTA BANNER
          ══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 blue-gradient" />
        <div className="absolute inset-0 section-dot-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-80 h-80 blob blob-purple opacity-20 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white/90 text-sm font-semibold mb-6">
              <TrendingUp className="h-3.5 w-3.5" />
              New arrivals every week
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Ready to upgrade
              <br />your lifestyle?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ happy shoppers who trust EliteShop for premium quality products delivered fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 rounded-full px-8 h-14 font-semibold gap-2 magnetic-btn shadow-xl shadow-blue-900/20"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?category=2">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 font-semibold"
                >
                  Explore Electronics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
