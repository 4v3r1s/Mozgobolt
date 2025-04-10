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
  const [cartItemCount, setCartItemCount] = useState(0); 

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); 
    
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
   
    updateCartCount();
    
    
    window.addEventListener('storage', updateCartCount);
    
   
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalItems);
      } catch (error) {
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  };

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
       
        const response = await fetch("http://localhost:3000/termek");
        
        if (!response.ok) {
          throw new Error(`Nem sikerült lekérni a termékeket: ${response.status} ${response.statusText}`);
        }
        
        const allProducts = await response.json();
        
        
        const currentDate = new Date();
       
        const currentDateString = currentDate.toISOString().split('T')[0];
        
       
        const discountedProducts = allProducts.filter(product => 
          product.akciosar !== null && 
          product.akciosar !== undefined && 
          parseFloat(product.akciosar) > 0 &&
          product.akcio_eleje && 
          product.akcio_vege &&
          product.akcio_eleje <= currentDateString &&
          product.akcio_vege >= currentDateString
        );
        
        setProducts(discountedProducts || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

 
  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!originalPrice || !discountPrice) return 0;
    const original = parseFloat(originalPrice);
    const discount = parseFloat(discountPrice);
    if (isNaN(original) || isNaN(discount) || original <= 0) return 0;
    return Math.round(((original - discount) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <header className="bg-red-700 text-white">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <div className="flex-1"></div> 
      <div className="flex items-center justify-center overflow-hidden h-10">
        <a href="/" className="text-white hover:text-gray-200 flex items-center">
          <img 
            src="/public/vándorbolt.png" 
            alt="VándorBolt Logo" 
            className={`h-16 -my-3 mr-3 transition-all duration-1000 ease-in-out transform ${
              logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
          />
          <h1 
            className={`text-2xl font-bold transition-all duration-1000 ease-in-out transform ${
              logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
          >
            Vándorbolt
          </h1>
        </a>
      </div>
      
      <div className="flex items-center space-x-3 flex-1 justify-end">
        <a href="/account" className="text-white hover:bg-red-600 p-2 rounded-full inline-flex items-center justify-center">
          <User className="h-5 w-5" />
        </a>
        <a href="/cart" className="text-white hover:bg-red-600 p-2 rounded-full inline-flex items-center justify-center relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-700 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </a>
      </div>
    </div>
  </div>
</header>
     
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
                {products.map((product) => {
                  // Számoljuk ki a kedvezmény százalékát
                  const discount = calculateDiscount(product.ar, product.akciosar);
                  
                  return (
                    <ProductCard 
                      key={product.azonosito} 
                      product={{
                        id: product.azonosito,
                        name: product.nev,
                        price: parseFloat(product.ar),
                        discountPrice: parseFloat(product.akciosar),
                        discount: discount,
                        description: product.termekleiras,
                        image: product.hivatkozas,
                        kepUrl: product.kepUrl,
                        category: product.csoport,
                        stock: product.keszlet,
                        unit: product.kiszereles,
                        unitPrice: parseFloat(product.egysegnyiar),
                        discountUnitPrice: product.akcios_egysegnyiar ? parseFloat(product.akcios_egysegnyiar) : null,
                        akcio_eleje: product.akcio_eleje,
                        akcio_vege: product.akcio_vege
                      }} 
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

     
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">VándorBolt</h3>
              <p className="text-sm">Minőségi élelmiszerek széles választéka, gyors kiszállítással az Ön otthonába.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kapcsolat</h3>
              <address className="not-italic text-sm">
                <p>1234 Budapest, Példa utca 123.</p>
                <p>Email: info.vandorboltwebaruhaz@gmail.com</p>
                <p>Telefon: +36 1 234 5678</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Információk</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/aszf" className="hover:underline">
                    Általános Szerződési Feltételek
                  </a>
                </li>
                <li>
                  <a href="/adatvedelem" className="hover:underline">
                    Adatvédelmi Tájékoztató
                  </a>
                </li>
                <li>
                  <a href="/utvonal" className="hover:underline">
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
            <p>© 2025 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
