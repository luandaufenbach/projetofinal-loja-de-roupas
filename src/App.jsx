import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AddProduto from  "./pages/addProduto";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdiconarProduto" element={<AddProduto/>}/>
      </Routes>
    </>
  );
}

export default App;
