import { useState, useEffect } from "react";
import { Button } from "./Button";

export default function ProductCard({ product }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const [isPromoActive, setIsPromoActive] = useState(false);
  
  // Check if promotion is active
  useEffect(() => {
    if (product.discountPrice && product.akcio_eleje && product.akcio_vege) {
      const currentDate = new Date();
      const startDate = new Date(product.akcio_eleje);
      const endDate = new Date(product.akcio_vege);
      
      // Set promotion status based on current date
      setIsPromoActive(currentDate >= startDate && currentDate <= endDate);
    } else {
      setIsPromoActive(false);
    }
  }, [product]);
  
  // Kosárba helyezés kezelése
  const handleAddToCart = (e) => {
    e.preventDefault(); // Megakadályozzuk az alapértelmezett navigációt
    e.stopPropagation(); // Megakadályozzuk az esemény buborékolását
    
    // Létrehozzuk a kosár elemet
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      // Only use discount price if promotion is active
      discountPrice: isPromoActive ? product.discountPrice : null,
      image: product.kepUrl ? `http://localhost:3000${product.kepUrl}` : product.image,
      quantity: 1,
      unit: product.unit || 'db'
    };
    
    // Ellenőrizzük, hogy van-e már ilyen termék a kosárban
    const savedCart = localStorage.getItem('cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Ha már van ilyen termék, növeljük a mennyiséget
      cartItems[existingItemIndex].quantity += 1;
      alert(`${product.name} mennyisége növelve a kosárban!`);
    } else {
      // Ha még nincs, hozzáadjuk
      cartItems.push(cartItem);
      alert(`${product.name} sikeresen hozzáadva a kosárhoz!`);
    }
    
    // Mentjük a kosarat
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Esemény kiváltása a kosár frissítéséről
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
    
    // Visszajelzés a felhasználónak
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000); // 2 másodperc után eltűnik
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg relative">
      {/* Sikeres kosárba helyezés üzenet */}
      {addedToCart && (
        <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-2 z-10">
          Termék sikeresen hozzáadva a kosárhoz!
        </div>
      )}
      
      <div className="relative h-48 flex items-center justify-center bg-gray-100">
        {/* Termék képe - módosítva, hogy teljesen beleférjen a keretbe */}
        <img 
          src={product.kepUrl ? `http://localhost:3000${product.kepUrl}` : product.image || "/public/placeholder.png"} 
          alt={product.name} 
          className="max-w-full max-h-48 object-contain"
        />
        
        {/* Akciós címke - csak ha aktív az akció */}
        {isPromoActive && product.discountPrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% AKCIÓ
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
        
        <div className="text-sm text-gray-500 mb-2">
          {product.unit}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            {isPromoActive && product.discountPrice ? (
              <div className="flex items-center">
                <span className="text-red-600 font-medium">{product.discountPrice} Ft</span>
                <span className="ml-2 text-sm text-gray-500 line-through">{product.price} Ft</span>
              </div>
            ) : (
              <span className="text-gray-700 font-medium">{product.price} Ft</span>
            )}
            {product.unitPrice && (
              <div className="text-xs text-gray-500 mt-1">
                {isPromoActive && product.discountUnitPrice ? product.discountUnitPrice : product.unitPrice} Ft/egység
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleAddToCart}
            className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-md text-sm"
          >
            Kosárba
          </Button>
        </div>
      </div>
    </div>
  );
}
