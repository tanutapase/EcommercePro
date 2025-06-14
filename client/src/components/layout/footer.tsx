import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Phone, 
  Mail, 
  MapPin 
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/products?category=1", label: "Fashion" },
    { href: "/products?category=2", label: "Electronics" },
    { href: "/about", label: "About Us" },
  ];

  const customerService = [
    { href: "/help", label: "Help Center" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/returns", label: "Returns" },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/track-order", label: "Track Order" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-secondary text-white">
      {/* Newsletter Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-primary text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h3 variants={itemVariants} className="text-3xl font-bold mb-4">
            Stay Updated
          </motion.h3>
          <motion.p variants={itemVariants} className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter for exclusive deals and new arrivals
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white text-gray-800 placeholder:text-gray-500 border-0 focus:ring-4 focus:ring-blue-300"
            />
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold transform hover:scale-105 transition-all duration-200">
              Subscribe
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Footer */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div variants={itemVariants}>
              <h4 className="text-2xl font-bold mb-4">
                Elite<span className="text-primary">Shop</span>
              </h4>
              <p className="text-gray-300 mb-6">
                Your premier destination for quality products and exceptional shopping experience.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        {link.label}
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Customer Service */}
            <motion.div variants={itemVariants}>
              <h5 className="font-semibold mb-4">Customer Service</h5>
              <ul className="space-y-2">
                {customerService.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        {link.label}
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h5 className="font-semibold mb-4">Contact Info</h5>
              <div className="space-y-3 text-gray-300">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@eliteshop.com</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>123 Shopping St, NY 10001</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <motion.div
            variants={itemVariants}
            className="text-center text-gray-300"
          >
            <p>
              &copy; 2024 EliteShop. All rights reserved. |{" "}
              <Link href="/privacy">
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              </Link>{" "}
              |{" "}
              <Link href="/terms">
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
