import express from "express";
import type { Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import { insertCartItemSchema, insertWishlistItemSchema, insertReviewSchema } from "../shared/schema";
import { z } from "zod";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for Vercel
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Simple per-request session ID (cart/wishlist keyed by cookie or header)
function getSessionId(req: Request): string {
  const fromHeader = req.headers["x-session-id"] as string;
  if (fromHeader) return fromHeader;
  // Fallback: generate a deterministic ID from IP + user-agent for demo
  const raw = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "anon") +
               (req.headers["user-agent"] || "");
  return Buffer.from(raw).toString("base64").slice(0, 20);
}

// ── Categories ────────────────────────────────────────────────
app.get("/api/categories", async (_req, res) => {
  try {
    res.json(await storage.getCategories());
  } catch {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// ── Products ──────────────────────────────────────────────────
app.get("/api/products", async (req, res) => {
  try {
    const { category, search, limit, sale, new: isNew } = req.query;
    let products = await storage.getProducts();

    if (category) products = products.filter(p => p.categoryId === parseInt(category as string));
    if (sale === "true") products = products.filter(p => p.isSale);
    if (isNew === "true") products = products.filter(p => p.isNew);
    if (search) {
      const q = (search as string).toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
      );
    }
    if (limit) products = products.slice(0, parseInt(limit as string));

    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await storage.getProduct(parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// ── Reviews ───────────────────────────────────────────────────
app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    res.json(await storage.getReviews(parseInt(req.params.id)));
  } catch {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

app.post("/api/products/:id/reviews", async (req, res) => {
  try {
    const body = insertReviewSchema.parse({ ...req.body, productId: parseInt(req.params.id) });
    res.status(201).json(await storage.createReview(body));
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: "Failed to create review" });
  }
});

// ── Cart ──────────────────────────────────────────────────────
app.get("/api/cart", async (req, res) => {
  try {
    res.json(await storage.getCartItems(getSessionId(req)));
  } catch {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const body = insertCartItemSchema.parse({ ...req.body, sessionId: getSessionId(req) });
    const existing = (await storage.getCartItems(body.sessionId))
      .find(i => i.productId === body.productId);
    if (existing) {
      res.json(await storage.updateCartItemQuantity(existing.id, existing.quantity + (body.quantity ?? 1)));
    } else {
      res.status(201).json(await storage.createCartItem(body));
    }
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

app.put("/api/cart/:productId", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const productId = parseInt(req.params.productId);
    const { quantity } = z.object({ quantity: z.number().min(1) }).parse(req.body);
    const item = (await storage.getCartItems(sessionId)).find(i => i.productId === productId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    res.json(await storage.updateCartItemQuantity(item.id, quantity));
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: "Failed to update cart" });
  }
});

app.delete("/api/cart/:productId", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const productId = parseInt(req.params.productId);
    const item = (await storage.getCartItems(sessionId)).find(i => i.productId === productId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    await storage.deleteCartItem(item.id);
    res.json({ message: "Removed" });
  } catch {
    res.status(500).json({ message: "Failed to remove from cart" });
  }
});

app.delete("/api/cart", async (req, res) => {
  try {
    await storage.clearCart(getSessionId(req));
    res.json({ message: "Cart cleared" });
  } catch {
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

// ── Wishlist ──────────────────────────────────────────────────
app.get("/api/wishlist", async (req, res) => {
  try {
    res.json(await storage.getWishlistItems(getSessionId(req)));
  } catch {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

app.post("/api/wishlist", async (req, res) => {
  try {
    const body = insertWishlistItemSchema.parse({ ...req.body, sessionId: getSessionId(req) });
    const existing = (await storage.getWishlistItems(body.sessionId))
      .find(i => i.productId === body.productId);
    if (existing) return res.status(400).json({ message: "Already in wishlist" });
    res.status(201).json(await storage.createWishlistItem(body));
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

app.delete("/api/wishlist/:productId", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const productId = parseInt(req.params.productId);
    const item = (await storage.getWishlistItems(sessionId)).find(i => i.productId === productId);
    if (!item) return res.status(404).json({ message: "Wishlist item not found" });
    await storage.deleteWishlistItem(item.id);
    res.json({ message: "Removed" });
  } catch {
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
});

// Catch-all for unknown /api/* routes
app.use("/api/*", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

export default app;
