import { useState, useEffect } from "react";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

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

      const response = await fetch("http://localhost:3000/admin/products", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a termékek lekérése során");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Nem sikerült betölteni a termékeket");
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
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`http://localhost:3000/admin/products/${editingProduct}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Hiba a termék frissítése során");
      }

      // Update the products list
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Hiba történt a termék frissítése során");
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

      const response = await fetch(`http://localhost:3000/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a termék törlése során");
      }

      // Update the products list
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Hiba történt a termék törlése során");
    }
  };

  if (loading) {
    return <p>Termékek betöltése...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Termékek kezelése</h2>
      
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Név</th>
            <th className="py-2 px-4 border-b text-left">Ár</th>
            <th className="py-2 px-4 border-b text-left">Csoport</th>
            <th className="py-2 px-4 border-b text-left">Készlet</th>
            <th className="py-2 px-4 border-b text-left">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              {editingProduct === product.id ? (
                <td colSpan="6" className="py-2 px-4 border-b">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Név</label>
                        <input
                          type="text"
                          name="nev"
                          value={formData.nev || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ár</label>
                        <input
                          type="number"
                          name="ar"
                          value={formData.ar || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Csoport</label>
                        <input
                          type="text"
                          name="csoport"
                          value={formData.csoport || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Készlet</label>
                        <input
                          type="number"
                          name="keszlet"
                          value={formData.keszlet || 0}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Akciós</label>
                        <input
                          type="checkbox"
                          name="akcios"
                          checked={formData.akcios || false}
                          onChange={handleChange}
                          className="mt-3 h-4 w-4 text-red-600 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800"
                      >
                        Mentés
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                      >
                        Mégse
                      </button>
                    </div>
                  </form>
                </td>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{product.id}</td>
                  <td className="py-2 px-4 border-b">{product.nev}</td>
                  <td className="py-2 px-4 border-b">{product.ar} Ft</td>
                  <td className="py-2 px-4 border-b">{product.csoport}</td>
                  <td className="py-2 px-4 border-b">{product.keszlet}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
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
  );
}
