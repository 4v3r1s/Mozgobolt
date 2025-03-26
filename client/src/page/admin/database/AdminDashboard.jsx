import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "./database/UserTable";
import ProductTable from "./database/ProductTable";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [logoAnimated, setLogoAnimated] = useState(true);

  // Check if user is admin
  const checkAdminAuth = () => {
    // Get token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      navigate('/login');
      return false;
    }
    
    return true;
  };

  // Call auth check when component mounts
  useState(() => {
    checkAdminAuth();
  }, []);

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
              <a href="/admin" className="text-white font-bold border-b-2 border-white">
                ADMIN FELÜLET
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-700 text-white py-4 px-6">
            <h1 className="text-2xl font-bold">Admin Felület</h1>
          </div>

          {/* Admin Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
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
            {activeTab === "users" && <UserTable />}
            {activeTab === "products" && <ProductTable />}
            {activeTab === "orders" && <p>Rendelések kezelése - Fejlesztés alatt</p>}
            {activeTab === "categories" && <p>Kategóriák kezelése - Fejlesztés alatt</p>}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="border-t border-red-600 mt-8 pt-6 text-sm text-center">
            <p>© 2023 MozgoShop Admin. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
