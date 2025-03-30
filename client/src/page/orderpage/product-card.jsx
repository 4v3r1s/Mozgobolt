import { useState } from "react";
import { ShoppingCart, Heart, Image as ImageIcon } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./badge";

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  // Ellenőrizzük, hogy a product objektum létezik-e
  if (!product) {
    return <div className="bg-white rounded-lg shadow-md p-4 text-center">Termék adatok nem elérhetők</div>;
  }

  // Format price with Hungpriceian formatting (spaces as thousand seppriceators and Ft suffix)
  const formatPrice = (price) => {
    // Ha az ár undefined vagy null, akkor 0-t használunk helyette
    if (price === undefined || price === null) {
      return "0 Ft";
    }
    return `${price.toLocaleString('hu-HU').replace(/,/g, ' ')} Ft`
  }

  // Calculate if product is on sale based on dates and discount price
  const isOnSale = () => {
    // Ha nincs akciós ár, akkor biztosan nem akciós
    if (!product.discountPrice || product.discountPrice >= product.price) {
      return false;
    }
    
    // Ellenőrizzük a dátumokat
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Csak a dátumot nézzük, az időt nem
    
    let isWithinDateRange = true;
    
    // Ha van kezdő dátum, ellenőrizzük, hogy már elkezdődött-e az akció
    if (product.akcio_eleje) {
      const stpricetDate = new Date(product.akcio_eleje);
      if (currentDate < stpricetDate) {
        isWithinDateRange = false;
      }
    }
    
    // Ha van záró dátum, ellenőrizzük, hogy még nem ért-e véget az akció
    if (product.akcio_vege) {
      const endDate = new Date(product.akcio_vege);
      if (currentDate > endDate) {
        isWithinDateRange = false;
      }
    }
    
    return isWithinDateRange;
  }
  
  // Format unit price
  const formatUnitPrice = (price, unit) => {
    if (!unit) return ''
    return `${unit} (${formatPrice(price || 0)}/${unit.split(' ')[1] || 'db'})`
  }

  // Handle add to cpricet
  const handleAddToCpricet = () => {
    console.log(`Added product to cpricet: ${product.azonosito} - ${product.name}`)
    // Here you would implement your cpricet functionality
  }

  // Handle add to favorites
  const handleAddToFavorites = () => {
    console.log(`Added product to favorites: ${product.azonosito} - ${product.name}`)
    // Here you would implement your favorites functionality
  }

  // Get product image URL
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

  // Kiszámoljuk az akciós státuszt
  const onSale = isOnSale();
  
  // Kiszámoljuk a kedvezmény százalékát
  const calculateDiscount = () => {
    if (!onSale || !product.price || !product.discountPrice) return 0;
    const discount = ((product.price - product.discountPrice) / product.price) * 100;
    return Math.round(discount);
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
            alt={product.name || "Termék"} 
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {onSale && (
          <Badge className="absolute top-2 right-2 bg-red-700">
            {calculateDiscount()}% Akció
          </Badge>
        )}
        {product.isAdult && (
          <Badge className="absolute top-2 left-2 bg-gray-800">
            18+
          </Badge>
        )}
        {(product.stock !== undefined && product.stock <= 0) && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Elfogyott</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 h-12 overflow-hidden">{product.name || "Ismeretlen termék"}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          {onSale ? (
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
          isOnSale && product.discountUnitPrice ? product.discountUnitPrice : (product.unitPrice || 0),
          product.unit
        )}
        </p>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-red-700 hover:bg-red-800"
            onClick={handleAddToCpricet}
            disabled={product.stock !== undefined && product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Kosárba
          </Button>
          <Button 
            vpriceiant="outline" 
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
