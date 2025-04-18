import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

 
  const fetchOrders = async () => {
    try {
     
      const token = localStorage.getItem('token');
      
      if (!token) {
        
        navigate('/login');
        return;
      }
      
      
      const response = await fetch("http://localhost:3000/api/rendeles/my-orders", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          
          navigate('/login');
          return;
        }
        throw new Error(`Error fetching orders: ${response.status}`);
      }
      
      const data = await response.json();
      
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        
        setOrders([]);
      }
    } catch (error) {
      
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  
  const openCancelConfirmation = (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirmModal(true);
  };

  
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setOrderToCancel(null);
  };

  
  const cancelOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3000/api/rendeles/cancel/${orderToCancel}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(`Error canceling order: ${response.status}`);
      }
      
      
      closeConfirmModal();
      
      
      fetchOrders();
      
    } catch (error) {
      
      setError(error.message);
      closeConfirmModal();
    }
  };

  
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

  
  const getStatusText = (status) => {
    const statusMap = {
      'feldolgozás alatt': 'Feldolgozás alatt',
      'kiszállítás alatt': 'Kiszállítás alatt',
      'kiszállítva': 'Kiszállítva',
      'törölve': 'Törölve'
    };
    return statusMap[status] || status;
  };

  
  const getStatusColor = (status) => {
    const colorMap = {
      'feldolgozás alatt': 'bg-yellow-100 text-yellow-800',
      'kiszállítás alatt': 'bg-blue-100 text-blue-800',
      'kiszállítva': 'bg-green-100 text-green-800',
      'törölve': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  
  const canCancelOrder = (status) => {
    return status === 'feldolgozás alatt';
  };

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
            <li><a href="/" className="hover:text-gray-200">KEZDŐLAP</a></li>
            <li><a href="/info" className="hover:text-gray-200">BEMUTATKOZÁS</a></li>
            <li><a href="/tutorial" className="hover:text-gray-200">RENDELÉS MENETE</a></li>
            <li><a href="/account" className="text-white font-bold border-b-2 border-white">FIÓKOM</a></li>
            <li><a href="/sales" className="hover:text-gray-200">AKCIÓK</a></li>
            <li><a href="/utvonal" className="hover:text-gray-200">TELEPÜLÉSEK</a></li>
            <li><a href="/StaticKapcsolat" className="hover:text-gray-200">KAPCSOLAT</a></li>
          </ul>
        </div>
      </nav>

      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/account')} 
              className="flex items-center text-gray-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Vissza a fiókomhoz</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-auto">Rendeléseim</h1>
          </div>

          {error && (
            <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          {canCancelOrder(order.status) && (
                            <button 
                              onClick={() => openCancelConfirmation(order.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition-colors"
                            >
                              Rendelés törlése
                            </button>
                          )}
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
                            <p className="font-medium">{order.shipping_address}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Fizetési mód</p>
                            <p className="font-medium">
                              {order.payment_method === 'cash' ? 'Készpénz' : order.payment_method}
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
                                            src={`http://localhost:3000${item.product_image}`} 
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Rendelés törlése</h3>
              <button 
                onClick={closeConfirmModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
              </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Biztosan törölni szeretnéd a rendelést? Ez a művelet nem vonható vissza.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Mégsem
              </button>
              <button
                onClick={cancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Törlés megerősítése
              </button>
            </div>
          </div>
        </div>
      )}

     
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
           
            
