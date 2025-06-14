import { 
  categories, 
  products, 
  reviews, 
  cartItems, 
  wishlistItems,
  type Category, 
  type Product, 
  type Review, 
  type CartItem, 
  type WishlistItem,
  type InsertCategory,
  type InsertProduct,
  type InsertReview,
  type InsertCartItem,
  type InsertWishlistItem,
  type ProductWithCategory,
  type CartItemWithProduct
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(categoryId?: number, search?: string): Promise<ProductWithCategory[]>;
  getProductById(id: number): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Reviews
  getReviewsByProductId(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(sessionId: string, productId: number, quantity: number): Promise<CartItem>;
  updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(sessionId: string, productId: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Wishlist
  getWishlistItems(sessionId: string): Promise<Product[]>;
  addToWishlist(sessionId: string, productId: number): Promise<WishlistItem>;
  removeFromWishlist(sessionId: string, productId: number): Promise<boolean>;
  isInWishlist(sessionId: string, productId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private reviews: Map<number, Review>;
  private cartItems: Map<number, CartItem>;
  private wishlistItems: Map<number, WishlistItem>;
  private categoryIdCounter: number = 1;
  private productIdCounter: number = 1;
  private reviewIdCounter: number = 1;
  private cartIdCounter: number = 1;
  private wishlistIdCounter: number = 1;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoryData = [
      { name: "Fashion", description: "Trendy clothing and accessories", icon: "fas fa-tshirt", color: "purple" },
      { name: "Electronics", description: "Latest gadgets and tech", icon: "fas fa-laptop", color: "blue" },
      { name: "Home & Decor", description: "Beautiful home essentials", icon: "fas fa-home", color: "green" },
      { name: "Sports", description: "Fitness and sports equipment", icon: "fas fa-dumbbell", color: "orange" },
    ] as const;

    categoryData.forEach(cat => {
      const category: InsertCategory = {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color
      };
      this.createCategory(category);
    });

    // Initialize products
    const productData = [
      {
        name: "Designer Dress",
        description: "Elegant designer dress perfect for special occasions",
        price: "89.99",
        originalPrice: "129.99",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 1,
        rating: "4.0",
        reviewCount: 24,
        isSale: true,
        tags: ["dress", "designer", "formal"]
      },
      {
        name: "Premium Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: "199.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 2,
        rating: "5.0",
        reviewCount: 47,
        tags: ["headphones", "wireless", "audio"]
      },
      {
        name: "Modern Vase Set",
        description: "Beautiful ceramic vase set for modern home decor",
        price: "49.99",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 3,
        rating: "4.5",
        reviewCount: 18,
        isNew: true,
        tags: ["vase", "ceramic", "decor"]
      },
      {
        name: "Casual Sneakers",
        description: "Comfortable casual sneakers for everyday wear",
        price: "79.99",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 1,
        rating: "4.0",
        reviewCount: 31,
        tags: ["sneakers", "casual", "comfort"]
      },
      {
        name: "Professional Laptop",
        description: "High-performance laptop for professionals",
        price: "899.99",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 2,
        rating: "5.0",
        reviewCount: 89,
        tags: ["laptop", "professional", "computing"]
      },
      {
        name: "Leather Handbag",
        description: "Premium leather handbag with multiple compartments",
        price: "149.99",
        originalPrice: "219.99",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 1,
        rating: "4.0",
        reviewCount: 42,
        isSale: true,
        tags: ["handbag", "leather", "accessories"]
      },
      {
        name: "Modern Desk Lamp",
        description: "Adjustable LED desk lamp with multiple brightness settings",
        price: "69.99",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 3,
        rating: "4.5",
        reviewCount: 27,
        tags: ["lamp", "led", "office"]
      },
      {
        name: "Fitness Smartwatch",
        description: "Advanced fitness tracking smartwatch with GPS",
        price: "299.99",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        categoryId: 4,
        rating: "5.0",
        reviewCount: 156,
        tags: ["smartwatch", "fitness", "gps"]
      }
    ] as const;

    productData.forEach(prod => {
      const product: InsertProduct = {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        originalPrice: (prod as any).originalPrice,
        image: prod.image,
        categoryId: prod.categoryId,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        isSale: (prod as any).isSale,
        isNew: (prod as any).isNew,
        tags: prod.tags ? [...prod.tags] : undefined
      };
      this.createProduct(product);
    });

    // Initialize reviews
    const reviewData = [
      {
        productId: 1,
        customerName: "Sarah Johnson",
        rating: 5,
        comment: "Beautiful dress, perfect fit and great quality!",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        productId: 2,
        customerName: "Mike Chen",
        rating: 5,
        comment: "Amazing sound quality and comfortable to wear.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      },
      {
        productId: 3,
        customerName: "Emma Wilson",
        rating: 4,
        comment: "Love the modern design, fits perfectly in my living room.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
      }
    ] as const;

    reviewData.forEach(rev => {
      const review: InsertReview = {
        productId: rev.productId,
        customerName: rev.customerName,
        rating: rev.rating,
        comment: rev.comment,
        avatar: rev.avatar
      };
      this.createReview(review);
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = { 
      ...category, 
      id: this.categoryIdCounter++,
      description: category.description || null
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  // Products
  async getProducts(categoryId?: number, search?: string): Promise<ProductWithCategory[]> {
    let products = Array.from(this.products.values());
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async getProductById(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    return {
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = { 
      ...product, 
      id: this.productIdCounter++,
      description: product.description || null,
      categoryId: product.categoryId || null,
      originalPrice: product.originalPrice || null,
      rating: product.rating || null,
      reviewCount: product.reviewCount || null,
      inStock: product.inStock ?? true,
      isNew: product.isNew ?? false,
      isSale: product.isSale ?? false,
      tags: product.tags || null
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  // Reviews
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.productId === productId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = { 
      ...review, 
      id: this.reviewIdCounter++,
      productId: review.productId || null,
      comment: review.comment || null,
      avatar: review.avatar || null
    };
    this.reviews.set(newReview.id, newReview);
    return newReview;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId!)!
    })).filter(item => item.product);
  }

  async addToCart(sessionId: string, productId: number, quantity: number): Promise<CartItem> {
    const existingItem = Array.from(this.cartItems.values())
      .find(item => item.sessionId === sessionId && item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem;
    }

    const newItem: CartItem = {
      id: this.cartIdCounter++,
      sessionId,
      productId,
      quantity
    };
    this.cartItems.set(newItem.id, newItem);
    return newItem;
  }

  async updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartItem | undefined> {
    const item = Array.from(this.cartItems.values())
      .find(item => item.sessionId === sessionId && item.productId === productId);

    if (item) {
      item.quantity = quantity;
      return item;
    }
    return undefined;
  }

  async removeFromCart(sessionId: string, productId: number): Promise<boolean> {
    const item = Array.from(this.cartItems.values())
      .find(item => item.sessionId === sessionId && item.productId === productId);

    if (item) {
      this.cartItems.delete(item.id);
      return true;
    }
    return false;
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId);
    
    itemsToRemove.forEach(([id]) => this.cartItems.delete(id));
  }

  // Wishlist
  async getWishlistItems(sessionId: string): Promise<Product[]> {
    const wishlistItems = Array.from(this.wishlistItems.values())
      .filter(item => item.sessionId === sessionId);
    
    return wishlistItems.map(item => this.products.get(item.productId!)!)
      .filter(product => product);
  }

  async addToWishlist(sessionId: string, productId: number): Promise<WishlistItem> {
    const newItem: WishlistItem = {
      id: this.wishlistIdCounter++,
      sessionId,
      productId
    };
    this.wishlistItems.set(newItem.id, newItem);
    return newItem;
  }

  async removeFromWishlist(sessionId: string, productId: number): Promise<boolean> {
    const item = Array.from(this.wishlistItems.values())
      .find(item => item.sessionId === sessionId && item.productId === productId);

    if (item) {
      this.wishlistItems.delete(item.id);
      return true;
    }
    return false;
  }

  async isInWishlist(sessionId: string, productId: number): Promise<boolean> {
    return Array.from(this.wishlistItems.values())
      .some(item => item.sessionId === sessionId && item.productId === productId);
  }
}

export const storage = new MemStorage();
