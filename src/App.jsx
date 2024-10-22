import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AddProduto from "./pages/addProduto";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Produto from "./pages/produto";
import AdmProduto from "./pages/admProduto";
import AdmHome from "./pages/admHome";
import Cart from "./pages/cart"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkout from './components/Checkout';
import AdmPedidos from "./pages/admPedidos"; 


function App() {
  // Estado para gerenciar o carrinho de compras
  const [cartItems, setCartItems] = useState([]);

  // Função para adicionar produtos carrinho
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/AdicionarProduto" element={<AddProduto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/produto/:id" element={<Produto addToCart={addToCart} />} />
        <Route path="/admHome" element={<AdmHome />} />
        <Route path="/admProduto/:id" element={<AdmProduto />} />
        <Route path="/carrinho" element={<Cart cartItems={cartItems} />} /> {/* Página do Carrinho */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admPedidos" element={<AdmPedidos />} />

      </Routes>
    </>
  );
}

export default App;
