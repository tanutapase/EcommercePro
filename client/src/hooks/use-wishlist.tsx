import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface WishlistContextType {
  wishlistItems: Product[] | undefined;
  isLoading: boolean;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  isAddingToWishlist: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: wishlistItems,
    isLoading,
  } = useQuery<Product[]>({
    queryKey: ["/api/wishlist"],
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", "/api/wishlist", { productId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Added to wishlist",
        description: "Product added to your wishlist!",
        className: "notification-success",
      });
    },
    onError: (error: any) => {
      const message = error.message.includes("409") 
        ? "Product is already in your wishlist" 
        : "Failed to add to wishlist. Please try again.";
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("DELETE", `/api/wishlist/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: "Product removed from your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToWishlist = (productId: number) => {
    addToWishlistMutation.mutate(productId);
  };

  const removeFromWishlist = (productId: number) => {
    removeFromWishlistMutation.mutate(productId);
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems?.some(item => item.id === productId) || false;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isAddingToWishlist: addToWishlistMutation.isPending,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
