import { useState, useEffect } from "react";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({});
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [viewingOrderId, setViewingOrderId] = useState(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); 
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch("http://localhost:3000/rendeles", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a rendeléseket");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      
      setError("Nem sikerült betölteni a rendeléseket: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setViewingOrderId(orderId);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch(`http://localhost:3000/rendeles/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a rendelés részleteit");
      }

      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      
      alert("Hiba a rendelés részleteinek betöltése során: " + error.message);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order.azonosito);
    setFormData({ ...order });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const dataToSend = { 
        allapot: formData.allapot 
      };
      
      const response = await fetch(`http://localhost:3000/rendeles/${editingOrder}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Hiba a rendelés frissítése során");
      }

     
      fetchOrders();
      setEditingOrder(null);
      alert("Rendelés sikeresen frissítve!");
    } catch (error) {
      
      alert("Hiba a rendelés frissítése során: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törölni szeretné ezt a rendelést?")) {
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch(`http://localhost:3000/rendeles/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a rendelés törlése során");
      }

      
      fetchOrders();
      alert("Rendelés sikeresen törölve!");
    } catch (error) {
      
      alert("Hiba a rendelés törlése során: " + error.message);
    }
  };

  
  const formatOrderStatus = (status) => {
    switch (status) {
      case "feldolgozás alatt":
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Feldolgozás alatt</span>;
      case "kiszállítás alatt":
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Kiszállítás alatt</span>;
      case "teljesítve":
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Teljesítve</span>;
      case "törölve":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Törölve</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-700">Rendelések betöltése...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Rendelések kezelése</h2>
            </div>

            
            {orderDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                  <div className="bg-red-700 text-white py-3 px-6 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Rendelés részletei - {orderDetails.rendelesAzonosito}</h3>
                    <button 
                      onClick={() => {
                        setOrderDetails(null);
                        setViewingOrderId(null);
                      }}
                      className="text-white hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Rendelés információk</h4>
                        <p className="text-sm"><span className="font-medium">Azonosító:</span> {orderDetails.rendelesAzonosito}</p>
                        <p className="text-sm"><span className="font-medium">Dátum:</span> {formatDate(orderDetails.rendelesIdeje)}</p>
                        <p className="text-sm"><span className="font-medium">Állapot:</span> {formatOrderStatus(orderDetails.allapot)}</p>
                        <p className="text-sm"><span className="font-medium">Fizetési mód:</span> {orderDetails.fizetesiMod}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Vevő adatok</h4>
                        <p className="text-sm"><span className="font-medium">Név:</span> {orderDetails.vevoNev}</p>
                        <p className="text-sm"><span className="font-medium">Email:</span> {orderDetails.vevoEmail}</p>
                        <p className="text-sm"><span className="font-medium">Telefon:</span> {orderDetails.vevoTelefon}</p>
                        <p className="text-sm"><span className="font-medium">Szállítási cím:</span> {orderDetails.szallitasiIrsz} {orderDetails.szallitasiVaros}, {orderDetails.szallitasiCim}</p>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Rendelési tételek</h4>
                    {orderDetails.tetelek && orderDetails.tetelek.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Termék</th>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mennyiség</th>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Egységár</th>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Összesen</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orderDetails.tetelek.map((tetel) => (
                              <tr key={tetel.azonosito} className="hover:bg-gray-50">
                                <td className="py-2 px-4 text-sm">
                                  <div className="flex items-center">
                                    {tetel.Termek && tetel.Termek.kepUrl ? (
                                      <img 
                                        src={`http://localhost:3000${tetel.Termek.kepUrl}`} 
                                        alt={tetel.termekNev} 
                                        className="h-10 w-10 object-cover rounded-md mr-3"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "/placeholder.png"; 
                                        }}
                                      />
                                    ) : (
                                      <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                                        <span className="text-xs text-gray-500">Nincs kép</span>
                                      </div>
                                    )}
                                    <span>{tetel.termekNev}</span>
                                  </div>
                                </td>
                                <td className="py-2 px-4 text-sm">{tetel.mennyiseg} db</td>
                                <td className="py-2 px-4 text-sm">{tetel.egysegAr} Ft</td>
                                <td className="py-2 px-4 text-sm">{tetel.osszAr} Ft</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan="3" className="py-2 px-4 text-right font-medium">Részösszeg:</td>
                              <td className="py-2 px-4">{orderDetails.osszeg} Ft</td>
                            </tr>
                            <tr>
                              <td colSpan="3" className="py-2 px-4 text-right font-medium">Szállítási díj:</td>
                              <td className="py-2 px-4">{orderDetails.szallitasiDij} Ft</td>
                            </tr>
                            {orderDetails.kedvezmeny > 0 && (
                              <tr>
                                <td colSpan="3" className="py-2 px-4 text-right font-medium">Kedvezmény:</td>
                                <td className="py-2 px-4">-{orderDetails.kedvezmeny} Ft</td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan="3" className="py-2 px-4 text-right font-medium">Végösszeg:</td>
                              <td className="py-2 px-4 font-bold">{orderDetails.vegosszeg} Ft</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">Nincsenek tételek a rendelésben.</p>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setOrderDetails(null);
                          setViewingOrderId(null);
                        }}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                      >
                        Bezárás
                      </button>
                      <button
                        onClick={() => {
                          setOrderDetails(null);
                          handleEdit(orderDetails);
                        }}
                        className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
                      >
                        Állapot módosítása
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azonosító</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dátum</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vevő</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Összeg</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fizetési mód</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Állapot</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.azonosito} className="hover:bg-gray-50">
                      {editingOrder === order.azonosito ? (
                        <td colSpan="7" className="py-4 px-6 border-b">
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Rendelés állapotának módosítása</h4>
                                <p className="text-sm mb-4">Rendelés azonosító: <strong>{order.rendelesAzonosito}</strong></p>
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-1">Állapot</label>
                                <select
                                  name="allapot"
                                  value={formData.allapot || "feldolgozás alatt"}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                  <option value="feldolgozás alatt">Feldolgozás alatt</option>
                                  <option value="kiszállítás alatt">Kiszállítás alatt</option>
                                  <option value="teljesítve">Teljesítve</option>
                                  <option value="törölve">Törölve</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="submit"
                                className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
                              >
                                Mentés
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingOrder(null)}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                              >
                                Mégse
                              </button>
                            </div>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="py-3 px-4 text-sm text-gray-700">{order.rendelesAzonosito}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{formatDate(order.rendelesIdeje)}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{order.vevoNev}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{order.vegosszeg} Ft</td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {order.fizetesiMod === 'cash' ? 'Készpénz' : 
                             order.fizetesiMod === 'card' ? 'Bankkártya' : 
                             order.fizetesiMod}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {formatOrderStatus(order.allapot)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => fetchOrderDetails(order.azonosito)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Részletek
                              </button>
                              <button
                                onClick={() => handleEdit(order)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Állapot
                              </button>
                              <button
                                onClick={() => handleDelete(order.azonosito)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                Törlés
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

