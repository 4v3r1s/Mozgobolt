import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "../orderpage/Button";

export default function Cart() {
  const navigate = useNavigate();
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        
        if (savedCart && savedCart !== "undefined" && savedCart !== "null") {
          const parsedCart = JSON.parse(savedCart);
          
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          } else {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      } catch (error) {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
    
    
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);
    
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  
  const increaseQuantity = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  
  const decreaseQuantity = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id && item.quantity <= 1) {
          return null;
        }
        return item.id === id ? { ...item, quantity: item.quantity - 1 } : item;
      }).filter(Boolean);
      
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

 
  const removeItem = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "mozgo10") {
      setCouponApplied(true);
      setDiscount(10); // 
      
      
      localStorage.setItem('cartDiscount', JSON.stringify({
        applied: true,
        percent: 10,
        code: couponCode
      }));
    } else {
      alert("Érvénytelen kuponkód!");
    }
  };

  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discountPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = couponApplied ? (subtotal * discount / 100) : 0;
  const shipping = subtotal > 10000 ? 0 : 990; 
  const total = subtotal - discountAmount + shipping;

  
  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
    alert("Kosár törölve!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - animált VándorBolt felirattal és logóval */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
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
              <a href="/StaticKapcsolat" className="hover:text-gray-200">
                KAPCSOLAT
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Vissza a vásárláshoz</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-auto">Kosár</h1>
            
            {/* Debug gomb - csak fejlesztéshez */}
            <button 
              onClick={clearCart}
              className="ml-4 text-xs text-gray-500 hover:text-red-700"
            >
              Kosár törlése (debug)
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Kosár betöltése...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">A kosara üres</h2>
              <p className="text-gray-500 mb-6">Még nem adott hozzá termékeket a kosarához.</p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-red-700 text-white py-2 px-6 rounded-md hover:bg-red-800 transition-colors"
              >
                Vásárlás folytatása
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Kosár tartalma */}
              <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h2 className="font-semibold text-gray-700">Kosár tartalma ({cartItems.length} termék)</h2>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 ml-0 sm:ml-4 mt-3 sm:mt-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="mt-1 flex items-end justify-between">
                            <div>
                              {item.discountPrice ? (
                                <div className="flex items-center">
                                  <span className="text-red-600 font-medium">{item.discountPrice} Ft</span>
                                  <span className="ml-2 text-sm text-gray-500 line-through">{item.price} Ft</span>
                                </div>
                              ) : (
                                <span className="text-gray-700 font-medium">{item.price} Ft</span>
                              )}
                              <p className="text-sm text-gray-500 mt-1">Egységár: {item.price} Ft/{item.unit}</p>
                            </div>
                            
                            <div className="flex items-center border rounded-md">
                              <button 
                                onClick={() => decreaseQuantity(item.id)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                              <button 
                                onClick={() => increaseQuantity(item.id)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Összegzés */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="font-semibold text-gray-700 mb-4">Rendelés összegzése</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Részösszeg</span>
                      <span>{subtotal.toLocaleString()} Ft</span>
                    </div>
                    
                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Kupon kedvezmény ({discount}%)</span>
                        <span>-{discountAmount.toLocaleString()} Ft</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Szállítási díj</span>
                      <span>{shipping === 0 ? "Ingyenes" : `${shipping.toLocaleString()} Ft`}</span>
                    </div>
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Összesen</span>
                        <span>{total.toLocaleString()} Ft</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Az ár tartalmazza az ÁFÁ-t</p>
                    </div>
                  </div>
                  
                {/* Kuponkód */}
<div className="mt-6">
  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
    Kuponkód
  </label>
  <div className="relative">
    <input
      type="text"
      id="coupon"
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-16"
      placeholder="Kuponkód megadása"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      disabled={couponApplied}
    />
    <button
      type="button"
      onClick={applyCoupon}
      disabled={couponApplied || !couponCode}
      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-700 text-white px-2 py-1 text-xs rounded-md hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
    >
      Beváltás
    </button>
  </div>
  {couponApplied && (
    <p className="text-sm text-green-600 mt-1">
      A kupon sikeresen alkalmazva! ({discount}% kedvezmény)
    </p>
  )}
</div>


                
<div className="mt-6">
  <Button 
    onClick={() => {
      navigate('/payment');
    }}
    className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition-colors"
  >
    Tovább 
  </Button>
  <p className="text-xs text-center text-gray-500 mt-2">
    A "Tovább a pénztárhoz" gombra kattintva elfogadja az Általános Szerződési Feltételeket.
  </p>
</div>
                </div>
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

