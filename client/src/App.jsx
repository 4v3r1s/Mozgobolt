import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Payment from "./page/payment/payment";


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
        
        {/* Admin routes */}
        <Route path="/admin" element={<UserTable />} />
        <Route path="/admin/users" element={<UserTable />} />
        <Route path="/admin/products" element={<ProductTable />} />
      </Routes>
    </Router>
  );
}

export default App;
