import { useState, useEffect } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch("http://localhost:3000/admin/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a felhasználók lekérése során");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Nem sikerült betölteni a felhasználókat");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({ ...user });
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

      const response = await fetch(`http://localhost:3000/admin/users/${editingUser}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Hiba a felhasználó frissítése során");
      }

      // Update the users list
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Hiba történt a felhasználó frissítése során");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törölni szeretné ezt a felhasználót?")) {
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a felhasználó törlése során");
      }

      // Update the users list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Hiba történt a felhasználó törlése során");
    }
  };

  if (loading) {
    return <p>Felhasználók betöltése...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Felhasználók kezelése</h2>
      
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Felhasználónév</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Szerep</th>
            <th className="py-2 px-4 border-b text-left">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {editingUser === user.id ? (
                <td colSpan="5" className="py-2 px-4 border-b">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Felhasználónév</label>
                        <input
                          type="text"
                          name="felhasznalonev"
                          value={formData.felhasznalonev || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Szerep</label>
                        <select
                          name="szerep"
                          value={formData.szerep || "user"}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          <option value="user">Felhasználó</option>
                          <option value="vevo">Vevő</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hírlevél</label>
                        <input
                          type="checkbox"
                          name="hirlevel"
                          checked={formData.hirlevel || false}
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
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                      >
                        Mégse
                      </button>
                    </div>
                  </form>
                </td>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.felhasznalonev}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.szerep === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.szerep === 'vevo' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.szerep === 'admin' 
                        ? 'Admin' 
                        : user.szerep === 'vevo' 
                          ? 'Vevő' 
                          : 'Felhasználó'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Szerkesztés
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
