# Vándorbolt - Mozgóbolt és Admin Panel

**VándorBolt egy online mozgóbolt rendszer, amely lehetővé teszi a vásárlók számára, hogy egyszerűen böngésszenek és vásároljanak különböző termékeket, miközben az adminok számára biztosít egy admin felületet a termékek, rendelések és felhasználók kezelésére, illetve az alkalmazottaknak a napi fogyás rögzitése.

## Funkciók

### Vásárlói Funkciók:
- **Termékek böngészése**: Vásárlók könnyedén böngészhetnek az elérhető termékek között.
- **Kosár és rendeléskezelés**: Vásárlók hozzáadhatják a termékeket a kosarukhoz, majd leadhatják rendelésüket.
- **Felhasználói fiók kezelés**: Vásárlók regisztrálhatnak, bejelentkezhetnek, és módosíthatják adataikat.

### Alkalmazott Funkciók:
- a mozgóbolton történő napifogyás rögzitése , kezelése.

### Admin Panel Funkciók:
- **Termékek kezelése**: Adminok hozzáadhatják, módosíthatják vagy törölhetik a termékeket a kínálatból, illetve akciót is tudnak állítani.
- **Kosár és rendeléskezelés**: Adminok nyomon követhetik és kezelhetik a vásárlók rendeléseit, frissíthetik azok státuszát.
- **Felhasználók kezelése**: Adminok kezelhetik a regisztrált felhasználók adatait, illetve jogosultságokat adhatnak és vonhatnak meg.

## Telepítés

A projekt Docker környezetben futtatható, amely biztosítja a környezetek közötti kompatibilitást és egyszerű telepítést.

### Előfeltételek

- **Docker** és **Docker Compose** illetve adatbázist futtató környezet **Beekeeper Studio** telepítve kell legyen a gépén.

### Projekt elindítása Dockerrel:

1. **A projekt letöltése:**

   Pullold a projektet a GitHub-ról:

   ```bash
   git pull https://github.com/4v3r1s/Mozgobolt.git  
   ```


2.  **Telepítse a szükséges csomagokat:**

Navigáljon a letöltött mappába és telepítse az összes szükséges csomagot:

```bash
npm install
```

3.  **Indítsa el Dockerben a projektet:**



```bash
docker compose up -y
```



4.  **Állítsa be az adatbázist:**

A projekt MySQL adatbázist használ. A docker elindítása után indítsa el a BeeKeeper studiot, győződjön meg hogy a server.js fut a 3000-es porton. A 3306-os porton tud csatlakozni a BeeKeeper studion belül, a root felhasználó névvel, és root jelszóval. A projekt mappán belül, az adatbázis export mappából válassza ki a legfrisebb dátummal rendeékező mappát, és importálj az adatbázis SQL fájlokat. Inditsa el a weboldalt npm run dev-el, és csatlakozzon az 5173-as porton az oldalra.




5.  **A webalkalmazás megjelenítése:**

- Vándorbolt weblapja: [Vándorbolt Weboldal](http://localhost:5173)




### 6. Admin Panel

Az admin panel az adminisztrátorok számára van. Az adminisztrátori jogosultságokhoz az alábbi bejelentkezési információk szükségesek:

- **Felhasználónév**: B1gz1
- **Jelszó**: igazikristof@gmail.com

A bejelentkezés után az admin panelen keresztül kezelhetei a termékeket, rendeléseket és felhasználókat.



### 7. Tesztelés

A projekthez tartozó teszteket a következő paranccsal futtathatja:

```bash
cd backend/src/test
npm test
```

## Linkek


- **Dokumentáció**: [Dokumentáció Link](https://github.com/HetBalint/evvegiprojekt2025/blob/main/Projektmunka%20dokument%C3%A1l%C3%A1sa.docx)

## Fejlesztők

- **Fejlesztő**: [Igazi Kristóf](https://github.com/4v3r1s)
- **Fejlesztő**: [Hamza RIchárd](https://github.com/Rics04)
