import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Zap,
  ArrowRight,
  MapPin,
  Phone,
  Shield,
  Truck,
  RotateCcw,
  HeadphonesIcon,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const links = {
    shop: [
      { href: "/products", label: "All Products" },
      { href: "/products?category=1", label: "Fashion" },
      { href: "/products?category=2", label: "Electronics" },
      { href: "/products?category=3", label: "Home & Decor" },
      { href: "/products?category=4", label: "Sports" },
    ],
    company: [
      { href: "#", label: "About Us" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Press" },
      { href: "#", label: "Blog" },
      { href: "#", label: "Partners" },
    ],
    support: [
      { href: "#", label: "Help Center" },
      { href: "#", label: "Track Order" },
      { href: "#", label: "Returns & Exchanges" },
      { href: "#", label: "Shipping Info" },
      { href: "#", label: "Contact Us" },
    ],
  };

  const social = [
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-[#1DA1F2]" },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500",
    },
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:bg-[#1877F2]",
    },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-[#FF0000]" },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:bg-[#0A66C2]",
    },
  ];

  const perks = [
    { icon: Truck, label: "Free Shipping", sub: "On orders $50+" },
    { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
    { icon: Shield, label: "Secure Pay", sub: "256-bit SSL" },
    { icon: HeadphonesIcon, label: "24/7 Support", sub: "Always here" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Perks Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {perk.label}
                    </p>
                    <p className="text-xs text-gray-500">{perk.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer mb-4">
                <div className="w-9 h-9 rounded-xl blue-gradient flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Elite<span className="gradient-text">Shop</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Your premier destination for curated premium products. Quality
              guaranteed, style delivered, satisfaction assured.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-white mb-3">
                Stay in the loop
              </p>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-400 text-sm font-medium"
                >
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    ✓
                  </span>
                  You're subscribed! Welcome aboard.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-full text-sm focus:border-blue-500"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 px-4 rounded-full btn-primary flex-shrink-0"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {social.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 ${s.color}`}
                    aria-label={s.label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Shop", items: links.shop },
            { title: "Company", items: links.company },
            { title: "Support", items: links.support },
          ].map((section, si) => (
            <div key={section.title}>
              <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.items.map((link, li) => (
                  <motion.li
                    key={link.href + link.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: li * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link href={link.href}>
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2025 EliteShop. All rights reserved by Tanu.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-700">·</span>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-700">·</span>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Cookie Settings
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Accepted payments:</span>
            {["VISA", "MC", "AMEX", "PayPal"].map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px] font-bold"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
