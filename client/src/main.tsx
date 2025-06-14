import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./hooks/use-cart";
import { WishlistProvider } from "./hooks/use-wishlist";

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </CartProvider>
);
