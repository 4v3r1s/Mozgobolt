import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, AlertCircle, CheckCircle, X } from "lucide-react";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function NapiFogyas() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [raktar, setRaktar] = useState("");
  const [raktarak, setRaktarak] = useState([]);
  const [previewData, setPreviewData] = useState(null);

  
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
          navigate('/login');
          return;
        }

        const userData = await response.json();
        
        
        if (userData.szerep !== "admin" && userData.szerep !== "vevo") {
          navigate('/account');
          return;
        }
      } catch (error) {
        console.error("Hiba a jogosultság ellenőrzése során:", error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);
 
  
const fetchTermekData = async (termekIds) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
  
      if (!token) {
        return {};
      }
  
      
      const uniqueIds = [...new Set(termekIds.map(id => parseInt(id)).filter(id => !isNaN(id)))];
      
      console.log("Termék azonosítók lekérése:", uniqueIds);
      
      if (uniqueIds.length === 0) {
        return {};
      }
      
      
      const response = await fetch("http://localhost:3000/termek", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a termékeket");
      }
  
      const termekek = await response.json();
      console.log(`${termekek.length} termék betöltve`);
      
      
      const termekMap = {};
      termekek.forEach(termek => {
        
        const termekId = parseInt(termek.azonosito);
        if (uniqueIds.includes(termekId)) {
          termekMap[termekId] = termek.nev;
          
          termekMap[termekId.toString()] = termek.nev;
        }
      });
      
      console.log("Termék nevek:", termekMap);
      return termekMap;
    } catch (error) {
      console.error("Hiba a termékek lekérdezésekor:", error);
      return {};
    }
  };

  
  useEffect(() => {
    const fetchRaktarak = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch("http://localhost:3000/api/raktar", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Nem sikerült betölteni a mozgóboltokat");
        }

        const data = await response.json();
        setRaktarak(data);
        
       
        if (data.length > 0) {
          setRaktar(data[0].azonosito.toString());
        }
      } catch (error) {
        console.error("Hiba a mozgóboltok lekérdezésekor:", error);
        setError("Nem sikerült betölteni a mozgóboltokat. Kérjük, próbálja újra később.");
      }
    };

    fetchRaktarak();
  }, [navigate]);

  
  const parseFileForPreview = async (file) => {
    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
      
      if (fileExt === 'csv') {
        
    Papa.parse(file, {
        header: true,
            complete: async (results) => {
           
            const previewRows = results.data.slice(0, 10);
            
            const termekIds = previewRows.map(row => {
                
                const id = row['Termék azonosító'] || row['termek_azonosito'] || row['termek'] || 
                        row['Termék'] || row['TermékID'] || row['ID'] || Object.values(row)[0];
                console.log("Talált termék azonosító:", id);
                return id;
            }).filter(id => id);
            
            
            const termekMap = await fetchTermekData(termekIds);
            
           
            const rowsWithNames = previewRows.map(row => {
                const termekId = row['Termék azonosító'] || row['termek_azonosito'] || row['termek'] || 
                                row['Termék'] || row['TermékID'] || row['ID'] || Object.values(row)[0];
                
                
                const termekNev = termekMap[termekId] || termekMap[parseInt(termekId)] || 
                                termekMap[termekId.toString()] || 'Ismeretlen termék';
                
                return {
                ...row,
                'Termék neve': termekNev
                };
            });
            
            
            const headers = results.meta.fields || [];
            if (!headers.includes('Termék neve')) {
                headers.push('Termék neve');
            }
            
            setPreviewData({
                headers,
                rows: rowsWithNames
            });
            },
            error: (error) => {
            console.error("Hiba a CSV fájl feldolgozása során:", error);
            setError("A CSV fájl formátuma nem megfelelő.");
            }
    });
      } else if (['xlsx', 'xls'].includes(fileExt)) {
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length > 0) {
              const headers = [...jsonData[0], 'Termék neve'];
              const rows = jsonData.slice(1, 11);
              
              
              const termekIds = rows.map(row => row[0]).filter(id => id);
              
              
              const termekMap = await fetchTermekData(termekIds);
              
              
              const rowsWithNames = rows.map(row => {
                const rowData = {};
                headers.forEach((header, index) => {
                  if (index < row.length) {
                    rowData[header] = row[index];
                  }
                });
                
                
                const termekId = row[0];
                rowData['Termék neve'] = termekMap[termekId] || 'Ismeretlen termék';
                
                return rowData;
              });
              
              setPreviewData({
                headers,
                rows: rowsWithNames
              });
            } else {
              setError("A fájl nem tartalmaz adatokat.");
            }
          } catch (error) {
            console.error("Hiba az Excel fájl feldolgozása során:", error);
            setError("Az Excel fájl formátuma nem megfelelő.");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError("Nem támogatott fájlformátum. Csak CSV és Excel fájlok tölthetők fel.");
      }
    } catch (error) {
      console.error("Hiba a fájl előnézetének generálása során:", error);
      setError("Nem sikerült előnézetet generálni a fájlból.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setPreviewData(null);
      
      
      parseFileForPreview(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Kérjük, válasszon ki egy fájlt a feltöltéshez.");
      return;
    }

    if (!raktar) {
      setError("Kérjük, válasszon mozgóboltot.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('raktar', raktar);

      const response = await fetch("http://localhost:3000/api/napi-fogyas/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Hiba történt a fájl feltöltése során.");
      }

      setSuccess(true);
      setFile(null);
      setPreviewData(null);
      
      document.getElementById('fileInput').value = "";
    } catch (error) {
      console.error("Hiba a fájl feltöltése során:", error);
      setError(error.message || "Hiba történt a fájl feltöltése során. Kérjük, próbálja újra később.");
    } finally {
      setLoading(false);
    }
  };

  
  const closePreview = () => {
    setPreviewData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center overflow-hidden h-10">
            <a href="/" className="text-white hover:text-gray-200 flex items-center">
              <img 
                src="/public/vándorbolt.png" 
                alt="VándorBolt Logo" 
                className={`h-16 -my-3 mr-3 transition-all duration-1000 ease-in-out transform ${
                  logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
              />
              <h1 
                className={`text-2xl font-bold transition-all duration-1000 ease-in-out transform ${
                  logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
              >
                Vándorbolt
              </h1>
            </a>
          </div>
        </div>
      </header>
      
      
      <nav className="bg-red-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto whitespace-nowrap py-3 gap-6 text-sm font-medium">
            <li><a href="/" className="hover:text-gray-200">KEZDŐLAP</a></li>
            <li><a href="/info" className="hover:text-gray-200">BEMUTATKOZÁS</a></li>
            <li><a href="/tutorial" className="hover:text-gray-200">RENDELÉS MENETE</a></li>
            <li><a href="/account" className="text-white font-bold border-b-2 border-white">FIÓKOM</a></li>
            <li><a href="/sales" className="hover:text-gray-200">AKCIÓK</a></li>
            <li><a href="/utvonal" className="hover:text-gray-200">TELEPÜLÉSEK</a></li>
            <li><a href="/StaticKapcsolat" className="hover:text-gray-200">KAPCSOLAT</a></li>
          </ul>
        </div>
      </nav>

      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/account')} 
              className="flex items-center text-gray-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Vissza a fiókomhoz</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-auto">Napi fogyás rögzítése</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
              <p className="text-gray-600 mb-6">
                Ezen az oldalon töltheti fel a napi fogyás adatait tartalmazó fájlt. A rendszer automatikusan feldolgozza és rögzíti az adatokat.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <p className="text-green-700">A fájl sikeresen feltöltve és feldolgozva!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="raktar" className="block text-sm font-medium text-gray-700 mb-1">
                    Mozgóbolt
                  </label>
                  <select
                    id="raktar"
                    value={raktar}
                    onChange={(e) => setRaktar(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Válasszon mozgóboltot</option>
                    {raktarak.map((raktar) => (
                      <option key={raktar.azonosito} value={raktar.azonosito}>
                        {raktar.rendszam}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-1">
                    Fájl kiválasztása
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="fileInput"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none"
                        >
                          <span>Fájl kiválasztása</span>
                          <input
                            id="fileInput"
                            name="file"
                            type="file"
                            className="sr-only"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">vagy húzza ide</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV vagy Excel fájl (max. 10MB)
                      </p>
                      {file && (
                        <p className="text-sm text-gray-800 font-medium mt-2">
                          Kiválasztott fájl: {file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                
                {previewData && (
                  <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Fájl előnézet (max. 10 sor)</h3>
                      <button 
                        type="button"
                        onClick={closePreview}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {previewData.headers.map((header, index) => (
                              <th 
                                key={index}
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previewData.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {previewData.headers.map((header, colIndex) => (
                                <td 
                                  key={colIndex}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                  {row[header]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading || !file || !raktar}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                      (loading || !file || !raktar) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Feltöltés folyamatban...' : 'Feltöltés'}
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Útmutató</h2>
                <div className="prose prose-sm text-gray-500">
                  <p>A napi fogyás adatokat CSV vagy Excel formátumban töltheti fel. A fájlnak a következő oszlopokat kell tartalmaznia:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Termék azonosító</strong> - A termék egyedi azonosítója</li>
                    <li><strong>Mennyiség</strong> - Az eladott mennyiség</li>
                  </ul>
                  
                  <p className="mt-4">Példa a fájl formátumára:</p>
                  <div className="bg-gray-50 p-4 rounded-md mt-2 overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Termék azonosító</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mennyiség</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500">1</td>
                          <td className="px-4 py-2 text-sm text-gray-500">5</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500">2</td>
                          <td className="px-4 py-2 text-sm text-gray-500">10</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500">3</td>
                          <td className="px-4 py-2 text-sm text-gray-500">2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-gray-600 mt-4">
                    A rendszer a termék azonosítója alapján fogja azonosítani a termékeket. A mennyiség az eladott darabszámot jelenti.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">VándorBolt</h3>
              <p className="text-sm">Minőségi élelmiszerek széles választéka, gyors kiszállítással az Ön otthonába.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kapcsolat</h3>
              <address className="not-italic text-sm">
                <p>1234 Budapest, Példa utca 123.</p>
                <p>Email: info.vandorboltwebaruhaz@gmail.com</p>
                <p>Telefon: +36 1 234 5678</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Információk</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/aszf" className="hover:underline">
                    Általános Szerződési Feltételek
                  </a>
                </li>
                <li>
                  <a href="/adatvedelem" className="hover:underline">
                    Adatvédelmi Tájékoztató
                  </a>
                </li>
                <li>
                  <a href="/utvonal" className="hover:underline">
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
            <p>© 2025 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
