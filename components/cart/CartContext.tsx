'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CartStorageItem } from '@/types/database';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selected_color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  depositPercentage: number;
  depositAmount: number;
  remainingAmount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gogo_concrete_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [depositPercentage, setDepositPercentage] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Fetch deposit percentage from settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'deposit_percentage')
          .single();

        if (data && data.value) {
          const pct = Number(data.value);
          if (!isNaN(pct) && pct >= 0 && pct <= 100) {
            setDepositPercentage(pct);
          }
        }
      } catch (err) {
        console.error('Failed to load deposit setting', err);
      }
    }
    loadSettings();
  }, []);

  // 2. Load Cart from localStorage and resolve true products from DB
  useEffect(() => {
    async function hydrateCart() {
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) {
          setIsLoading(false);
          return;
        }

        const storedItems: CartStorageItem[] = JSON.parse(raw);
        if (!Array.isArray(storedItems) || storedItems.length === 0) {
          setIsLoading(false);
          return;
        }

        const productIds = storedItems.map(i => i.product_id);
        const { data: dbProducts, error } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
          .eq('is_active', true);

        if (error || !dbProducts) {
          setIsLoading(false);
          return;
        }

        const resolvedItems: CartItem[] = [];
        for (const stored of storedItems) {
          const prod = dbProducts.find((p: Product) => p.id === stored.product_id);
          if (prod && prod.stock > 0) {
            resolvedItems.push({
              product_id: prod.id,
              quantity: Math.min(stored.quantity, prod.stock),
              selected_color: stored.selected_color,
              product: prod,
            });
          }
        }

        setItems(resolvedItems);
      } catch (err) {
        console.error('Failed to hydrate cart from storage', err);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateCart();
  }, []);

  // 3. Save Cart minimal identifiers to localStorage whenever items change
  useEffect(() => {
    if (isLoading) return;
    const minimalData: CartStorageItem[] = items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      selected_color: item.selected_color,
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(minimalData));
  }, [items, isLoading]);

  const addItem = (product: Product, quantity: number = 1, selected_color?: string) => {
    if (product.stock <= 0) {
      toast.error('عذراً، هذه القطعة نفذت من المخزون');
      return;
    }

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product_id === product.id && item.selected_color === selected_color);
      if (existingIndex > -1) {
        const current = prev[existingIndex];
        const newQty = Math.min(current.quantity + quantity, product.stock);
        if (newQty === current.quantity) {
          toast.error(`الكمية المتاحة في المخزون هي ${product.stock} فقط`);
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...current, quantity: newQty };
        toast.success(`تم تحديث الكمية في السلة (${product.name_ar})`);
        return updated;
      }

      toast.success(`تمت إضافة "${product.name_ar}" إلى السلة`);
      return [...prev, {
        product_id: product.id,
        quantity: Math.min(quantity, product.stock),
        selected_color,
        product,
      }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product_id !== productId));
    toast.success('تمت إزالة المنتج من السلة');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.product_id === productId) {
        const finalQty = Math.min(quantity, item.product.stock);
        if (quantity > item.product.stock) {
          toast.error(`الكمية القصوى المتاحة هي ${item.product.stock}`);
        }
        return { ...item, quantity: finalQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const depositAmount = Math.round(subtotal * (depositPercentage / 100) * 100) / 100;
  const remainingAmount = Math.round((subtotal - depositAmount) * 100) / 100;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        depositPercentage,
        depositAmount,
        remainingAmount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
