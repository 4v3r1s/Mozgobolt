import { useState, useEffect } from "react";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductData, setNewProductData] = useState({
    nev: "",
    ar: 0,
    csoport: "",
    keszlet: 0,
    akcios: false,
    leiras: "",
    kep: ""
  });
  const [logoAnimated, setLogoAnimated] = useState(false);

  // Animáció indítása késleltetéssel
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      // Próbáljuk meg a termékek lekérését egy másik végpontról
      const response = await fetch("http://localhost:3000/api/products", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a termékeket");
      }

      const data = await response.json();
      console.log("Fetched products:", data); // Debug log
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Nem sikerült betölteni a termékeket: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ ...product });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const handleNewProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProductData({
      ...newProductData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
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

      // Create a copy of formData to avoid sending unnecessary fields
      const dataToSend = { ...formData };
      
      // Remove any fields that might cause issues
      delete dataToSend.createdAt;
      delete dataToSend.updatedAt;
      
      const response = await fetch(`http://localhost:3000/api/products/${editingProduct}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Hiba a termék frissítése során");
      }

      // Update the products list
      fetchProducts();
      setEditingProduct(null);
      alert("Termék sikeresen frissítve!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Hiba a termék frissítése során: " + error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProductData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Hiba a termék létrehozása során");
      }

      // Update the products list
      fetchProducts();
      setShowAddForm(false);
      setNewProductData({
        nev: "",
        ar: 0,
        csoport: "",
        keszlet: 0,
        akcios: false,
        leiras: "",
        kep: ""
      });
      alert("Termék sikeresen létrehozva!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Hiba a termék létrehozása során: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törölni szeretné ezt a terméket?")) {
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

      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a termék törlése során");
      }

      // Update the products list
      fetchProducts();
      alert("Termék sikeresen törölve!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Hiba a termék törlése során: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - animált MozgoShop felirattal */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center overflow-hidden h-10">
            <a href="/" className="text-white hover:text-gray-200 flex items-center">
              <img 
                src="/logo2.png" 
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
              <a href="/admin" className="hover:text-gray-200">
                VEZÉRLŐPULT
              </a>
            </li>
            <li>
              <a href="/admin/users" className="hover:text-gray-200">
                FELHASZNÁLÓK
              </a>
            </li>
            <li>
              <a href="/admin/products" className="text-white font-bold border-b-2 border-white">
                TERMÉKEK
              </a>
            </li>
            <li>
              <a href="/admin/orders" className="hover:text-gray-200">
                RENDELÉSEK
              </a>
            </li>
            <li>
              <a href="/admin/settings" className="hover:text-gray-200">
                BEÁLLÍTÁSOK
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-700">Termékek betöltése...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Termékek kezelése</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
              >
                {showAddForm ? "Mégse" : "Új termék"}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-gray-50 p-6 mb-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Új termék hozzáadása</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Termék neve*</label>
                      <input
                        type="text"
                        name="nev"
                        value={newProductData.nev}
                        onChange={handleNewProductChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Ár (Ft)*</label>
                      <input
                        type="number"
                        name="ar"
                        value={newProductData.ar}
                        onChange={handleNewProductChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Csoport*</label>
                      <input
                        type="text"
                        name="csoport"
                        value={newProductData.csoport}
                        onChange={handleNewProductChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Készlet*</label>
                      <input
                        type="number"
                        name="keszlet"
                        value={newProductData.keszlet}
                        onChange={handleNewProductChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="flex items-center mt-3">
                        <input
                          type="checkbox"
                          name="akcios"
                          checked={newProductData.akcios}
                          onChange={handleNewProductChange}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Akciós termék</span>
                      </label>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-gray-700 mb-1">Leírás</label>
                      <textarea
                        name="leiras"
                        value={newProductData.leiras || ""}
                        onChange={handleNewProductChange}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      ></textarea>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-gray-700 mb-1">Kép URL</label>
                      <input
                        type="text"
                        name="kep"
                        value={newProductData.kep || ""}
                        onChange={handleNewProductChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
                  >
                    Termék létrehozása
                  </button>
                </form>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ár</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Csoport</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Készlet</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akciós</th>
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      {editingProduct === product.id ? (
                        <td colSpan="7" className="py-4 px-6 border-b">
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-1">Termék neve*</label>
                                <input
                                  type="text"
                                  name="nev"
                                  value={formData.nev || ""}
                                  onChange={handleChange}
                                  required
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-1">Ár (Ft)*</label>
                                <input
                                  type="number"
                                  name="ar"
                                  value={formData.ar || 0}
                                  onChange={handleChange}
                                  required
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-1">Csoport*</label>
                                <input
                                  type="text"
                                  name="csoport"
                                  value={formData.csoport || ""}
                                  onChange={handleChange}
                                  required
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-1">Készlet*</label>
                                <input
                                  type="number"
                                  name="keszlet"
                                  value={formData.keszlet || 0}
                                  onChange={handleChange}
                                  required
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="flex items-center mt-3">
                                  <input
                                    type="checkbox"
                                    name="akcios"
                                    checked={formData.akcios || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-red-600 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-gray-700">Akciós termék</span>
                                </label>
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-gray-700 mb-1">Leírás</label>
                                <textarea
                                  name="leiras"
                                  value={formData.leiras || ""}
                                  onChange={handleChange}
                                  rows="3"
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                ></textarea>
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-gray-700 mb-1">Kép URL</label>
                                <input
                                  type="text"
                                  name="kep"
                                  value={formData.kep || ""}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  placeholder="https://example.com/image.jpg"
                                />
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
                                onClick={() => setEditingProduct(null)}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                              >
                                Mégse
                              </button>
                            </div>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.id}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.nev}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.ar} Ft</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.csoport}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.keszlet}</td>
                          <td className="py-3 px-4">
                            {product.akcios ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Igen</span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Nem</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Szerkesztés
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
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

      {/* Footer */}
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MozgoShop Admin</h3>
              <p className="text-sm">Adminisztrációs felület a MozgoShop webáruház kezeléséhez.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Gyors linkek</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/admin" className="hover:underline">
                    Vezérlőpult
                  </a>
                </li>
                <li>
                  <a href="/admin/users" className="hover:underline">
                    Felhasználók
                  </a>
                </li>
                <li>
                  <a href="/admin/products" className="hover:underline">
                    Termékek
                  </a>
                </li>
                <li>
                  <a href="/admin/orders" className="hover:underline">
                    Rendelések
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Segítség</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/admin/help" className="hover:underline">
                    Dokumentáció
                  </a>
                </li>
                <li>
                  <a href="/admin/support" className="hover:underline">
                    Támogatás
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-600 mt-8 pt-6 text-sm text-center">
            <p>© 2025 MozgoShop. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

                   