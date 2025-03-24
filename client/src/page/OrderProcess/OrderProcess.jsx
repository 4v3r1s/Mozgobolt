import React from "react";

export default function OrderProcess() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">MozgoShop</h1>
            </div>
            <div className="flex items-center space-x-3">
              <a href="/" className="text-white hover:bg-red-600 px-4 py-2 rounded">
                Vissza a főoldalra
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-red-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto whitespace-nowrap py-3 gap-6 text-sm font-medium">
            <li>
              <a href="/" className="hover:text-gray-200">
                KEZDŐLAP
              </a>
            </li>
            <li>
              <a href="/info" className="hover:text-gray-200">
                BEMUTATKOZÁS
              </a>
            </li>
            <li>
              <a href="/order-process" className="text-white font-bold border-b-2 border-white">
                RENDELÉS MENETE
              </a>
            </li>
            <li>
              <a href="/account" className="hover:text-gray-200">
                FIÓKOM
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-700 text-white py-4 px-6">
              <h1 className="text-2xl font-bold">Rendelés menete</h1>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Hogyan működik a rendelés?</h2>
                <p className="text-gray-600">
                  A MozgoShop-nál egyszerűen és kényelmesen rendelheti meg kedvenc termékeit. Az alábbiakban részletesen bemutatjuk a rendelés folyamatát.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-red-700 pl-4 py-2">
                  <h3 className="text-lg font-medium text-gray-800">1. Termékek kiválasztása</h3>
                  <p className="text-gray-600 mt-2">
                    Böngésszen termékeink között, és adja hozzá a kosárhoz azokat, amelyeket meg szeretne vásárolni. A termék oldalán megadhatja a kívánt mennyiséget is.
                  </p>
                </div>

                <div className="border-l-4 border-red-700 pl-4 py-2">
                  <h3 className="text-lg font-medium text-gray-800">2. Kosár ellenőrzése</h3>
                  <p className="text-gray-600 mt-2">
                    A kosár ikonra kattintva ellenőrizheti a kiválasztott termékeket, módosíthatja a mennyiségeket, vagy eltávolíthat termékeket.
                  </p>
                </div>

                <div className="border-l-4 border-red-700 pl-4 py-2">
                  <h3 className="text-lg font-medium text-gray-800">3. Szállítási adatok megadása</h3>
                  <p className="text-gray-600 mt-2">
                    Adja meg a szállítási címet és a kapcsolattartási adatokat. Ha már regisztrált felhasználó, ezek az adatok automatikusan betöltődnek.
                  </p>
                </div>

                <div className="border-l-4 border-red-700 pl-4 py-2">
                  <h3 className="text-lg font-medium text-gray-800">4. Szállítási mód kiválasztása</h3>
                  <p className="text-gray-600 mt-2">
                    Válassza ki a kívánt szállítási módot. A MozgoShop több településre biztosít házhozszállítást, a szállítási díjak a távolság és a rendelés értéke alapján változhatnak.
                  </p>
                </div>

                <div className="border-l-4 border-red-700 pl-4 py-2">
                  <h3 className="text-lg font-medium text-gray-800">5. Fizetési mód kiválasztása</h3>
                  <p className="text-gray-600 mt-2">
                    Válassza ki a kívánt fizetési módot. Lehetőség van online bankkártyás fizetésre vagy utánvétre.
                  </p>
                </div>

                <div className="border-l-4 border-red-700 pl-4 py-2">
                  <h3 className="text-lg font-medium text-gray-800">6. Rendelés véglegesítése</h3>
                  <p className="text-gray-600 mt-2">
                    Ellenőrizze a megadott adatokat és a rendelés részleteit, majd kattintson a "Rendelés véglegesítése" gombra.
                  </p>
                </div>

                <div className="border-l-4 border-red-700 pl-4 py-2">
                  <h3 className="text-lg font-medium text-gray-800">7. Visszaigazolás</h3>
                  <p className="text-gray-600 mt-2">
                    A rendelés leadása után e-mailben visszaigazolást küldünk a rendelés részleteiről és a várható szállítási időről.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Fontos információk</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>A rendeléseket általában 1-3 munkanapon belül szállítjuk ki.</li>
                  <li>10.000 Ft feletti rendelés esetén a szállítás ingyenes.</li>
                  <li>Kérdés esetén hívja ügyfélszolgálatunkat a +36 1 234 5678 telefonszámon.</li>
                  <li>A rendelés állapotát a fiókjában nyomon követheti.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

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
            <p>© 2023 MozgoShop. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
