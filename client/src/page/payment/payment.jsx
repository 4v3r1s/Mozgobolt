import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../orderpage/Button";

export default function Payment() {
  const navigate = useNavigate();
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  
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
        console.log("Betöltött kosár:", savedCart);
        const savedDiscount = localStorage.getItem('cartDiscount');
        if (savedDiscount) {
          const discountData = JSON.parse(savedDiscount);
          if (discountData.applied) {
            setCouponApplied(true);
            setDiscount(discountData.percent);
          }
        }
        if (savedCart && savedCart !== "undefined" && savedCart !== "null") {
          const parsedCart = JSON.parse(savedCart);
          console.log("Feldolgozott kosár:", parsedCart);
          
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          } else {
            console.error("A kosár nem tömb formátumú:", parsedCart);
            setCartItems([]);
          }
        } else {
          console.log("Nincs kosár vagy érvénytelen formátum");
          setCartItems([]);
          
          navigate('/cart');
        }
      } catch (error) {
        console.error("Hiba a kosár betöltésekor:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("No user logged in");
          return;
        }
        
        
        const response = await fetch('http://localhost:3000/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load user data');
        }
        
        const userData = await response.json();
        console.log("Loaded user data:", userData);
        
        
        setFormData({
          firstName: userData.keresztnev || '',
          lastName: userData.vezeteknev || '',
          email: userData.email || '',
          phone: userData.telefonszam || '',
          address: userData.szallitasi_kozterulet && userData.szallitasi_hazszam ? 
                  `${userData.szallitasi_kozterulet} ${userData.szallitasi_hazszam}` : '',
          city: userData.szallitasi_telepules || '',
          zipCode: userData.szallitasi_irsz ? userData.szallitasi_irsz.toString() : '',
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };


  const validateForm = () => {
    const newErrors = {};
    

    if (!formData.firstName.trim()) newErrors.firstName = "Kötelező mező";
    if (!formData.lastName.trim()) newErrors.lastName = "Kötelező mező";
    if (!formData.email.trim()) {
      newErrors.email = "Kötelező mező";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen email cím";
    }
    if (!formData.phone.trim()) newErrors.phone = "Kötelező mező";
    if (!formData.address.trim()) newErrors.address = "Kötelező mező";
    if (!formData.city.trim()) newErrors.city = "Kötelező mező";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Kötelező mező";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
 
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setProcessingOrder(true);
    
    try {

      const orderData = {
        vevoAdatok: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        szallitasiAdatok: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        fizetesiMod: paymentMethod,
        osszegek: {
          subtotal: calculateSubtotal(),
          shipping: shipping,
          discount: discount, 
          total: total 
        },
        tetelek: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          discountPrice: item.discountPrice || null
        }))
      };
      
    
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      
      const response = await fetch('http://localhost:3000/api/rendeles', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba történt a rendelés feldolgozása során');
      }
      
      const responseData = await response.json();
      console.log("Rendelés sikeresen létrehozva:", responseData);
      
   
      setOrderPlaced(true);
      
      if (responseData) {
        setOrderPlaced(true);
        
       
        localStorage.removeItem('cart');
        localStorage.removeItem('cartDiscount');
        
        
        window.dispatchEvent(new Event('cartUpdated'));
      }

      localStorage.removeItem('cart');
      

      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error("Hiba a rendelés feldolgozásakor:", error);
      alert("Hiba történt a rendelés feldolgozása során: " + error.message);
    } finally {
      setProcessingOrder(false);
    }
  };


  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discountPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const discountAmount = discount > 0 ? (subtotal * discount / 100) : 0;
  const shipping = subtotal > 10000 ? 0 : 990;
  const total = subtotal - discountAmount + shipping;


  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <header className="bg-red-700 text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center overflow-hidden h-10">
              <a href="/" className="text-white hover:text-gray-200 flex items-center">
                <img 
                  src="/public/vándorbolt.png" 
                  alt="VándorBolt Logo" 
                  className="h-16 -my-3 mr-3"
                />
                <h1 className="text-2xl font-bold">Vándorbolt</h1>
              </a>
            </div>
          </div>
        </header>

        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Köszönjük a rendelését!</h1>
            <p className="text-gray-600 mb-6">
              A rendelését sikeresen rögzítettük. A visszaigazolást elküldtük a megadott e-mail címre.
            </p>
            <div className="mb-8 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500 mb-2">Rendelési azonosító:</p>
              <p className="text-lg font-medium">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="bg-red-700 text-white py-3 px-6 rounded-md hover:bg-red-800 transition-colors"
            >
              Vissza a főoldalra
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
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

      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/cart')} 
              className="flex items-center text-gray-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Vissza a kosárhoz</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-auto">Fizetés</h1>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Adatok betöltése...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">A kosara üres</h2>
              <p className="text-gray-500 mb-6">Nem tud fizetni, mert nincs termék a kosárban.</p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-red-700 text-white py-2 px-6 rounded-md hover:bg-red-800 transition-colors"
              >
                Vásárlás folytatása
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmitOrder}>
                  
                  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="p-4 bg-gray-50 border-b flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-gray-600" />
                      <h2 className="font-semibold text-gray-700">Szállítási adatok</h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            Keresztnév *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1 error-message">{errors.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Vezetéknév *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                            />
                            {errors.lastName && (
                              <p className="text-red-500 text-xs mt-1 error-message">{errors.lastName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              E-mail cím *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                            />
                            {errors.email && (
                              <p className="text-red-500 text-xs mt-1 error-message">{errors.email}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Telefonszám *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                            />
                            {errors.phone && (
                              <p className="text-red-500 text-xs mt-1 error-message">{errors.phone}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Cím *
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                            placeholder="Utca, házszám, emelet, ajtó"
                          />
                          {errors.address && (
                            <p className="text-red-500 text-xs mt-1 error-message">{errors.address}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                              Város *
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                            />
                            {errors.city && (
                              <p className="text-red-500 text-xs mt-1 error-message">{errors.city}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                              Irányítószám *
                            </label>
                            <input
                              type="text"
                              id="zipCode"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className={`w-full border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                            />
                            {errors.zipCode && (
                              <p className="text-red-500 text-xs mt-1 error-message">{errors.zipCode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                      <div className="p-4 bg-gray-50 border-b">
                        <h2 className="font-semibold text-gray-700">Fizetési mód</h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="border rounded-md p-4 border-red-500 bg-red-50">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="cash"
                              name="paymentMethod"
                              checked={true}
                              className="h-4 w-4 text-red-600 focus:ring-red-500"
                              readOnly
                            />
                            <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                              Fizetés átvételkor a futárnak (készpénzes vagy bankkártya)
                            </label>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 ml-7">
                            A rendelés átvételekor fizet készpénzzel agy bankkártyával a futárnak.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    
                    <div className="mt-6 lg:hidden">
                      <Button 
                        type="submit"
                        className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition-colors disabled:bg-gray-400"
                        disabled={processingOrder}
                      >
                        {processingOrder ? "Feldolgozás..." : "Rendelés elküldése"}
                      </Button>
                    </div>
                  </form>
                </div>
                
                
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-semibold text-gray-700">Rendelés összegzése</h2>
                      <button 
                        onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                        className="text-sm text-red-700 hover:text-red-800 lg:hidden"
                      >
                        {orderSummaryOpen ? "Bezárás" : "Részletek"}
                      </button>
                    </div>
                    
                    <div className={`space-y-3 ${orderSummaryOpen ? 'block' : 'hidden lg:block'}`}>
                      
                      <div className="max-h-60 overflow-y-auto mb-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-start py-2 border-b border-gray-200 last:border-0">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 ml-3">
                              <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                              <p className="text-xs text-gray-500">{item.quantity} × {item.discountPrice || item.price} Ft</p>
                            </div>
                            
                            <div className="ml-2 text-sm font-medium text-gray-700">
                              {((item.discountPrice || item.price) * item.quantity).toLocaleString()} Ft
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Részösszeg</span>
                            <span>{subtotal.toLocaleString()} Ft</span>
                          </div>
                          
                          
                          {couponApplied && discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Kupon kedvezmény ({discount}%)</span>
                              <span>-{(subtotal * discount / 100).toLocaleString()} Ft</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-sm text-gray-600">
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

                    </div>
                    
                    
                    <div className="mt-6 hidden lg:block">
                      <Button 
                        onClick={handleSubmitOrder}
                        className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition-colors disabled:bg-gray-400"
                        disabled={processingOrder}
                      >
                        {processingOrder ? "Feldolgozás..." : "Rendelés elküldése"}
                      </Button>
                      <p className="text-xs text-center text-gray-500 mt-2">
                        A "Rendelés elküldése" gombra kattintva elfogadja az Általános Szerződési Feltételeket.
                      </p>
                    </div>
                  </div>
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
  
