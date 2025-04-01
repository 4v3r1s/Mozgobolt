import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoAnimated, setLogoAnimated] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "error", // success or error
  });

  // Animáció indítása késleltetéssel
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const showAlert = (message, type = "error") => {
    setAlert({
      show: true,
      message,
      type,
    });

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

 
    const fetchOrders = async () => {
        try {
          // Get token from localStorage
          const token = localStorage.getItem('token');
          console.log("Tárolt token:", token ? "Van token" : "Nincs token");
      
          if (!token) {
            navigate('/login');
            return;
          }
      
          // Próbáljuk dekódolni a tokent (csak debug célokra)
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            console.log("Token payload:", payload);
            console.log("User ID from token:", payload.userId);
          } catch (e) {
            console.error("Hiba a token dekódolásakor:", e);
          }
      
          console.log("Rendelések lekérése...");
          
          // Használjuk a nem-prefixelt útvonalat
          const response = await fetch("http://localhost:3000/rendeles/my-orders", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
      
          console.log("Válasz státusz:", response.status);
      
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Hiba a válaszban:", errorText);
            
            if (response.status === 401) {
              // Token expired or invalid
              navigate('/login');
              return;
            }
            throw new Error(`Hiba a rendelések lekérése során: ${response.status} ${errorText}`);
          }
      
          const data = await response.json();
          console.log("Betöltött rendelések:", data);
          
          // Ellenőrizzük, hogy a data egy tömb-e
          if (Array.isArray(data)) {
            setOrders(data);
            console.log(`${data.length} rendelés betöltve`);
          } else {
            console.error("A válasz nem tömb formátumú:", data);
            setOrders([]);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          showAlert("Hiba történt a rendelések betöltése során: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchOrders();
      }, [navigate]);

  // Rendelés állapot fordítása
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Függőben',
      'processing': 'Feldolgozás alatt',
      'shipped': 'Kiszállítva',
      'delivered': 'Kézbesítve',
      'cancelled': 'Törölve'
    };
    return statusMap[status] || status;
  };

  // Dátum formázása
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center overflow-hidden h-10">
            <a href="/" className="text-white hover:text-gray-200 flex items-center">
              <img 
                src="/public/logo2.png" 
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
              <a href="/Tutorial" className="hover:text-gray-200">
                RENDELÉS MENETE
              </a>
            </li>
            <li>
              <a href="/account" className="text-white font-bold border-b-2 border-white">
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-700 text-white py-4 px-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Rendeléseim</h1>
              <button 
                onClick={() => navigate('/account')}
                className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-900 transition-colors text-sm"
              >
                Vissza a fiókhoz
              </button>
            </div>

            {alert.show && (
              <div
                className={`p-4 mb-4 mx-6 mt-6 rounded-md ${
                  alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                } flex justify-between items-center`}
              >
                <p>{alert.message}</p>
                <button
                  onClick={() => setAlert((prev) => ({ ...prev, show: false }))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Rendelések betöltése...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Még nincsenek rendeléseid.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
                  >
                    Vásárlás indítása
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-500">Rendelés azonosító:</span>
                          <span className="ml-2 font-medium">{order.id}</span>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Rendelés dátuma</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Összeg</p>
                            <p className="font-medium">{order.total_price} Ft</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Szállítási cím</p>
                            <p className="font-medium">
                              {order.shipping_address || 'Nincs megadva'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Fizetési mód</p>
                            <p className="font-medium">
                              {order.payment_method === 'cash' ? 'Készpénz' : 
                               order.payment_method === 'card' ? 'Bankkártya' : 
                               order.payment_method || 'Nincs megadva'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h3 className="font-medium text-gray-900 mb-2">Rendelt termékek</h3>
                          <div className="border rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Termék
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mennyiség
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ár
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.items && order.items.map((item, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        {item.product_image && (
                                          <img 
                                            src={item.product_image} 
                                            alt={item.product_name} 
                                            className="h-10 w-10 object-cover mr-3"
                                          />
                                        )}
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {item.product_name}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {item.quantity} db
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                      {item.price} Ft
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => navigate(`/order-details/${order.id}`)}
                            className="text-red-700 hover:text-red-800 text-sm font-medium"
                          >
                            Részletek megtekintése
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
