import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface Product {
    id: string;
    name: string;
    category: string;
    product: string;
    quantity: number;
    price_byn: number;
    net_weight: string;
}

interface CartContextType {
    cartItems: Product[];
    addToCart: (item: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    totalUniqueItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<Product[]>(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });
    const [totalUniqueItems, setTotalUniqueItems] = useState<number>(0);

    useEffect(() => {
        const uniqueItems = new Set<string>();
        cartItems.forEach(item => {
            uniqueItems.add(item.id);
        });
        setTotalUniqueItems(uniqueItems.size);
    }, [cartItems]);

    const addToCart = (item: Product) => {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            alert("Product already in the cart")
            console.warn("Product already in the cart");
            return;
        }

        item.quantity = 1;

        const updatedCartItems = [...cartItems, item];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const removeFromCart = (id: string) => {
        const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalUniqueItems }}>
            {children}
        </CartContext.Provider>
    );
};
