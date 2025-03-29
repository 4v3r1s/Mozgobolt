import { useState } from "react";
import { ShoppingCart, Heart, Image as ImageIcon } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./badge";

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  // Format price with Hungarian formatting (spaces as thousand separators and Ft suffix)
  const formatPrice = (price) => {
    return `${price.toLocaleString('hu-HU').replace(/,/g, ' ')} Ft`
  }

  // Calculate if product is on sale
  const isOnSale = product.discountPrice !== null && product.discountPrice < product.price
  
  // Format unit price
  const formatUnitPrice = (price, unit) => {
    if (!unit) return ''
    return `${unit} (${formatPrice(price)}/${unit.split(' ')[1] || 'db'})`
  }

  // Handle add to cart
  const handleAddToCart = () => {
    console.log(`Added product to cart: ${product.id} - ${product.name}`)
    // Here you would implement your cart functionality
  }

  // Handle add to favorites
  const handleAddToFavorites = () => {
    console.log(`Added product to favorites: ${product.id} - ${product.name}`)
    // Here you would implement your favorites functionality
  }

  // Get product image URL
  // product-card.jsx - getProductImage függvény módosítása
// Frissített getProductImage függvény
const getProductImage = () => {
  // Ha van feltöltött kép (kepUrl), azt használjuk
  if (product.kepUrl) {
    // Teljes URL-t használunk, hogy biztosan működjön
    return `http://localhost:3000${product.kepUrl}`;
  }
  // Ha nincs feltöltött kép, de van image vagy hivatkozás, azt használjuk
  else if (product.image) {
    return product.image;
  }
  else if (product.hivatkozas) {
    return product.hivatkozas;
  }
  // Ha egyik sincs, null-t adunk vissza és placeholder-t jelenítünk meg
  return null;
}


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {imageError || !getProductImage() ? (
          // Placeholder div kép helyett
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        ) : (
          <img 
            src={getProductImage()} 
            alt={product.name} 
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {isOnSale && (
          <Badge className="absolute top-2 right-2 bg-red-700">
            {product.discount}% Akció
          </Badge>
        )}
        {product.isAdult && (
          <Badge className="absolute top-2 left-2 bg-gray-800">
            18+
          </Badge>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Elfogyott</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 h-12 overflow-hidden">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          {isOnSale ? (
            <>
              <span className="text-red-700 font-bold">{formatPrice(product.discountPrice)}</span>
              <span className="text-gray-500 text-sm line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-4">
          {product.unit && formatUnitPrice(
            isOnSale ? product.discountUnitPrice : product.unitPrice,
            product.unit
          )}
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-red-700 hover:bg-red-800"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Kosárba
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-red-700 text-red-700 hover:bg-red-50"
            onClick={handleAddToFavorites}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
