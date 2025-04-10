import { useState, useEffect } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    felhasznalonev: "",
    email: "",
    jelszo: "",
    telefonszam: "",
    vezeteknev: "",
    keresztnev: "",
    szuletesidatum: "",
    szerep: "user",
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
    hirlevel: false
  });
  const [logoAnimated, setLogoAnimated] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); 
    
    return () => clearTimeout(timer);
  }, []);

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

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch("http://localhost:3000/user/all", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a felhasználókat");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Nem sikerült betölteni a felhasználókat: " + error.message);
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

  const handleNewUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUserData({
      ...newUserData,
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

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      
      const dataToSend = { ...formData };
      
      
      delete dataToSend.createdAt;
      delete dataToSend.updatedAt;
      
      const response = await fetch(`http://localhost:3000/user/updateUser/${editingUser}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Hiba a felhasználó frissítése során");
      }

      
      fetchUsers();
      setEditingUser(null);
      alert("Felhasználó sikeresen frissítve!");
    } catch (error) {
      alert("Hiba a felhasználó frissítése során: " + error.message);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch("http://localhost:3000/user/addUser", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Hiba a felhasználó létrehozása során");
      }

      
      fetchUsers();
      setShowAddForm(false);
      setNewUserData({
        felhasznalonev: "",
        email: "",
        jelszo: "",
        telefonszam: "",
        vezeteknev: "",
        keresztnev: "",
        szuletesidatum: "",
        szerep: "user",
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
        hirlevel: false
      });
      alert("Felhasználó sikeresen létrehozva!");
    } catch (error) {
      alert("Hiba a felhasználó létrehozása során: " + error.message);
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

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch(`http://localhost:3000/user/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a felhasználó törlése során");
      }

      
      fetchUsers();
      alert("Felhasználó sikeresen törölve!");
    } catch (error) {
      alert("Hiba a felhasználó törlése során: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-700">Felhasználók betöltése...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Felhasználók kezelése</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
              >
                {showAddForm ? "Mégse" : "Új felhasználó"}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-gray-50 p-6 mb-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Új felhasználó hozzáadása</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="md:col-span-3">
                      <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Alapadatok</h4>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Felhasználónév*</label>
                      <input
                        type="text"
                        name="felhasznalonev"
                        value={newUserData.felhasznalonev}
                        onChange={handleNewUserChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={newUserData.email}
                        onChange={handleNewUserChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Jelszó*</label>
                      <input
                        type="password"
                        name="jelszo"
                        value={newUserData.jelszo}
                        onChange={handleNewUserChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Vezetéknév</label>
                      <input
                        type="text"
                        name="vezeteknev"
                        value={newUserData.vezeteknev || ""}
                        onChange={handleNewUserChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Keresztnév</label>
                      <input
                        type="text"
                        name="keresztnev"
                        value={newUserData.keresztnev || ""}
                        onChange={handleNewUserChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Telefonszám</label>
                      <input
                        type="text"
                        name="telefonszam"
                        value={newUserData.telefonszam || ""}
                        onChange={handleNewUserChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Születési dátum</label>
                      <input
                        type="date"
                        name="szuletesidatum"
                        value={newUserData.szuletesidatum || ""}
                        onChange={handleNewUserChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Szerep</label>
                      <select
                           name="szerep"
                                                value={newUserData.szerep}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              >
                                                <option value="user">Felhasználó</option>
                                                <option value="vevo">Vevő</option>
                                                <option value="admin">Admin</option>
                                              </select>
                                            </div>
                                            <div>
                                              <label className="flex items-center mt-3">
                                                <input
                                                  type="checkbox"
                                                  name="hirlevel"
                                                  checked={newUserData.hirlevel}
                                                  onChange={handleNewUserChange}
                                                  className="h-4 w-4 text-red-600 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-gray-700">Hírlevél</span>
                                              </label>
                                            </div>
                        
                                            
                                            <div className="md:col-span-3 mt-4">
                                              <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Számlázási adatok</h4>
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Számlázási név</label>
                                              <input
                                                type="text"
                                                name="szamlazasi_nev"
                                                value={newUserData.szamlazasi_nev || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Irányítószám</label>
                                              <input
                                                type="number"
                                                name="szamlazasi_irsz"
                                                value={newUserData.szamlazasi_irsz || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Település</label>
                                              <input
                                                type="text"
                                                name="szamlazasi_telepules"
                                                value={newUserData.szamlazasi_telepules || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Közterület</label>
                                              <input
                                                type="text"
                                                name="szamlazasi_kozterulet"
                                                value={newUserData.szamlazasi_kozterulet || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Házszám</label>
                                              <input
                                                type="text"
                                                name="szamlazasi_hazszam"
                                                value={newUserData.szamlazasi_hazszam || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Adószám</label>
                                              <input
                                                type="text"
                                                name="adoszam"
                                                value={newUserData.adoszam || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                        
                                            
                                            <div className="md:col-span-3 mt-4">
                                              <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Szállítási adatok</h4>
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Szállítási név</label>
                                              <input
                                                type="text"
                                                name="szallitasi_nev"
                                                value={newUserData.szallitasi_nev || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Irányítószám</label>
                                              <input
                                                type="number"
                                                name="szallitasi_irsz"
                                                value={newUserData.szallitasi_irsz || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Település</label>
                                              <input
                                                type="text"
                                                name="szallitasi_telepules"
                                                value={newUserData.szallitasi_telepules || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Közterület</label>
                                              <input
                                                type="text"
                                                name="szallitasi_kozterulet"
                                                value={newUserData.szallitasi_kozterulet || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-gray-700 mb-1">Házszám</label>
                                              <input
                                                type="text"
                                                name="szallitasi_hazszam"
                                                value={newUserData.szallitasi_hazszam || ""}
                                                onChange={handleNewUserChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                              />
                                            </div>
                                          </div>
                                          <button
                                            type="submit"
                                            className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
                                          >
                                            Felhasználó létrehozása
                                          </button>
                                        </form>
                                      </div>
                                    )}
                                    
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Felhasználónév</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Név</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Szerep</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hírlevél</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Műveletek</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                              {editingUser === user.id ? (
                                                <td colSpan="8" className="py-4 px-6 border-b">
                                                  <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                      
                                                      <div className="md:col-span-3">
                                                        <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Alapadatok</h4>
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Felhasználónév*</label>
                                                        <input
                                                          type="text"
                                                          name="felhasznalonev"
                                                          value={formData.felhasznalonev || ""}
                                                          onChange={handleChange}
                                                          required
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Email*</label>
                                                        <input
                                                          type="email"
                                                          name="email"
                                                          value={formData.email || ""}
                                                          onChange={handleChange}
                                                          required
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Vezetéknév</label>
                                                        <input
                                                          type="text"
                                                          name="vezeteknev"
                                                          value={formData.vezeteknev || ""}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Keresztnév</label>
                                                        <input
                                                          type="text"
                                                          name="keresztnev"
                                                          value={formData.keresztnev || ""}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Telefonszám</label>
                                                        <input
                                                          type="text"
                                                          name="telefonszam"
                                                          value={formData.telefonszam || ""}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Születési dátum</label>
                                                        <input
                                                          type="date"
                                                          name="szuletesidatum"
                                                          value={formData.szuletesidatum ? new Date(formData.szuletesidatum).toISOString().split('T')[0] : ""}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Szerep</label>
                                                        <select
                                                          name="szerep"
                                                          value={formData.szerep || "user"}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        >
                                                          <option value="user">Felhasználó</option>
                                                          <option value="vevo">Vevő</option>
                                                          <option value="admin">Admin</option>
                                                        </select>
                                                      </div>
                                                      <div>
                                                        <label className="flex items-center mt-3">
                                                          <input
                                                            type="checkbox"
                                                            name="hirlevel"
                                                            checked={formData.hirlevel || false}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-red-600 border-gray-300 rounded"
                                                          />
                                                          <span className="ml-2 text-gray-700">Hírlevél</span>
                                                        </label>
                                                      </div>
                        
                                                      
                                                      <div className="md:col-span-3 mt-4">
                                                        <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Számlázási adatok</h4>
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Számlázási név</label>
                                                        <input
                                                          type="text"
                                                          name="szamlazasi_nev"
                                                          value={formData.szamlazasi_nev || ""}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Irányítószám</label>
                                                        <input
                                                          type="number"
                                                          name="szamlazasi_irsz"
                                                          value={formData.szamlazasi_irsz || ""}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Település</label>
                                                        <input
                                                          type="text"
                                                          name="szamlazasi_telepules"
                                                          value={formData.szamlazasi_telepules || ""}
                                                          onChange={handleChange}
                                                          className="w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="block text-gray-700 mb-1">Közterület</label>
                                                        <input
                                                           type="text"
                                                           name="szamlazasi_kozterulet"
                                                           value={formData.szamlazasi_kozterulet || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
                                                         />
                                                       </div>
                                                       <div>
                                                         <label className="block text-gray-700 mb-1">Házszám</label>
                                                         <input
                                                           type="text"
                                                           name="szamlazasi_hazszam"
                                                           value={formData.szamlazasi_hazszam || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
                                                         />
                                                       </div>
                                                       <div>
                                                         <label className="block text-gray-700 mb-1">Adószám</label>
                                                         <input
                                                           type="text"
                                                           name="adoszam"
                                                           value={formData.adoszam || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
                                                         />
                                                       </div>
                         
                                                      
                                                       <div className="md:col-span-3 mt-4">
                                                         <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Szállítási adatok</h4>
                                                       </div>
                                                       <div>
                                                         <label className="block text-gray-700 mb-1">Szállítási név</label>
                                                         <input
                                                           type="text"
                                                           name="szallitasi_nev"
                                                           value={formData.szallitasi_nev || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
                                                         />
                                                       </div>
                                                       <div>
                                                         <label className="block text-gray-700 mb-1">Irányítószám</label>
                                                         <input
                                                           type="number"
                                                           name="szallitasi_irsz"
                                                           value={formData.szallitasi_irsz || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
                                                         />
                                                       </div>
                                                       <div>
                                                         <label className="block text-gray-700 mb-1">Település</label>
                                                         <input
                                                           type="text"
                                                           name="szallitasi_telepules"
                                                           value={formData.szallitasi_telepules || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
                                                         />
                                                       </div>
                                                       <div>
                                                         <label className="block text-gray-700 mb-1">Közterület</label>
                                                         <input
                                                           type="text"
                                                           name="szallitasi_kozterulet"
                                                           value={formData.szallitasi_kozterulet || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
                                                         />
                                                       </div>
                                                       <div>
                                                         <label className="block text-gray-700 mb-1">Házszám</label>
                                                         <input
                                                           type="text"
                                                           name="szallitasi_hazszam"
                                                           value={formData.szallitasi_hazszam || ""}
                                                           onChange={handleChange}
                                                           className="w-full p-2 border border-gray-300 rounded-md"
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
                                                         onClick={() => setEditingUser(null)}
                                                         className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                                                       >
                                                         Mégse
                                                       </button>
                                                     </div>
                                                   </form>
                                                 </td>
                                               ) : (
                                                 <>
                                                   <td className="py-3 px-4 text-sm text-gray-700">{user.id}</td>
                                                   <td className="py-3 px-4 text-sm text-gray-700">{user.felhasznalonev}</td>
                                                   <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                                                   <td className="py-3 px-4 text-sm text-gray-700">
                                                     {user.vezeteknev && user.keresztnev 
                                                       ? `${user.vezeteknev} ${user.keresztnev}`
                                                       : user.vezeteknev || user.keresztnev || "-"}
                                                   </td>
                                                   <td className="py-3 px-4 text-sm text-gray-700">{user.telefonszam || "-"}</td>
                                                   <td className="py-3 px-4">
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
                                                       <td className="py-3 px-4">
                                                         {user.hirlevel ? (
                                                           <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Igen</span>
                                                         ) : (
                                                           <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Nem</span>
                                                         )}
                                                       </td>
                                                       <td className="py-3 px-4">
                                                         <div className="flex space-x-2">
                                                           <button
                                                             onClick={() => handleEdit(user)}
                                                             className="text-blue-600 hover:text-blue-800 transition-colors"
                                                           >
                                                             Szerkesztés
                                                           </button>
                                                           <button
                                                             onClick={() => handleDelete(user.id)}
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
                                                         