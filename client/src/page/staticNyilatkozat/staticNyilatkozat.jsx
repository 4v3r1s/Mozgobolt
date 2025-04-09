import React from "react";

export default function Adatvedelem() {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Adatvédelmi Tájékoztató</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Hatályos: 2023. január 1-től
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Bevezetés</h2>
            <p className="mb-4">
              A VándorBolt Kft. (továbbiakban: Adatkezelő) számára kiemelt fontosságú a személyes adatok védelme. Jelen Adatvédelmi Tájékoztató (továbbiakban: Tájékoztató) célja, hogy tájékoztassa a webáruház felhasználóit az adatkezelési gyakorlatunkról.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Az adatkezelő adatai</h2>
            <p className="mb-4">
              <strong>Cégnév:</strong> VándorBolt Kft.<br />
              <strong>Székhely:</strong> 1234 Budapest, Példa utca 123.<br />
              <strong>Adószám:</strong> 12345678-1-42<br />
              <strong>Cégjegyzékszám:</strong> 01-09-123456<br />
              <strong>E-mail:</strong> info.vandorboltwebaruhaz@gmail.com<br />
              <strong>Telefonszám:</strong> +36 1 234 5678
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. A kezelt adatok köre</h2>
            <p className="mb-4">
              Az Adatkezelő a következő személyes adatokat kezeli:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Regisztráció során: név, e-mail cím, telefonszám, jelszó</li>
              <li>Vásárlás során: szállítási cím, számlázási cím</li>
              <li>Hírlevél feliratkozás esetén: név, e-mail cím</li>
              <li>Hírlevél feliratkozás esetén: név, e-mail cím</li>
              <li>Automatikusan gyűjtött adatok: IP cím, böngésző típusa, látogatás időpontja, megtekintett oldalak</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Az adatkezelés célja</h2>
            <p className="mb-4">
              Az adatkezelés célja a webáruház szolgáltatásainak nyújtása, a megrendelések teljesítése, a felhasználókkal való kapcsolattartás, valamint jogszabályi kötelezettségek teljesítése.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Az adatkezelés jogalapja</h2>
            <p className="mb-4">
              Az adatkezelés jogalapja lehet:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Az érintett hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont)</li>
              <li>Szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont)</li>
              <li>Jogi kötelezettség teljesítése (GDPR 6. cikk (1) bekezdés c) pont)</li>
              <li>Az adatkezelő jogos érdeke (GDPR 6. cikk (1) bekezdés f) pont)</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Az adatkezelés időtartama</h2>
            <p className="mb-4">
              A személyes adatokat az adatkezelés céljának fennállásáig, illetve a felhasználó hozzájárulásának visszavonásáig kezeljük. A számviteli bizonylatokat a számvitelről szóló 2000. évi C. törvény 169. § alapján 8 évig őrizzük meg.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Adatfeldolgozók</h2>
            <p className="mb-4">
              Az Adatkezelő a webáruház működtetése során az alábbi adatfeldolgozókat veszi igénybe:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Tárhelyszolgáltató: [Szolgáltató neve és elérhetősége]</li>
              <li>Futárszolgálat: [Szolgáltató neve és elérhetősége]</li>
              <li>Fizetési szolgáltató: [Szolgáltató neve és elérhetősége]</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Cookie-k (sütik) használata</h2>
            <p className="mb-4">
              A webáruház cookie-kat használ a felhasználói élmény javítása érdekében. A cookie-k kis adatcsomagok, amelyeket a böngésző tárol a felhasználó eszközén. A cookie-k használatáról részletes tájékoztatást a Cookie Szabályzatunkban talál.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Az érintettek jogai</h2>
            <p className="mb-4">
              Az érintettek az alábbi jogokkal rendelkeznek:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Tájékoztatáshoz való jog</li>
              <li>Hozzáféréshez való jog</li>
              <li>Helyesbítéshez való jog</li>
              <li>Törléshez való jog (elfeledtetéshez való jog)</li>
              <li>Az adatkezelés korlátozásához való jog</li>
              <li>Adathordozhatósághoz való jog</li>
              <li>Tiltakozáshoz való jog</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. Adatbiztonság</h2>
            <p className="mb-4">
              Az Adatkezelő megfelelő technikai és szervezési intézkedéseket alkalmaz a személyes adatok biztonsága érdekében, beleértve a fizikai, informatikai és adminisztratív intézkedéseket.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">11. Jogorvoslati lehetőségek</h2>
            <p className="mb-4">
              Az érintett a jogainak megsértése esetén az Adatkezelő ellen bírósághoz fordulhat, vagy kérheti a Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH) segítségét is.
            </p>
            <p className="mb-4">
              <strong>NAIH elérhetőségei:</strong><br />
              Cím: 1055 Budapest, Falk Miksa utca 9-11.<br />
              Postacím: 1363 Budapest, Pf.: 9.<br />
              Telefon: +36 1 391 1400<br />
              E-mail: ugyfelszolgalat@naih.hu<br />
              Weboldal: https://naih.hu/
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">12. Záró rendelkezések</h2>
            <p className="mb-4">
              Jelen Adatvédelmi Tájékoztató 2023. január 1-től hatályos. Az Adatkezelő fenntartja a jogot, hogy a Tájékoztatót egyoldalúan módosítsa. A módosításról az Adatkezelő a webáruház felületén tájékoztatja a felhasználókat.
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

