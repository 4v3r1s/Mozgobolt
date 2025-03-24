import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductOrder from "./page/order";
import Home from "./page/orderpage/page";  // Itt lehet a probléma
import Towns from "./page/StaticRoute/route";
import Info from "./page/StaticInfo/info";
import Contact from "./page/StaticKapcsolat/StaticKapcsolat";
import Tutorial from "./page/StaticTutorial/Tutorial";
import SignUp from "./page/auth/Register";
import SignIn from "./page/auth/Login";
import Account from "./page/account/account";
import OrderProcess from "./page/OrderProcess/OrderProcess";
import Sales from "./page/sales/sales";

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
        <Route path="/order-process" element={<OrderProcess />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </Router>
  );
}

export default App;