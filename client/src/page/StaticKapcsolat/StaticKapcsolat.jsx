import { useEffect, useState } from "react";
import { Button } from "../orderpage/Button";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-700 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Kapcsolat</h1>
          <nav className="mt-4">
            <ul className="flex justify-center space-x-6">
              <li><Link to="/home" className="text-white hover:underline">Főoldal</Link></li>
              <li><Link to="/StaticKapcsolat" className="text-white hover:underline">Kapcsolat</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <img src="/images/contact1.jpg" alt="Contact Office" className="rounded-lg shadow-lg w-full" />
          <img src="/images/contact2.jpg" alt="Customer Service" className="rounded-lg shadow-lg w-full" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Lépjen kapcsolatba velünk</h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Név</label>
              <input 
                type="text" 
                id="name" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Teljes név"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="pelda@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">Telefonszám</label>
              <input 
                type="tel" 
                id="phone" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="+36 30 123 4567"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-gray-700 mb-1">Tárgy</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Üzenet tárgya"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gray-700 mb-1">Üzenet</label>
              <textarea 
                id="message" 
                rows="4" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Írja le üzenetét..."
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition-colors"
            >
              Üzenet küldése
            </button>
          </form>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Elérhetőségeink</h3>
              <p className="text-gray-700">Email: info@mozgoshop.hu</p>
              <p className="text-gray-700">Telefon: +36 1 234 5678</p>
              <p className="text-gray-700">Cím: 1234 Budapest, Példa utca 1.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Nyitvatartás</h3>
              <p className="text-gray-700">Hétfő - Péntek: 8:00 - 17:00</p>
              <p className="text-gray-700">Szombat: 9:00 - 13:00</p>
              <p className="text-gray-700">Vasárnap: Zárva</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gyakran Ismételt Kérdések</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Hogyan követhetem a rendelésemet?</h3>
              <p className="text-gray-700">A rendelés visszaigazoló emailben található követési számmal nyomon követheti csomagja útját.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Mennyi a szállítási idő?</h3>
              <p className="text-gray-700">A szállítási idő általában 2-3 munkanap, de ez függ a célállomástól és a rendelés időpontjától.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Van lehetőség személyes átvételre?</h3>
              <p className="text-gray-700">Igen, a megadott településeken lehetőség van személyes átvételre előre egyeztetett időpontban.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-red-700 text-white mt-12 py-4 text-center">
        <p className="text-sm">© 2025 MozgoShop. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}
