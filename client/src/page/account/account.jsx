import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    newsletter: false,
    telefonszam: "",
    vezeteknev: "",
    keresztnev: "",
    szuletesidatum: "",
    szamlazasi_nev: "",
    szamlazasi_irsz: "",
    szamlazasi_telepules: "",
    szamlazasi_kozterulet: "",
    szamlazasi_hazszam: "",
    adoszam: "",
    szallitasi_nev: "",
    szallitasi_irsz: "",
    szallitasi_telepules: "",
    szallitasi_kozterulet: "",
    szallitasi_hazszam: "",
    role: "" // Megtartjuk a role-t a kódban, de nem jelenítjük meg
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [differentBillingAddress, setDifferentBillingAddress] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", // success or error
  });

  // Animáció indítása késleltetéssel
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
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

  useEffect(() => {
    const checkAuth = () => {
      // Get token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return false;
      }
      
      setIsAuthenticated(true);
      return true;
    };

    const fetchUserData = async () => {
      try {
        if (!checkAuth()) return;

        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        const response = await fetch("http://localhost:3000/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            setIsAuthenticated(false);
            return;
          }
          throw new Error("Hiba a felhasználói adatok lekérése során");
        }

        const data = await response.json();
        
        // Ellenőrizzük, hogy a számlázási és szállítási adatok különböznek-e
        const hasDifferentBillingAddress = 
          data.szamlazasi_nev !== data.szallitasi_nev ||
          data.szamlazasi_irsz !== data.szallitasi_irsz ||
          data.szamlazasi_telepules !== data.szallitasi_telepules ||
          data.szamlazasi_kozterulet !== data.szallitasi_kozterulet ||
          data.szamlazasi_hazszam !== data.szallitasi_hazszam;
        
        setDifferentBillingAddress(hasDifferentBillingAddress);
        
        setUserData({
          username: data.felhasznalonev || "Nincs megadva",
          email: data.email || "Nincs megadva",
          newsletter: data.hirlevel || false,
          telefonszam: data.telefonszam || "Nincs megadva",
          vezeteknev: data.vezeteknev || "Nincs megadva",
          keresztnev: data.keresztnev || "Nincs megadva",
          szuletesidatum: data.szuletesidatum 
            ? new Date(data.szuletesidatum).toLocaleDateString('hu-HU') 
            : "Nincs megadva",
          szamlazasi_nev: data.szamlazasi_nev || "Nincs megadva",
          szamlazasi_irsz: data.szamlazasi_irsz || "Nincs megadva",
          szamlazasi_telepules: data.szamlazasi_telepules || "Nincs megadva",
          szamlazasi_kozterulet: data.szamlazasi_kozterulet || "Nincs megadva",
          szamlazasi_hazszam: data.szamlazasi_hazszam || "Nincs megadva",
          adoszam: data.adoszam || "Nincs megadva",
          szallitasi_nev: data.szallitasi_nev || "Nincs megadva",
          szallitasi_irsz: data.szallitasi_irsz || "Nincs megadva",
          szallitasi_telepules: data.szallitasi_telepules || "Nincs megadva",
          szallitasi_kozterulet: data.szallitasi_kozterulet || "Nincs megadva",
          szallitasi_hazszam: data.szallitasi_hazszam || "Nincs megadva",
          role: data.szerep || "user" // Megtartjuk a role-t a kódban, de nem jelenítjük meg
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        showAlert("Hiba történt az adatok betöltése során.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Show success message
    showAlert("Sikeres kijelentkezés!", "success");
    setIsAuthenticated(false);
    
    // Redirect to home after short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const navigateToOrders = () => {
    navigate('/orders');
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-700 text-white py-4 px-6">
              <h1 className="text-2xl font-bold">Fiókom</h1>
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

            <div className="p-6 space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Adatok betöltése...</p>
                </div>
              ) : !isAuthenticated ? (
                <div className="text-center py-8 space-y-6">
                  <div className="space-y-2">
                    <p className="text-gray-700 text-lg">A fiók megtekintéséhez be kell jelentkezned.</p>
                    <p className="text-gray-500">Kérjük, jelentkezz be a fiókodba vagy regisztrálj, ha még nem rendelkezel fiókkal.</p>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <button 
                      className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
                      onClick={handleLogin}
                    >
                      Bejelentkezés
                    </button>
                    <a 
                      href="/register" 
                      className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 text-center"
                    >
                      Regisztráció
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {/* Személyes adatok szekció */}
                    <div className="border-b pb-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">Személyes adatok</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Felhasználónév</p>
                          <p className="font-medium text-lg">{userData.username}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Email cím</p>
                          <p className="font-medium text-lg">{userData.email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Vezetéknév</p>
                          <p className="font-medium text-lg">{userData.vezeteknev}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Keresztnév</p>
                          <p className="font-medium text-lg">{userData.keresztnev}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Telefonszám</p>
                          <p className="font-medium text-lg">{userData.telefonszam}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Születési dátum</p>
                          <p className="font-medium text-lg">{userData.szuletesidatum}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Hírlevél feliratkozás</p>
                          <p className="font-medium text-lg">
                            {userData.newsletter ? (
                              <span className="text-green-600">Feliratkozva</span>
                            ) : (
                              <span className="text-gray-600">Nincs feliratkozva</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Szállítási adatok szekció */}
                    <div className="border-b pb-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">Szállítási adatok</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Szállítási név</p>
                          <p className="font-medium text-lg">{userData.szallitasi_nev}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Irányítószám</p>
                          <p className="font-medium text-lg">{userData.szallitasi_irsz}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Település</p>
                          <p className="font-medium text-lg">{userData.szallitasi_telepules}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Közterület</p>
                          <p className="font-medium text-lg">{userData.szallitasi_kozterulet}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Házszám</p>
                          <p className="font-medium text-lg">{userData.szallitasi_hazszam}</p>
                        </div>
                      </div>
                    </div>

                    {/* Számlázási adatok szekció - csak ha különbözik a szállítási címtől */}
                    {differentBillingAddress && (
                      <div className="border-b pb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Számlázási adatok</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Számlázási név</p>
                            <p className="font-medium text-lg">{userData.szamlazasi_nev}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Irányítószám</p>
                            <p className="font-medium text-lg">{userData.szamlazasi_irsz}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Település</p>
                            <p className="font-medium text-lg">{userData.szamlazasi_telepules}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Közterület</p>
                            <p className="font-medium text-lg">{userData.szamlazasi_kozterulet}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Házszám</p>
                            <p className="font-medium text-lg">{userData.szamlazasi_hazszam}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Adószám</p>
                            <p className="font-medium text-lg">{userData.adoszam}</p>
                          </div>
                        </div>
                      </div>
                    )}

<div className="pt-2">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">Fiók műveletek</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <button 
      className="bg-white border border-red-700 text-red-700 py-3 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
      onClick={() => navigate('/profile/edit')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
      Adatok szerkesztése
    </button>
    <button 
      className="bg-white border border-red-700 text-red-700 py-3 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
      onClick={navigateToOrders}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
      Rendeléseim
    </button>
    
    {/* Admin database management button - only visible for admins */}
    {userData.role === "admin" && (
      <button 
        className="bg-white border border-red-700 text-red-700 py-3 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
        onClick={() => navigate('/admin')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
        </svg>
        Admin felület
      </button>
    )}
  </div>
  
  <div className="mt-6">
    <button 
      className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition-colors flex items-center justify-center"
      onClick={handleLogout}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      </svg>
      Kijelentkezés
    </button>
  </div>
</div>
                  </div>
                </>
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

                    
