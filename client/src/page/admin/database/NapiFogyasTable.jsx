import { useState, useEffect } from "react";
import { Edit, Trash2, Search, X, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";

export default function NapiFogyasTable() {
  const [napiFogyasok, setNapiFogyasok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterRaktar, setFilterRaktar] = useState("");
  const [raktarak, setRaktarak] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  
  useEffect(() => {
    fetchNapiFogyasok();
    fetchRaktarak();
  }, []);

  const fetchNapiFogyasok = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch("http://localhost:3000/api/napi-fogyas", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a napi fogyás adatokat");
      }

      const data = await response.json();
      setNapiFogyasok(data);
    } catch (error) {
      
      setError("Nem sikerült betölteni a napi fogyás adatokat: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRaktarak = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error("Nincs bejelentkezve");
      }

      const response = await fetch("http://localhost:3000/api/raktar", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a raktárakat");
      }

      const data = await response.json();
      setRaktarak(data);
    } catch (error) {
     
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.azonosito);
    setFormData({ ...item });
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

      const response = await fetch(`http://localhost:3000/api/napi-fogyas/${editingItem}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Hiba a napi fogyás frissítése során");
      }

      
      fetchNapiFogyasok();
      setEditingItem(null);
      alert("Napi fogyás sikeresen frissítve!");
    } catch (error) {
      
      alert("Hiba a napi fogyás frissítése során: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törölni szeretné ezt a napi fogyás bejegyzést?")) {
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

      const response = await fetch(`http://localhost:3000/api/napi-fogyas/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a napi fogyás törlése során");
      }

      
      fetchNapiFogyasok();
      alert("Napi fogyás sikeresen törölve!");
    } catch (error) {
      
      alert("Hiba a napi fogyás törlése során: " + error.message);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterRaktar("");
  };

  
  const filteredItems = napiFogyasok.filter(item => {
    const termekNev = item.termekData ? item.termekData.nev.toLowerCase() : "";
    const helyszin = item.helyszin ? item.helyszin.toLowerCase() : "";
    const searchMatch = 
      termekNev.includes(searchTerm.toLowerCase()) || 
      helyszin.includes(searchTerm.toLowerCase());
    
    const dateMatch = filterDate ? item.datum === filterDate : true;
    const raktarMatch = filterRaktar ? item.raktar === parseInt(filterRaktar) : true;
    
    return searchMatch && dateMatch && raktarMatch;
  });

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  
  const getRaktarNev = (raktarId) => {
    const raktar = raktarak.find(r => r.azonosito === raktarId);
    return raktar ? raktar.rendszam : "Ismeretlen";
  };

  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy. MMMM d.', { locale: hu });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Napi fogyás adatok kezelése</h2>
        <button
          onClick={fetchNapiFogyasok}
          className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition-colors"
        >
          Adatok frissítése
        </button>
      </div>

     
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Keresés termék vagy helyszín alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterRaktar}
            onChange={(e) => setFilterRaktar(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Összes mozgóbolt</option>
            {raktarak.map((raktar) => (
              <option key={raktar.azonosito} value={raktar.azonosito}>
                {raktar.rendszam}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={clearFilters}
            className="flex items-center text-gray-600 hover:text-red-700"
          >
            <X className="h-5 w-5 mr-1" />
            Szűrők törlése
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 p-4 mb-4 rounded-md text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Adatok betöltése...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dátum</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mozgóbolt</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Termék</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mennyiség</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helyszín</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.azonosito} className="hover:bg-gray-50">
                    {editingItem === item.azonosito ? (
                      <td colSpan="7" className="py-4 px-6 border-b">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-gray-700 mb-1">Dátum</label>
                              <input
                                type="date"
                                name="datum"
                                value={formData.datum || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-1">Mozgóbolt</label>
                              <select
                                name="raktar"
                                value={formData.raktar || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                {raktarak.map((raktar) => (
                                  <option key={raktar.azonosito} value={raktar.azonosito}>
                                    {raktar.rendszam}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-1">Mennyiség</label>
                              <input
                                type="number"
                                name="mennyiseg"
                                value={formData.mennyiseg || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-gray-700 mb-1">Helyszín</label>
                              <input
                                type="text"
                                name="helyszin"
                                value={formData.helyszin || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                          <button
                              type="submit"
                              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                            >
                              Mentés
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItem(null)}
                              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                            >
                              Mégse
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="py-3 px-4 border-b">{item.azonosito}</td>
                        <td className="py-3 px-4 border-b">{formatDate(item.datum)}</td>
                        <td className="py-3 px-4 border-b">{getRaktarNev(item.raktar)}</td>
                        <td className="py-3 px-4 border-b">
                          {item.termekData ? item.termekData.nev : `Termék #${item.termek}`}
                        </td>
                        <td className="py-3 px-4 border-b">{item.mennyiseg} db</td>
                        <td className="py-3 px-4 border-b">{item.helyszin || "-"}</td>
                        <td className="py-3 px-4 border-b">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Szerkesztés"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.azonosito)}
                              className="text-red-600 hover:text-red-800"
                              title="Törlés"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-4 px-6 text-center text-gray-500">
                      Nincs találat a keresési feltételeknek megfelelően.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div>
                <span className="text-sm text-gray-700">
                  {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} / {filteredItems.length} elem
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Első
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Előző
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                 
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const leftSide = Math.max(1, currentPage - 2);
                    const rightSide = Math.min(totalPages, currentPage + 2);
                    if (rightSide - leftSide < 4) {
                      if (leftSide === 1) {
                        pageNum = i + 1;
                      } else {
                        pageNum = totalPages - 4 + i;
                      }
                    } else {
                      pageNum = leftSide + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNum
                          ? "bg-red-700 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Következő
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Utolsó
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

