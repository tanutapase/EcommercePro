import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertWishlistItemSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

function getSessionId(req: any): string {
  // Simple session ID generation - in production, use proper session management
  if (!req.session) {
    req.session = {};
  }
  if (!req.session.id) {
    req.session.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  return req.session.id;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, search } = req.query;
      const products = await storage.getProducts(
        categoryId ? parseInt(categoryId as string) : undefined,
        search as string
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByProductId(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviewData = insertReviewSchema.parse({ ...req.body, productId });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid review data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const { productId, quantity = 1 } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const cartItem = await storage.addToCart(sessionId, parseInt(productId), quantity);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:productId", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;

      if (quantity <= 0) {
        const removed = await storage.removeFromCart(sessionId, productId);
        return res.json({ removed });
      }

      const cartItem = await storage.updateCartItem(sessionId, productId, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:productId", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const productId = parseInt(req.params.productId);
      const removed = await storage.removeFromCart(sessionId, productId);
      
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Wishlist
  app.get("/api/wishlist", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const wishlistItems = await storage.getWishlistItems(sessionId);
      res.json(wishlistItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const isAlreadyInWishlist = await storage.isInWishlist(sessionId, parseInt(productId));
      if (isAlreadyInWishlist) {
        return res.status(409).json({ message: "Product already in wishlist" });
      }

      const wishlistItem = await storage.addToWishlist(sessionId, parseInt(productId));
      res.status(201).json(wishlistItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const productId = parseInt(req.params.productId);
      const removed = await storage.removeFromWishlist(sessionId, productId);
      
      if (!removed) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  app.get("/api/wishlist/check/:productId", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const productId = parseInt(req.params.productId);
      const isInWishlist = await storage.isInWishlist(sessionId, productId);
      res.json({ isInWishlist });
    } catch (error) {
      res.status(500).json({ message: "Failed to check wishlist status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
