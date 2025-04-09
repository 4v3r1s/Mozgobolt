import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProductOrder from "./page/order";
import Home from "./page/orderpage/page";
import Towns from "./page/StaticRoute/route";
import Info from "./page/StaticInfo/info";
import Contact from "./page/StaticKapcsolat/StaticKapcsolat";
import Tutorial from "./page/StaticTutorial/Tutorial";
import SignUp from "./page/auth/Register";
import SignIn from "./page/auth/Login";
import Account from "./page/account/account";
import Sales from "./page/sales/sales";
import Cart from "./page/cart/cart";
import UserTable from "./page/admin/database/UserTable";
import ProductTable from "./page/admin/database/ProductTable";
import OrderTable from "./page/admin/database/OrderTable";
import NapiFogyasTable from "./page/admin/database/NapiFogyasTable"; // Importáljuk az új komponenst
import Payment from "./page/payment/payment";
import ProfileEdit from './page/account/profile-edit';
import Orders from './page/account/orders';
import AdminDashboard from './page/admin/database/AdminDashboard';
import NapiFogyas from './page/account/napiFogyas';
import ASZF from './page/StaticASZF/staticASZF';
import Adatvedelem from './page/staticNyilatkozat/staticNyilatkozat';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:id" element={<ProductOrder />} />
        <Route path="/utvonal" element={<Towns />} />
        <Route path="/info" element={<Info />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/StaticKapcsolat" element={<Contact />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/account" element={<Account />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/account/napiFogyas" element={<NapiFogyas />} />
        <Route path="/aszf" element={<ASZF />} />
        <Route path="/adatvedelem" element={<Adatvedelem />} />
        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserTable />} />
        <Route path="/admin/products" element={<ProductTable />} />
        <Route path="/admin/orders" element={<OrderTable />} />
        <Route path="/admin/napi-fogyas" element={<NapiFogyasTable />} /> {/* Új útvonal a napi fogyás kezeléséhez */}
      </Routes>
    </Router>
  );
}

export default App;
