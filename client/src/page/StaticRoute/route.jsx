import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";

export default function Towns() {
  const [towns1, setTowns1] = useState([]);
  const [towns2, setTowns2] = useState([]);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    
    setTowns1(["Zalaszentmárton", "Zalaszentmihály", "Zalaigrice", "Alsórajk", "Kerecseny", "Orosztony", "Zalaszabar", "Esztergályhorváti", "Bókaháza", "Szentgyörgyvár", "Alsópáhok"]);
    
    setTowns2(["Kallósd", "Kehidakustány", "Zalaszentlászló", "Zalaszentgrót-Zalakoppány", "Zalavég", "Kisgörbő", "Vindornyafok", "Karmacs"]);
    
  
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
        console.error("Hiba a kosár betöltésekor:", error);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
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
              <a href="/sales" className="hover:text-gray-200">
                AKCIÓK
              </a>
            </li>
            <li>
              <a href="/utvonal" className="text-white font-bold border-b-2 border-white">
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


      <div className="container mx-auto text-center py-6">
        <h1 className="text-2xl font-bold">Települések</h1>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <div className="flex justify-center">
            <img 
              src="ut1.png" 
              alt="Town 1" 
              className="rounded-lg shadow-lg w-3/4 border-4 border-white" 
            />
          </div>
          <div className="flex justify-center">
            <img 
              src="ut2.png" 
              alt="Town 2" 
              className="rounded-lg shadow-lg w-3/4 border-4 border-white" 
            />
          </div>
        </div>

        
        <div className="bg-red-100 p-4 rounded-lg shadow-md mb-8 text-center">
          <p className="text-lg font-medium text-red-800">
           A mozgóbolt 8:00-kor érkezik az első faluba, 12:00-kor éri el az utolsó települést.
           Kiszállítás ebben az időintervallumban várható.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Útvonalak - 1. körzet</h2>
            <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {towns1.map((town, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-lg text-center font-medium text-gray-800">
                  {town}
                </li>
              ))}
            </ul>
          </div>
          
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Útvonalak - 2. körzet</h2>
            <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {towns2.map((town, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-lg text-center font-medium text-gray-800">
                  {town}
                </li>
              ))}
            </ul>
          </div>
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
