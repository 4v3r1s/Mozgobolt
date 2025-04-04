import { useEffect, useState } from "react";
import { Button } from "../orderpage/Button";

export default function info() {
  const [towns, setTowns] = useState([]);
  const [logoAnimated, setLogoAnimated] = useState(false);

  // Animáció indítása késleltetéssel az oldal betöltése után
  useEffect(() => {
    // Kis késleltetés, hogy biztosan látható legyen az animáció
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - animált MozgoShop felirattal és logóval */}
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
      {/* Navigation */}      <nav className="bg-red-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto whitespace-nowrap py-3 gap-6 text-sm font-medium">
            <li>
              <a href="/" className="hover:text-gray-200">
                KEZDŐLAP
              </a>
            </li>
            <li>
              <a href="/info" className="text-white font-bold border-b-2 border-white">
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

      {/* Bemutatkozás cím */}
      <div className="container mx-auto text-center py-6">
        <h1 className="text-2xl font-bold">Bemutatkozás</h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rólunk</h2>
            <p className="mb-4">
              Üdvözöljük a MozgoShop világában! Engedje meg, hogy bemutatkozzunk és megosszuk Önnel történetünket, küldetésünket és céljainkat.
            </p>
            <p className="mb-4">
              A MozgoShop mögött két elhivatott fiatal vállalkozó áll: Igazi Kristóf Tamás és Hamza Richárd. 2025-ben álmodtuk meg és hoztuk létre ezt az innovatív mozgóbolt-rendszert, amely egy egyszerű, mégis hatékony megoldást kínál a vidéki közösségek számára. Bár fiatalok vagyunk, hiszünk abban, hogy a jó ötletek és a kemény munka révén semmi sem lehetetlen. Ez a weboldal és maga a MozgoShop is ennek az elkötelezettségnek az eredménye.
            </p>
        </div>

        {/* Küldetésünk rész */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Küldetésünk</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              A MozgoShop megszületésének legfőbb célja az volt, hogy friss és minőségi élelmiszereket juttassunk el azokhoz, akik számára a bevásárlás nehézséget jelent. Különösen fontosnak tartjuk a vidéki településeken élők és az idősebb generáció támogatását, hiszen sokan közülük nem tudnak rendszeresen eljutni a nagyobb bevásárlóközpontokba.
            </p>
            <p className="mb-4">
              Rendszeresen közlekedő mozgóboltunk megbízható menetrend szerint látogatja a környező falvakat, biztosítva ezzel a kényelmes és kiszámítható vásárlási lehetőséget. Széles termékkínálattal rendelkezünk, amelyet folyamatosan bővítünk a helyi igényeknek megfelelően.
            </p>
          </div>
        </div>

        {/* Miért választanak minket rész */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Miért választanak minket?</h2>
          <div className="prose max-w-none">
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2"><strong>Kényelem:</strong> Vásárlóinknak nem kell hosszú utakat megtenniük az alapvető élelmiszerekért.</li>
              <li className="mb-2"><strong>Megbízhatóság:</strong> Rendszeres és pontos kiszállítás, előre meghatározott időpontokban.</li>
              <li className="mb-2"><strong>Minőség:</strong> Friss, gondosan válogatott termékek, amelyeket közvetlenül házhoz vagy a települések központjába szállítunk.</li>
              <li className="mb-2"><strong>Közösségépítés:</strong> Számunkra a helyi közösségek támogatása kiemelten fontos. Célunk, hogy személyes kapcsolatot alakítsunk ki vásárlóinkkal, és igazodjunk az igényeikhez.</li>
            </ul>
          </div>
        </div>

        {/* Jövőképünk rész */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Jövőképünk</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              Büszkék vagyunk arra, hogy a MozgoShop rövid idő alatt a vidéki közösségek meghatározó részévé vált. Hiszünk abban, hogy ez a szolgáltatás hozzájárul az emberek komfortérzetének növeléséhez és életminőségük javításához. Terveink között szerepel szolgáltatásunk továbbfejlesztése és kiterjesztése, hogy még több települést érhessünk el és még szélesebb termékkínálattal szolgálhassuk ki vásárlóinkat.
            </p>
            <p className="mb-4">
              Ha Ön is szeretne egy megbízható, kényelmes és minőségi szolgáltatás részese lenni, várjuk szeretettel mozgóboltunkban!
            </p>
            <p className="font-medium text-center text-red-700">
              📍 MozgoShop – Friss élelmiszer, közvetlenül az otthonába!
            </p>
          </div>
        </div>

        {/* Képrészek a szöveg alatt */}
        <div className="py-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Első képrész */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Cégünk logója</h3>
              <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src="/public/logo2.png" 
                  alt="MozgoShop logó" 
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            </div>
            
            {/* Második képrész */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Csapatunk</h3>
              <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/mozgobolt.jpg" 
                  alt="Mozgóbolt" 
                  className="object-contain max-h-full max-w-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/public/Forza.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <p>© 2025 MozgoShop. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
