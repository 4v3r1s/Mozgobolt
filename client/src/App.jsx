import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Shop from "./page/shop"; 
import ProductOrder from "./page/order";
import Home from "./page/orderpage/page";
import Towns from "./page/StaticRoute/route";
import Info from "./page/StaticInfo/info";
import Contact from "./page/StaticKapcsolat/StaticKapcsolat";
import Tutorial from "./page/StaticTutorial/Tutorial";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />}/> 
        <Route path="/order/:id" element={<ProductOrder />} />
        <Route path="/home" element={<Home />} />
        <Route path="/utvonal" element={<Towns />} />
        <Route path="/info" element={<Info />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/StaticKapcsolat" element={<Contact />} />
        <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
    </Router>
  );
}

export default App;