import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import OrderTable from "./OrderTable";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    newsletterSubscribers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    productsOnSale: 0,
    totalOrders: 0,
    pendingOrders: 0,
    shippingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animáció indítása késleltetéssel
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  // Check if user is admin
  const checkAdminAuth = async () => {
    // Get token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      navigate('/login');
      return false;
    }
    
    try {
      // Ellenőrizzük, hogy a felhasználó admin-e
      const response = await fetch("http://localhost:3000/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Nem sikerült lekérni a felhasználói adatokat");
      }
      
      const userData = await response.json();
      
      if (userData.szerep !== "admin") {
        navigate('/');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Hiba a jogosultság ellenőrzése során:", error);
      navigate('/login');
      return false;
    }
  };

  // Statisztikák lekérése
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Admin jogosultság ellenőrzése
      const isAdmin = await checkAdminAuth();
      if (!isAdmin) return;
      
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      // Felhasználói statisztikák lekérése
      const usersResponse = await fetch("http://localhost:3000/user/all", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!usersResponse.ok) {
        throw new Error("Nem sikerült betölteni a felhasználói adatokat");
      }

      const usersData = await usersResponse.json();
      
      // Termék statisztikák lekérése
      const productsResponse = await fetch("http://localhost:3000/termek", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!productsResponse.ok) {
        throw new Error("Nem sikerült betölteni a termék adatokat");
      }

      const productsData = await productsResponse.json();
      
      // Rendelés statisztikák lekérése
      const ordersResponse = await fetch("http://localhost:3000/rendeles/stats", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!ordersResponse.ok) {
        throw new Error("Nem sikerült betölteni a rendelés statisztikákat");
      }

      const ordersData = await ordersResponse.json();
      
      // Statisztikák kiszámítása
      const adminUsers = usersData.filter(user => user.szerep === "admin").length;
      const newsletterSubscribers = usersData.filter(user => user.hirlevel).length;
      const lowStockProducts = productsData.filter(product => product.keszlet < 10).length;
      const productsOnSale = productsData.filter(product => 
        product.akciosar && product.akciosar > 0 && 
        new Date(product.akcio_vege) > new Date()
      ).length;
      
      // Statisztikák beállítása
      setStats({
        totalUsers: usersData.length,
        adminUsers,
        regularUsers: usersData.length - adminUsers,
        newsletterSubscribers,
        totalProducts: productsData.length,
        lowStockProducts,
        productsOnSale,
        totalOrders: ordersData.totalOrders,
        pendingOrders: ordersData.pendingOrders,
        shippingOrders: ordersData.shippingOrders,
        completedOrders: ordersData.completedOrders,
        cancelledOrders: ordersData.cancelledOrders,
        totalRevenue: ordersData.totalRevenue,
        recentOrders: ordersData.recentOrders || []
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Hiba a statisztikák lekérése során:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Komponens betöltésekor lekérjük a statisztikákat
  useEffect(() => {
    fetchStats();
  }, []);

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

  // Rendelés állapot formázása
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

  // Pénzösszeg formázása
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(amount);
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
                MozgoShop Admin
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
              <a href="/account" className="hover:text-gray-200">
                FIÓKOM
              </a>
            </li>
            <li>
              <a href="/admin/dashboard" className="text-white font-bold border-b-2 border-white">
                ADMIN FELÜLET
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-700">Statisztikák betöltése...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-700 text-white py-4 px-6">
              <h1 className="text-2xl font-bold">Admin Vezérlőpult</h1>
            </div>

            {/* Admin Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "dashboard"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Vezérlőpult
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "users"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Felhasználók
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "products"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Termékek
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "orders"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Rendelések
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "categories"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Kategóriák
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  {/* Statisztikai kártyák */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Felhasználói statisztikák */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Összes felhasználó</p>
                          <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Admin: {stats.adminUsers}</span>
                          <span className="text-gray-500">Felhasználó: {stats.regularUsers}</span>
                        </div>
                        <div className="mt-1 bg-gray-200 h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(stats.adminUsers / stats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Termék statisztikák */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Összes termék</p>
                          <p className="text-2xl font-bold">{stats.totalProducts}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Akciós: {stats.productsOnSale}</span>
                          <span className="text-gray-500">Alacsony készlet: {stats.lowStockProducts}</span>
                        </div>
                        <div className="mt-1 bg-gray-200 h-2 rounded-full">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${(stats.productsOnSale / stats.totalProducts) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Rendelés statisztikák */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Összes rendelés</p>
                          <p className="text-2xl font-bold">{stats.totalOrders}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Feldolgozás alatt: {stats.pendingOrders}</span>
                          <span className="text-gray-500">Kiszállítás alatt: {stats.shippingOrders}</span>
                        </div>
                        <div className="mt-1 bg-gray-200 h-2 rounded-full">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${((stats.pendingOrders + stats.shippingOrders) / stats.totalOrders) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Bevétel statisztikák */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Összes bevétel</p>
                          <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Teljesített rendelések: {stats.completedOrders}</span>
                          <span className="text-gray-500">Törölt: {stats.cancelledOrders}</span>
                        </div>
                        <div className="mt-1 bg-gray-200 h-2 rounded-full">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(stats.completedOrders / stats.totalOrders) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legutóbbi rendelések */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-800">Legutóbbi rendelések</h2>
                    </div>
                    <div className="p-6">
                      {stats.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Rendelés azonosító
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Vevő
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Dátum
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Összeg
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Állapot
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Művelet
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {stats.recentOrders.map((order) => (
                                <tr key={order.azonosito}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.rendelesAzonosito}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.vevoNev}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.rendelesIdeje)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatCurrency(order.vegosszeg)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatOrderStatus(order.allapot)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href={`/admin/orders?id=${order.azonosito}`} className="text-purple-600 hover:text-purple-900">
                                      Részletek
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">Nincsenek rendelések.</p>
                      )}
                      <div className="mt-4 text-right">
                        <a 
                          href="/admin/orders" 
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                        >
                          Összes rendelés megtekintése
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Gyors műveletek */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-800">Gyors műveletek</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <a 
                        href="/admin/users" 
                        className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Felhasználók kezelése</h3>
                          <p className="text-sm text-gray-500">Felhasználók szerkesztése, törlése</p>
                        </div>
                      </a>
                      <a 
                        href="/admin/products" 
                        className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        <div className="p-2 rounded-full bg-yellow-100 text-yellow-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Termékek kezelése</h3>
                          <p className="text-sm text-gray-500">Termékek hozzáadása, szerkesztése</p>
                        </div>
                      </a>
                      <a 
                        href="/admin/orders" 
                        className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <div className="p-2 rounded-full bg-purple-100 text-purple-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Rendelések kezelése</h3>
                          <p className="text-sm text-gray-500">Rendelések nyomon követése</p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Rendelés állapot összefoglaló */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-800">Rendelések állapota</h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-yellow-100 text-yellow-500 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-yellow-700">Feldolgozás alatt</p>
                              <p className="text-xl font-bold text-yellow-800">{stats.pendingOrders}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-blue-700">Kiszállítás alatt</p>
                              <p className="text-xl font-bold text-blue-800">{stats.shippingOrders}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-green-100 text-green-500 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-green-700">Teljesítve</p>
                              <p className="text-xl font-bold text-green-800">{stats.completedOrders}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-red-100 text-red-500 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-red-700">Törölve</p>
                              <p className="text-xl font-bold text-red-800">{stats.cancelledOrders}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Rendelés állapot grafikon */}
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Rendelések megoszlása</h3>
                        <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                          {stats.totalOrders > 0 && (
                            <>
                              <div 
                                className="h-4 bg-yellow-500 float-left" 
                                style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                                title={`Feldolgozás alatt: ${stats.pendingOrders}`}
                              ></div>
                              <div 
                                className="h-4 bg-blue-500 float-left" 
                                style={{ width: `${(stats.shippingOrders / stats.totalOrders) * 100}%` }}
                                title={`Kiszállítás alatt: ${stats.shippingOrders}`}
                              ></div>
                              <div 
                                className="h-4 bg-green-500 float-left" 
                                style={{ width: `${(stats.completedOrders / stats.totalOrders) * 100}%` }}
                                title={`Teljesítve: ${stats.completedOrders}`}
                              ></div>
                              <div 
                                className="h-4 bg-red-500 float-left" 
                                style={{ width: `${(stats.cancelledOrders / stats.totalOrders) * 100}%` }}
                                title={`Törölve: ${stats.cancelledOrders}`}
                              ></div>
                            </>
                          )}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                            <span>Feldolgozás alatt</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                            <span>Kiszállítás alatt</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                            <span>Teljesítve</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                            <span>Törölve</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "users" && <UserTable />}
              {activeTab === "products" && <ProductTable />}
              {activeTab === "orders" && <OrderTable />}
              {activeTab === "categories" && <p>Kategóriák kezelése - Fejlesztés alatt</p>}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="border-t border-red-600 mt-8 pt-6 text-sm text-center">
            <p>© 2025 MozgoShop Admin. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

                  
