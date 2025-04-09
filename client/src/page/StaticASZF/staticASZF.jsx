import React from "react";

export default function ASZF() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <img src="/public/vándorbolt.png" alt="VándorBolt Logo" className="h-16 -my-2 mr-3" />
              <h1 className="text-2xl font-bold">Vándorbolt</h1>
            </div>
          </div>
        </div>
      </header>

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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Általános Szerződési Feltételek</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Hatályos: 2023. január 1-től
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Általános rendelkezések</h2>
            <p className="mb-4">
              Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) tartalmazza a VándorBolt webáruház (továbbiakban: Szolgáltató) által nyújtott szolgáltatások igénybevételének feltételeit.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Szolgáltató adatai</h2>
            <p className="mb-4">
              <strong>Cégnév:</strong> VándorBolt Kft.<br />
              <strong>Székhely:</strong> 1234 Budapest, Példa utca 123.<br />
              <strong>Adószám:</strong> 12345678-1-42<br />
              <strong>Cégjegyzékszám:</strong> 01-09-123456<br />
              <strong>E-mail:</strong> info.vandorboltwebaruhaz@gmail.com<br />
              <strong>Telefonszám:</strong> +36 1 234 5678
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. A webáruház használata</h2>
            <p className="mb-4">
              A webáruházban történő vásárlás elektronikus úton leadott megrendeléssel lehetséges, a jelen ÁSZF-ben meghatározott módon. A webáruház szolgáltatásait bárki jogosult igénybe venni, amennyiben magára nézve kötelezőnek ismeri el a jelen ÁSZF-ben foglaltakat.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Megrendelés</h2>
            <p className="mb-4">
              A megrendelés leadása regisztrált felhasználóként lehetséges. A termék kiválasztását követően a "Kosárba" gombra kattintva helyezheti a terméket a kosárba. A kosár tartalmát a "Kosár" menüpont alatt tekintheti meg. Itt lehetősége van a kosár tartalmának módosítására, törlésére.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Fizetési és szállítási feltételek</h2>
            <p className="mb-4">
              A megrendelt termékek kiszállítása a VándorBolt járataival történik a megadott címre. A fizetés történhet készpénzben az áru átvételekor vagy előre utalással.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Elállási jog</h2>
            <p className="mb-4">
              A fogyasztó a termék kézhezvételétől számított 14 napon belül jogosult indokolás nélkül elállni a szerződéstől. Az elállási jog gyakorlásának menete a következő: [részletes leírás].
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Jótállás, szavatosság</h2>
            <p className="mb-4">
              A Szolgáltató a jogszabályok által előírt jótállási és szavatossági kötelezettségeknek eleget tesz. A jótállás időtartama a jogszabályban előírt időtartam.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Panaszkezelés</h2>
            <p className="mb-4">
              A fogyasztó a termékkel vagy a Szolgáltató tevékenységével kapcsolatos fogyasztói kifogásait az alábbi elérhetőségeken terjesztheti elő: [elérhetőségek].
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Záró rendelkezések</h2>
            <p className="mb-4">
              Jelen ÁSZF a webáruházban történő közzétételtől hatályos és visszavonásig érvényes. A Szolgáltató jogosult egyoldalúan módosítani az ÁSZF-et. A módosításokat a Szolgáltató azok hatályba lépése előtt 11 (tizenegy) nappal a webáruházban közzéteszi.
            </p>
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
