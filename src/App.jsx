import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AddProduto from  "./pages/addProduto";
import Login from "./pages/login";
import Signup from "./pages/signup";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdiconarProduto" element={<AddProduto/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  );
}

export default App;
