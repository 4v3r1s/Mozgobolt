import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, User, Heart } from "lucide-react";
import { Button } from "../orderpage/Button";
import { Input } from "../orderpage/input";
import ProductCard from "../orderpage/product-card";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [error, setError] = useState(null);

  // Animáció indítása késleltetéssel
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  // Termékek lekérése a backend API-ról
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Helyes API végpont használata
        const response = await fetch("http://localhost:3000/termek");
        
        if (!response.ok) {
          throw new Error(`Nem sikerült lekérni a termékeket: ${response.status} ${response.statusText}`);
        }
        
        const allProducts = await response.json();
        console.log("Összes lekért termék:", allProducts);
        
        // Egyszerűsített szűrés - csak azokat a termékeket mutatjuk, amelyeknek van akcióár beállítva
        const discountedProducts = allProducts.filter(product => 
          product.akciosar !== null && 
          product.akciosar !== undefined && 
          parseFloat(product.akciosar) > 0
        );
        
        console.log("Szűrt akciós termékek:", discountedProducts);
        setProducts(discountedProducts || []);
      } catch (error) {
        console.error("Hiba a termékek lekérése közben:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Kedvezmény százalék kiszámítása
  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!originalPrice || !discountPrice) return 0;
    const original = parseFloat(originalPrice);
    const discount = parseFloat(discountPrice);
    if (isNaN(original) || isNaN(discount) || original <= 0) return 0;
    return Math.round(((original - discount) / original) * 100);
  };

  // Kép URL helyes formázása
  const formatImageUrl = (url) => {
    if (!url) return null;
    
    // Ha a kép URL már tartalmazza a http vagy https előtagot, akkor hagyjuk változatlanul
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Ha a kép URL relatív útvonal, akkor egészítsük ki a szerver URL-jével
    // Eltávolítjuk a kezdő / jelet, ha van
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `http://localhost:3000/${cleanUrl}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - animált MozgoShop felirattal és logóval */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center overflow-hidden h-10">
            <a href="/" className="text-white hover:text-gray-200 flex items-center">
              <img 
                src="/logo2.png" 
                alt="MozgoShop Logo" 
                className={`h-16 -my-3 mr-3 transition-all duration-1000 ease-in-out transform ${
                  logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
              />
              <h1 
                className={`text-2xl font-bold transition-all duration-1000 ease-in-out transform ${
                  logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
              >
                MozgoShop
              </h1>
            </a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-red-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto whitespace-nowrap py-3 gap-6 text-sm font-medium">
            <li>
              <a href="/" className="hover:text-gray-200">
                KEZDŐLAP
              </a>
            </li>
            <li>
              <a href="/info" className="hover:text-gray-200">
                BEMUTATKOZÁS
              </a>
            </li>
            <li>
              <a href="/tutorial" className="hover:text-gray-200">
                RENDELÉS MENETE
              </a>
            </li>
            <li>
              <a href="/account" className="hover:text-gray-200">
                FIÓKOM
              </a>
            </li>
            <li>
              <a href="/sales" className="text-white font-bold border-b-2 border-white">
                AKCIÓK
              </a>
            </li>
            <li>
              <a href="/utvonal" className="hover:text-gray-200">
                TELEPÜLÉSEK
              </a>
            </li>
            <li>
              <a href="/StaticKapcsolat" className="hover:text-gray-200">
                KAPCSOLAT
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-red-700 text-white py-4 px-6">
              <h1 className="text-2xl font-bold">Akciós termékek</h1>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Fedezze fel aktuális akcióinkat és spóroljon vásárlásai során! Az alábbi termékek korlátozott ideig kedvezményes áron kaphatók.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Akciós termékek betöltése...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg font-semibold mb-2">Hiba történt a termékek betöltése közben</p>
              <p>{error}</p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                <p className="font-medium">Lehetséges megoldások:</p>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                  <li>Ellenőrizze, hogy a szerver fut-e</li>
                  <li>Ellenőrizze a hálózati kapcsolatot</li>
                  <li>Próbálja meg frissíteni az oldalt</li>
                </ul>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 text-lg mb-2">Jelenleg nincsenek akciós termékek.</p>
              <p className="text-gray-500">Kérjük, látogasson vissza később, vagy tekintse meg teljes kínálatunkat!</p>
              <a 
                href="/" 
                className="mt-4 inline-block px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
              >
                Vissza a főoldalra
              </a>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Aktuális akciók</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.azonosito} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      {product.kepUrl ? (
                        <img 
                          src={formatImageUrl(product.kepUrl)} 
                          alt={product.nev} 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            console.error("Kép betöltési hiba:", product.kepUrl);
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png"; // Helyettesítő kép, ha nem töltődik be
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Nincs kép</span>
                        </div>
                      )}
                      {calculateDiscount(product.ar, product.akciosar) > 0 && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {calculateDiscount(product.ar, product.akciosar)}% kedvezmény
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.nev || "Névtelen termék"}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.kiszereles || ""}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-red-600 font-bold">{product.akciosar} Ft</span>
                          {product.ar && (
                            <span className="text-gray-400 text-sm line-through ml-2">{product.ar} Ft</span>
                          )}
                        </div>
                        <button className="bg-red-700 text-white px-3 py-1 rounded-md text-sm hover:bg-red-800">
                          Kosárba
                        </button>
                      </div>
                      {product.akcio_vege && (
                        <div className="mt-2 text-xs text-gray-500">
                          Akció vége: {new Date(product.akcio_vege).toLocaleDateString('hu-HU')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MozgoShop</h3>
              <p className="text-sm">Minőségi élelmiszerek széles választéka, gyors kiszállítással az Ön otthonába.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kapcsolat</h3>
              <address className="not-italic text-sm">
                <p>1234 Budapest, Példa utca 123.</p>
                <p>Email: info@mozgoshop.hu</p>
                <p>Telefon: +36 1 234 5678</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Információk</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Általános Szerződési Feltételek
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Adatvédelmi Tájékoztató
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Szállítási Információk
                  </a>
                </li>
                <li>
                  <a href="/StaticKapcsolat" className="hover:underline">
                    Kapcsolat
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-600 mt-8 pt-6 text-sm text-center">
            <p>© 2023 MozgoShop. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
