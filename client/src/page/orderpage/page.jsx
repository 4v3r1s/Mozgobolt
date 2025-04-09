import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./input";
import ProductCard from "./product-card";
import CategorySidebar from "./category-sidebar";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [sortOption, setSortOption] = useState("default"); 
  const productsPerPage = 8;
  
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');

  
  useEffect(() => {
    
    updateCartCount();
    
    
    window.addEventListener('storage', updateCartCount);
    
    
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalItems);
      } catch (error) {
        console.error("Hiba a kosár betöltésekor:", error);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  };

  
  useEffect(() => {
    // Kategória váltáskor visszaállítjuk a rendezési opciót és az oldalszámot
    setSortOption("default");
    setCurrentPage(1);
    
    const fetchProducts = async () => {
      try {
       
        const response = await fetch("http://localhost:3000/termek");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        
        const formattedProducts = data.map(product => {
          
          const discount = product.akciosar ? 
            Math.round(((product.ar - product.akciosar) / product.ar) * 100) : 0;
            
          
          const currentDate = new Date();
          const startDate = product.akcio_eleje ? new Date(product.akcio_eleje) : null;
          const endDate = product.akcio_vege ? new Date(product.akcio_vege) : null;
          const isPromoActive = startDate && endDate && 
            currentDate >= startDate && currentDate <= endDate && 
            product.akciosar && parseFloat(product.akciosar) > 0;
            
          return {
            id: product.azonosito,
            name: product.nev,
            price: parseFloat(product.ar),
            originalPrice: isPromoActive ? parseFloat(product.ar) : null,
            discount: isPromoActive ? discount : 0,
            discountPrice: isPromoActive ? parseFloat(product.akciosar) : null,
            description: product.termekleiras,
            image: product.hivatkozas,
            kepUrl: product.kepUrl,
            category: product.csoport,
            stock: product.keszlet,
            unit: product.kiszereles,
            unitPrice: parseFloat(product.egysegnyiar),
            discountUnitPrice: product.akcios_egysegnyiar ? parseFloat(product.akcios_egysegnyiar) : null,
            akcio_eleje: product.akcio_eleje,
            akcio_vege: product.akcio_vege,
            isAdult: product.tizennyolc ? true : false,
            vat: product.afa_kulcs,
            size: product.meret,
            color: product.szin,
            barcode: product.vonalkod
          };
        });

        setProducts(formattedProducts || []);
        
       
        filterProductsByCategory(formattedProducts, currentCategory, searchQuery);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, searchQuery]); 
  
  const sortProducts = (products, option) => {
    const sortedProducts = [...products];
    
    switch (option) {
      case "price-asc":
        return sortedProducts.sort((a, b) => {
          
          const priceA = a.discountPrice !== null ? a.discountPrice : a.price;
          const priceB = b.discountPrice !== null ? b.discountPrice : b.price;
          return priceA - priceB;
        });
      
      case "price-desc":
        return sortedProducts.sort((a, b) => {
          const priceA = a.discountPrice !== null ? a.discountPrice : a.price;
          const priceB = b.discountPrice !== null ? b.discountPrice : b.price;
          return priceB - priceA;
        });
      
      case "name-asc":
        return sortedProducts.sort((a, b) => 
          a.name.localeCompare(b.name, 'hu', { sensitivity: 'base' })
        );
      
      case "name-desc":
        return sortedProducts.sort((a, b) => 
          b.name.localeCompare(a.name, 'hu', { sensitivity: 'base' })
        );
      
      default:
        return sortedProducts; 
    }
  };

  const filterProductsByCategory = (allProducts, categoryId, query) => {
    console.log("Szűrési paraméterek:", { 
      categoryId, 
      query, 
      categoryIdType: typeof categoryId 
    });
    
    let filtered = [...allProducts];
    
   
    if (categoryId) {
      console.log("Szűrés kategória alapján:", categoryId);
      
      
      console.log("Termékek kategória értékei:", 
        allProducts.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          categoryType: typeof p.category
        }))
      );
      
      filtered = filtered.filter(product => {
        const match = product.category && product.category.toString() === categoryId.toString();
        
        
        if (match) {
          console.log(`Kategória egyezés: ${product.name} - Kategória: ${product.category} = ${categoryId}`);
        }
        
        return match;
      });
      
      console.log(`Szűrés eredménye: ${filtered.length} termék`);
    }
    

    if (query && query.trim() !== "") {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
      console.log(`Szűrés keresés alapján: "${query}", találatok: ${filtered.length}`);
    }
    

    const sortedFiltered = sortProducts(filtered, sortOption);
    
    setFilteredProducts(sortedFiltered);
  };
  
 
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    
    
    const sortedProducts = sortProducts(filteredProducts, newSortOption);
    setFilteredProducts(sortedProducts);
  };
    

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchInfo(query.trim() !== "");
    setCurrentPage(1); 

   
    filterProductsByCategory(products, currentCategory, query);
  };

  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
  };


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

 
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    
    window.scrollTo({
      top: document.querySelector('.grid')?.offsetTop - 100 || 0,
      behavior: 'smooth'
    });
  };

  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

 
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

 
  const getPaginationButtons = () => {
    const pageButtons = [];

    
    pageButtons.push(
      <Button
        key={1}
        variant="outline"
        size="sm"
        className={`h-8 w-8 ${currentPage === 1 ? 'bg-red-700 text-white border-red-700' : ''}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>
    );

    
    if (totalPages > 5 && currentPage > 3) {
      pageButtons.push(
        <span key="ellipsis1" className="px-2">...</span>
      );
    }

    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    
    if (currentPage > totalPages - 3) {
      startPage = Math.max(2, totalPages - 3);
    }

   
    if (currentPage < 4) {
      endPage = Math.min(totalPages - 1, 4);
    }

    
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          className={`h-8 w-8 ${currentPage === i ? 'bg-red-700 text-white border-red-700' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    
    if (totalPages > 5 && currentPage < totalPages - 2) {
      pageButtons.push(
        <span key="ellipsis2" className="px-2">...</span>
      );
    }

    
    if (totalPages > 1) {
      pageButtons.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          className={`h-8 w-8 ${currentPage === totalPages ? 'bg-red-700 text-white border-red-700' : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-red-600">
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center">
                <img src="/public/vándorbolt.png" alt="VándorBolt Logo" className="h-16 -my-2 mr-3" />
                <h1 className="text-2xl font-bold">Vándorbolt</h1>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input
                  placeholder="Keresés..."
                  className="w-full pl-4 pr-10 py-2 rounded-lg border-0 focus-visible:ring-2 focus-visible:ring-red-500 text-black"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoComplete="off"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <Search className="h-5 w-5 text-gray-500" />
                </button>
              </form>
            </div>
            <div className="flex items-center space-x-3">
                            <a href="/account" className="text-white hover:bg-red-600 p-2 rounded-full inline-flex items-center justify-center">
                <User className="h-5 w-5" />
              </a>
              <a href="/cart" className="text-white hover:bg-red-600 p-2 rounded-full inline-flex items-center justify-center relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-red-700 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </a>
            </div>
          </div>

          <div className="mt-4 md:hidden relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                placeholder="Keresés..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border-0 text-black"
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <Search className="h-5 w-5 text-gray-500" />
              </button>
            </form>
          </div>
        </div>
      </header>

         
          <nav className="bg-red-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto whitespace-nowrap py-3 gap-6 text-sm font-medium">
            <li>
              <a href="/" className="text-white font-bold border-b-2 border-white">
                KEZDŐLAP
              </a>
            </li>
            <li>
              <a href="/info" className="hover:text-gray-200">
              BEMUTATKOZÁS
              </a>
            </li>
            <li>
              <a href="/tutorial" className="hover:text-gray-200">
                RENDELÉS MENETE
              </a>
            </li>
            <li>
              <a href="/account" className="hover:text-gray-200">
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

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
         
          <CategorySidebar />

         
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">             
              <h2 className="text-2xl font-bold text-gray-800">
                {currentCategory ? "Kategória termékei" : "Shop"}
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  {loading ? "Betöltés..." :
                    filteredProducts.length === 0 ? "0 termék" :
                      `${indexOfFirstProduct + 1}–${Math.min(indexOfLastProduct, filteredProducts.length)} termék, összesen ${filteredProducts.length} db`
                  }
                </span>
                <select 
                  className="border rounded-md px-3 py-1.5 text-sm bg-white"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="default">Alapértelmezett rendezés</option>
                  <option value="price-asc">Ár szerint növekvő</option>
                  <option value="price-desc">Ár szerint csökkenő</option>
                  <option value="name-asc">Név szerint A-Z</option>
                  <option value="name-desc">Név szerint Z-A</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Termékek betöltése...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-700 text-lg mb-2">Nincs találat a keresési feltételekre:</p>
                {searchQuery && <p className="font-bold text-xl mb-2">"{searchQuery}"</p>}
                {currentCategory && <p className="text-gray-600">A kiválasztott kategóriában</p>}
                <button
                  onClick={() => { 
                    setSearchQuery(""); 
                    setFilteredProducts(products); 
                    setShowSearchInfo(false); 
                  }}
                  className="mt-4 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
                >
                  Keresés törlése
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            
            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Előző oldal</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>

                  
                  {getPaginationButtons()}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Következő oldal</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </nav>
              </div>
            )}
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