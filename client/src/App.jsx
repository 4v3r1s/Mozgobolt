import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Shop from "./page/shop"; 
import ProductOrder from "./page/order";
import Home from "./page/orderpage/page";
import Towns from "./page/StaticRoute/route";
import Info from "./page/StaticInfo/info";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />}/> 
        <Route path="/order/:id" element={<ProductOrder />} />
        <Route path="/home" element={<Home />} />
        <Route path="/utvonal" element={<Towns />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;
