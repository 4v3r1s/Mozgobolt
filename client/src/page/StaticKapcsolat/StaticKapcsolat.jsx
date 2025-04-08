import { useEffect, useState } from "react";
import { Button } from "../orderpage/Button";
import { User, ShoppingCart } from "lucide-react";

export default function Contact() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [formData, setFormData] = useState({

    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Animáció indítása késleltetéssel
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  // Form input változások kezelése
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Form beküldés kezelése
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitStatus({ loading: true, success: false, error: null });
      
      const response = await fetch("http://localhost:3000/email/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Hiba történt az üzenet küldése során");
      }
      
      setSubmitStatus({ loading: false, success: true, error: null });
      
      // Form mezők törlése sikeres küldés után
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      
      // Sikeres üzenet eltüntetése 5 másodperc után
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, success: false }));
      }, 5000);
      
    } catch (error) {
      console.error("Kapcsolat űrlap hiba:", error);
      setSubmitStatus({ loading: false, success: false, error: error.message });
    }
  };
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
      {/* Header - animált MozgoShop felirattal */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div> {/* Üres div a bal oldalon az egyensúlyért */}
            <div className="flex items-center justify-center overflow-hidden h-10">
              <a href="/" className="text-white hover:text-gray-200 flex items-center">
                <img 
                  src="/public/vándorbolt.png" 
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
              <a href="/sales" className="hover:text-gray-200">
                AKCIÓK
              </a>
            </li>
            <li>
              <a href="/utvonal" className="hover:text-gray-200">
                TELEPÜLÉSEK
              </a>
            </li>
            <li>
              <a href="/StaticKapcsolat" className="text-white font-bold border-b-2 border-white">
                KAPCSOLAT
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
         
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Lépjen kapcsolatba velünk</h2>
          
          {/* Státusz üzenetek */}
          {submitStatus.success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Köszönjük! Üzenetét sikeresen elküldtük. Hamarosan felvesszük Önnel a kapcsolatot.
            </div>
          )}
          
          {submitStatus.error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              Hiba történt: {submitStatus.error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Név</label>
              <input 
                type="text" 
                id="name" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Teljes név"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="pelda@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">Telefonszám</label>
              <input 
                type="tel" 
                id="phone" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="+36 30 123 4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-gray-700 mb-1">Tárgy</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Üzenet tárgya"
                required
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gray-700 mb-1">Üzenet</label>
              <textarea 
                id="message" 
                rows="4" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Írja le üzenetét..."
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <Button 
              type="submit" 
              className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition-colors"
              disabled={submitStatus.loading}
            >
              {submitStatus.loading ? "Küldés folyamatban..." : "Üzenet küldése"}
            </Button>
          </form>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Elérhetőségeink</h3>
              <p className="text-gray-700">Email: info@vandorbolt.hu</p>
              <p className="text-gray-700">Telefon: +36 1 234 5678</p>
              <p className="text-gray-700">Cím: 1234 Budapest, Példa utca 1.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Nyitvatartás</h3>
              <p className="text-gray-700">Hétfő - Péntek: 8:00 - 17:00</p>
              <p className="text-gray-700">Szombat: 9:00 - 13:00</p>
              <p className="text-gray-700">Vasárnap: Zárva</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gyakran Ismételt Kérdések</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Hogyan követhetem a rendelésemet?</h3>
              <p className="text-gray-700">A rendelés visszaigazoló emailben található követési számmal nyomon követheti csomagja útját.</p>
            </div>
            
            <div>              
              <h3 className="text-lg font-semibold">Mennyi a szállítási idő?</h3>
              <p className="text-gray-700">A szállítási idő általában 2-3 munkanap, de ez függ a célállomástól és a rendelés időpontjától.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Van lehetőség személyes átvételre?</h3>
              <p className="text-gray-700">Igen, a megadott településeken lehetőség van személyes átvételre előre egyeztetett időpontban.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
                <p>Email: info@vandorbolt.hu</p>
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
            <p>© 2023 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
