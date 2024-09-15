import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AddProduto from  "./pages/addProduto";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Produto from "./pages/produto";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdicionarProduto" element={<AddProduto/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/produto/:id" element={<Produto />} />
      </Routes>
    </>
  );
}

export default App;
