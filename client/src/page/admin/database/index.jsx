import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import OrderTable from "./OrderTable";
import "./styles.css";

export default function AdminDatabase() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoAnimated, setLogoAnimated] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
       
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          navigate('/login');
          return;
        }

        
        const response = await fetch("http://localhost:3000/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Hiba a felhasználói adatok lekérése során");
        }

        const data = await response.json();
        
        if (data.szerep !== "admin") {
          setIsAdmin(false);
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Betöltés...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center overflow-hidden h-10">
            <a href="/" className="text-white hover:text-gray-200">
              <h1 
                className={`text-2xl font-bold transition-all duration-1000 ease-in-out transform ${
                  logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
              >
                MozgoShop - Admin
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
              <a href="/account" className="hover:text-gray-200">
                FIÓKOM
              </a>
            </li>
            <li>
              <a href="/admin/database" className="text-white font-bold border-b-2 border-white">
                ADATBÁZIS KEZELÉS
              </a>
            </li>
          </ul>
        </div>
      </nav>

      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-700 text-white py-4 px-6">
            <h1 className="text-2xl font-bold">Adatbázis Kezelés</h1>
          </div>

          <div className="p-6">
            
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "users"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Felhasználók
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "products"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Termékek
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "orders"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Rendelések
                </button>
              </nav>
            </div>

           
            <div className="tab-content">
              {activeTab === "users" && <UserTable />}
              {activeTab === "products" && <ProductTable />}
              {activeTab === "orders" && <OrderTable />}
            </div>
          </div>
        </div>
      </main>

      
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="border-t border-red-600 mt-8 pt-6 text-sm text-center">
            <p>© 2023 MozgoShop. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
