import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AddProduto from "./pages/addProduto";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Produto from "./pages/produto";
import Cart from "./pages/cart"; // Página de carrinho
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // Estado para gerenciar o carrinho de compras
  const [cartItems, setCartItems] = useState([]);

  // Função para adicionar produtos ao carrinho
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
        <Route path="/carrinho" element={<Cart cartItems={cartItems} />} /> {/* Página do Carrinho */}
      </Routes>
    </>
  );
}

export default App;
