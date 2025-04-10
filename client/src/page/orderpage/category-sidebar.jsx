import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"


const staticCategories = [
  { azonosito: 1, nev: "Pékáruk", termekCount: 42 },
  { azonosito: 2, nev: "Tej-Tejtermékek-Margarinok", termekCount: 68 },
  { azonosito: 3, nev: "Hentesáru", termekCount: 54 },
  { azonosito: 4, nev: "Alapvető élelmiszerek", termekCount: 87 },
  { azonosito: 5, nev: "Befőttek-Savanyúságok", termekCount: 32 },
  { azonosito: 6, nev: "Konzervek-Ízesítők", termekCount: 45 },
  { azonosito: 7, nev: "Fűszerek-Alapporok", termekCount: 29 },
  { azonosito: 8, nev: "Kávé-Tea-Kakaó", termekCount: 38 },
  { azonosito: 9, nev: "Sütési alapanyagok", termekCount: 41 },
];

export default function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/csoport/with-counts');
        if (!response.ok) {
          throw new Error('Hálózati hiba történt');
        }
        const data = await response.json();
        
        
        
        setCategories(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    
    const newSearchParams = new URLSearchParams(location.search);
    
    if (categoryId) {
      newSearchParams.set('category', categoryId);
    } else {
      newSearchParams.delete('category');
    }
    
    
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };
  
  if (loading) {
    return (
      <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Kategóriák</h2>
        <p className="text-gray-500">Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Kategóriák</h2>
      <ul className="space-y-2">
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClick(null);
            }}
            className={`flex items-center justify-between py-2 px-3 text-sm ${
              !currentCategory 
                ? "bg-red-50 text-red-700 font-medium" 
                : "text-gray-700 hover:bg-gray-50 hover:text-red-700"
            } rounded-md transition-colors`}
          >
            <span className="line-clamp-1">Összes termék</span>
            <div className="flex items-center">
              
              <span className="text-xs text-gray-500 mr-1">
                ({categories.reduce((total, cat) => total + (cat.termekCount || 0), 0)})
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </a>
        </li>
        {Array.isArray(categories) && categories.map((category) => (
          <li key={category.azonosito}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                
                handleCategoryClick(category.csoport);
              }}
              className={`flex items-center justify-between py-2 px-3 text-sm ${
                currentCategory === category.csoport.toString() 
                  ? "bg-red-50 text-red-700 font-medium" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-red-700"
              } rounded-md transition-colors`}
            >
              <span className="line-clamp-1">{category.nev}</span>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">({category.termekCount})</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
