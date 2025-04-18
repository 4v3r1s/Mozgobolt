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
    egysegnyiar: 0,
    csoport: "",
    termekleiras: "",
    kiszereles: "",
    keszlet: 0,
    akciosar: 0,
    akcios_egysegnyiar: 0,
    akcio_vege: "",
    akcio_eleje: "",
    hivatkozas: "",
    ajanlott_termekek: "",
    tizennyolc: false,
    afa_kulcs: "",
    meret: "",
    szin: "",
    kepUrl: "",
    vonalkod: "" 
  });
  
  const [logoAnimated, setLogoAnimated] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [editSelectedImage, setEditSelectedImage] = useState(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); 
    
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

      
      const response = await fetch("http://localhost:3000/termek", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a termékeket");
      }

      const data = await response.json();
      
      setProducts(data);
    } catch (error) {
      
      setError("Nem sikerült betölteni a termékeket: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.azonosito); 
    setFormData({ ...product });
    setEditSelectedImage(null); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditSelectedImage(URL.createObjectURL(file));
  
    }
  };

  
  const handleNewImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      
    }
  };

  const handleNewProductChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  
  if (name === 'akcio_eleje' || name === 'akcio_vege') {
    
    if (!value) {
      setNewProductData({
        ...newProductData,
        [name]: null
      });
    } else {
      
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        const formattedDate = dateValue.toISOString().split('T')[0];
        setNewProductData({
          ...newProductData,
          [name]: formattedDate
        });
      } else {
        
        setNewProductData({
          ...newProductData,
          [name]: null
        });
      }
    }
  } else {
    
    setNewProductData({
      ...newProductData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  }
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

    
    const formDataToSend = new FormData();
    
    
    Object.keys(formData).forEach(key => {
      
      if (key !== 'createdAt' && key !== 'updatedAt') {
        
        const value = formData[key] === null ? '' : formData[key];
        formDataToSend.append(key, value);
      }
    });
    
    
    const imageInput = document.querySelector('input[name="kep"]');
    if (imageInput && imageInput.files[0]) {
      formDataToSend.append('kep', imageInput.files[0]);
      
    }
    
   
    
    
    const response = await fetch(`http://localhost:3000/termek/${editingProduct}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        
      },
      body: formDataToSend,
    });

    
    const responseText = await response.text();
    
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      
      throw new Error("Invalid server response format");
    }

    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || "Hiba a termék frissítése során");
    }

    
    fetchProducts();
    setEditingProduct(null);
    setEditSelectedImage(null);
    alert("Termék sikeresen frissítve!");
  } catch (error) {
    
    alert("Hiba a termék frissítése során: " + error.message);
  }
};

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    
    if (!newProductData.vonalkod) {
      alert("A vonalkód mező kitöltése kötelező!");
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
  
      
      const formDataToSend = new FormData();
      
      
      Object.keys(newProductData).forEach(key => {
       
        if (key === 'akcio_eleje' || key === 'akcio_vege') {
          
          if (newProductData[key] && newProductData[key] !== 'Invalid date') {
            formDataToSend.append(key, newProductData[key]);
          }
        } else if (newProductData[key] !== null && newProductData[key] !== undefined) {
          
          formDataToSend.append(key, String(newProductData[key]));
        }
      });
      
      
      const imageInput = document.getElementById('newProductImage');
      if (imageInput && imageInput.files && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        formDataToSend.append('kep', file, file.name);
       
        
        for (let pair of formDataToSend.entries()) {
          
        }
      } else {
        
      }
  
      
      
      
      const response = await fetch("http://localhost:3000/termek", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          
        },
        body: formDataToSend,
      });
  
      
      let responseData;
      const responseText = await response.text();
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        
        throw new Error("Invalid server response");
      }
      
      if (!response.ok) {
        
        throw new Error(responseData.message || responseData.error || "Hiba a termék létrehozása során");
      }
  
      
      fetchProducts();
      setShowAddForm(false);
      setSelectedImage(null);
      setNewProductData({
        nev: "",
        ar: 0,
        egysegnyiar: 0,
        csoport: "",
        termekleiras: "",
        kiszereles: "",
        keszlet: 0,
        akciosar: 0,
        akcios_egysegnyiar: 0,
        akcio_vege: "",
        akcio_eleje: "",
        hivatkozas: "",
        ajanlott_termekek: "",
        tizennyolc: false,
        afa_kulcs: "",
        meret: "",
        szin: "",
        kepUrl: "",
        vonalkod: ""
      });
      alert("Termék sikeresen létrehozva!");
    } catch (error) {
     
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

      
      const response = await fetch(`http://localhost:3000/termek/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Hiba a termék törlése során");
      }

      
      fetchProducts();
      alert("Termék sikeresen törölve!");
    } catch (error) {
      
      alert("Hiba a termék törlése során: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <form onSubmit={handleAddProduct} className="space-y-4" encType="multipart/form-data">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="md:col-span-3">
                      <h4 className="font-medium text-gray-700 mb-2 pb-1">Alapadatok</h4>
                    </div>
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
                        type="number"
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
                            name="tizennyolc"
                            checked={newProductData.tizennyolc}
                            onChange={handleNewProductChange}
                            className="h-4 w-4 text-red-600 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">18+ termék</span>
                        </label>
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-gray-700 mb-1">Leírás</label>
                        <textarea
                          name="termekleiras"
                          value={newProductData.termekleiras || ""}
                          onChange={handleNewProductChange}
                          rows="3"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        ></textarea>
                      </div>
                      
                      <div className="md:col-span-3">
                        <label className="block text-gray-700 mb-1">Termék képe</label>
                        <input
                          type="file"
                          id="newProductImage"
                          name="kep"
                          accept="image/*"
                          onChange={handleNewImageChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {selectedImage && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Előnézet:</p>
                            <img 
                              src={selectedImage} 
                              alt="Előnézet" 
                              className="h-32 object-contain border border-gray-300 rounded-md p-1" 
                            />
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-gray-700 mb-1">Hivatkozás (Kép URL)</label>
                        <input
                          type="text"
                          name="hivatkozas"
                          value={newProductData.hivatkozas || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Hivatkozás"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Vonalkód*</label>
                        <input
                          type="text"
                          name="vonalkod"
                          value={newProductData.vonalkod}
                          onChange={handleNewProductChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Kiszerelés</label>
                        <input
                          type="text"
                          name="kiszereles"
                          value={newProductData.kiszereles || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">ÁFA kulcs</label>
                        <input
                          type="text"
                          name="afa_kulcs"
                          value={newProductData.afa_kulcs || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Méret</label>
                        <input
                          type="text"
                          name="meret"
                          value={newProductData.meret || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Szín</label>
                        <input
                          type="text"
                          name="szin"
                          value={newProductData.szin || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Akciós ár</label>
                        <input
                          type="number"
                          name="akciosar"
                          value={newProductData.akciosar || 0}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Akciós egységnyi ár</label>
                        <input
                          type="number"
                          name="akcios_egysegnyiar"
                          value={newProductData.akcios_egysegnyiar || 0}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Akció kezdete</label>
                        <input
                          type="date"
                          name="akcio_eleje"
                          value={newProductData.akcio_eleje || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Akció vége</label>
                        <input
                          type="date"
                          name="akcio_vege"
                          value={newProductData.akcio_vege || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Ajánlott termékek</label>
                        <input
                          type="text"
                          name="ajanlott_termekek"
                          value={newProductData.ajanlott_termekek || ""}
                          onChange={handleNewProductChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Vesszővel elválasztott termék azonosítók"
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
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kép</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Név</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ár</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Egységnyi ár</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Csoport</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiszerelés</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Készlet</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akciós ár</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akció vége</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÁFA kulcs</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méret</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Szín</th>
                      <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.azonosito} className="hover:bg-gray-50">
                        {editingProduct === product.azonosito ? (
                          <td colSpan="14" className="py-4 px-6 border-b">
                             <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 
                                 <div className="md:col-span-3">
                                   <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Alapadatok</h4>
                                 </div>
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
                                   <label className="block text-gray-700 mb-1">Egységnyi ár</label>
                                   <input
                                     type="number"
                                     name="egysegnyiar"
                                     value={formData.egysegnyiar || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Csoport*</label>
                                   <input
                                     type="number"
                                     name="csoport"
                                     value={formData.csoport || ""}
                                     onChange={handleChange}
                                     required
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Kiszerelés</label>
                                   <input
                                     type="text"
                                     name="kiszereles"
                                     value={formData.kiszereles || ""}
                                     onChange={handleChange}
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
                                 
                                 
                                 <div className="md:col-span-3 mt-4">
                                   <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Akciós adatok</h4>
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Akciós ár</label>
                                   <input
                                     type="number"
                                     name="akciosar"
                                     value={formData.akciosar || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Akciós egységnyi ár</label>
                                   <input
                                     type="number"
                                     name="akcios_egysegnyiar"
                                     value={formData.akcios_egysegnyiar || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Akció kezdete</label>
                                   <input
                                     type="date"
                                     name="akcio_eleje"
                                     value={formData.akcio_eleje ? formData.akcio_eleje.split('T')[0] : ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Akció vége</label>
                                   <input
                                     type="date"
                                     name="akcio_vege"
                                     value={formData.akcio_vege ? formData.akcio_vege.split('T')[0] : ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 
                                 
                                 <div className="md:col-span-3 mt-4">
                                   <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">Egyéb adatok</h4>
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">ÁFA kulcs</label>
                                   <input
                                     type="text"
                                     name="afa_kulcs"
                                     value={formData.afa_kulcs || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Méret</label>
                                   <input
                                     type="text"
                                     name="meret"
                                     value={formData.meret || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="block text-gray-700 mb-1">Szín</label>
                                   <input
                                     type="text"
                                     name="szin"
                                     value={formData.szin || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div>
                                   <label className="flex items-center mt-3">
                                     <input
                                       type="checkbox"
                                       name="tizennyolc"
                                       checked={formData.tizennyolc ? true : false}
                                       onChange={handleChange}
                                       className="h-4 w-4 text-red-600 border-gray-300 rounded"
                                     />
                                     <span className="ml-2 text-gray-700">18+ termék</span>
                                   </label>
                                 </div>
                                 <div className="md:col-span-3">
                                   <label className="block text-gray-700 mb-1">Vonalkód</label>
                                   <input
                                     type="text"
                                     name="vonalkod"
                                     value={formData.vonalkod || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                   />
                                 </div>
                                 <div className="md:col-span-3">
                                   <label className="block text-gray-700 mb-1">Ajánlott termékek</label>
                                   <input
                                     type="text"
                                     name="ajanlott_termekek"
                                     value={formData.ajanlott_termekek || ""}
                                     onChange={handleChange}
                                     className="w-full p-2 border border-gray-300 rounded-md"
                                     placeholder="Vesszővel elválasztott termék azonosítók"
                                   />
                                 </div>
                                 <div className="md:col-span-3">
                                 <label className="block text-gray-700 mb-1">Leírás</label>
                                 <textarea
                                   name="termekleiras"
                                   value={formData.termekleiras || ""}
                                   onChange={handleChange}
                                   rows="3"
                                   className="w-full p-2 border border-gray-300 rounded-md"
                                 ></textarea>
                               </div>
                               
                               
                               <div className="md:col-span-3">
                                 <label className="block text-gray-700 mb-1">Termék képe</label>
                                 <input
                                   type="file"
                                   name="kep"
                                   accept="image/*"
                                   onChange={handleImageChange}
                                   className="w-full p-2 border border-gray-300 rounded-md"
                                 />
                                 {editSelectedImage && (
                                   <div className="mt-2">
                                     <p className="text-sm text-gray-500 mb-1">Új kép előnézete:</p>
                                     <img 
                                       src={editSelectedImage} 
                                       alt="Előnézet" 
                                       className="h-32 object-contain border border-gray-300 rounded-md p-1" 
                                     />
                                   </div>
                                 )}
                                 {formData.kepUrl && !editSelectedImage && (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-1">Jelenlegi kép:</p>
                                    <img 
                                      src={`http://localhost:3000${formData.kepUrl}`} 
                                      alt="Jelenlegi kép" 
                                      className="h-32 object-contain border border-gray-300 rounded-md p-1" 
                                      onError={(e) => {
                                       
                                        e.target.onerror = null;
                                        e.target.parentNode.innerHTML = `
                                          <div class="h-32 bg-gray-200 rounded-md flex items-center justify-center border border-gray-300 p-1">
                                            <span class="text-sm text-gray-500">Kép nem található</span>
                                          </div>
                                        `;
                                      }}
                                    />
                                  </div>
                                )}
                                </div>

                               <div className="md:col-span-3">
                                 <label className="block text-gray-700 mb-1">Hivatkozás</label>
                                 <input
                                   type="text"
                                   name="hivatkozas"
                                   value={formData.hivatkozas || ""}
                                   onChange={handleChange}
                                   className="w-full p-2 border border-gray-300 rounded-md"
                                   placeholder="Hivatkozás a termékre"
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
                          <td className="py-3 px-4 text-sm text-gray-700">{product.azonosito}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {product.kepUrl ? (
                              <img 
                                src={`http://localhost:3000${product.kepUrl}`} 
                                alt={product.nev} 
                                className="h-12 w-12 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.onerror = null;                                  
                                  e.target.parentNode.innerHTML = `
                                    <div class="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                                      <span class="text-xs text-gray-500">Nincs kép</span>
                                    </div>
                                  `;
                                }}
                              />
                            ) : product.hivatkozas ? (
                              <img 
                                src={product.hivatkozas} 
                                alt={product.nev} 
                                className="h-12 w-12 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.parentNode.innerHTML = `
                                    <div class="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                                      <span class="text-xs text-gray-500">Nincs kép</span>
                                    </div>
                                  `;
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-xs text-gray-500">Nincs kép</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.nev}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.ar} Ft</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.egysegnyiar || "-"}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.csoport}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.kiszereles || "-"}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.keszlet}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.akciosar ? `${product.akciosar} Ft` : "-"}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.akcio_vege || "-"}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.afa_kulcs || "-"}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.meret || "-"}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{product.szin || "-"}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Szerkesztés
                              </button>
                              <button
                                onClick={() => handleDelete(product.azonosito)}
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
