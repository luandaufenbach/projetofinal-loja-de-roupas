import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Função para carregar os itens do carrinho
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("carrinho")) || [];
    setCartItems(savedCart);
    calculateTotalPrice(savedCart);
  }, []); 

  // Função para calcular o preço total dos itens
  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.preco), 0); // Converta o preço para número
    setTotalPrice(total);
  };

  // Função para remover um item do carrinho
  const removeItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("carrinho", JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    localStorage.removeItem("carrinho");
    setCartItems([]);
    setTotalPrice(0);
    alert("Carrinho limpo!");
  };

  // Função para finalizar a compra
  const finalizePurchase = () => {
    navigate('/checkout'); //  página de checkout
  };

  console.log(cartItems);

  return (
    <div className="container mt-5">
      <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="mb-4">Carrinho de Compras</h2>
      <button
            className="btn btn-secondary"
            onClick={() => navigate("/")} // Redireciona para a página inicial
          >
            Voltar para a Página Inicial
          </button>
        </div>




      {cartItems.length === 0 ? (
        <div className="alert alert-info">Seu carrinho está vazio.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Nome</th>
                <th>Tamanho</th>
                <th>Preço (R$)</th>
                <th>Remover</th> 
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      style={{ width: "100px", height: "auto" }}
                      className="img-fluid"
                    />
                  </td>
                  <td>{item.nome}</td>
                  <td>{item.tamanho}</td>
                  <td>{parseFloat(item.preco).toFixed(2)}</td> 
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(index)}
                    >
                      <FaTrash /> {/* icon de lixeira */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: R$ {totalPrice.toFixed(2)}</h4>
            <div>
              <button
                className="btn btn-danger me-3"
                onClick={clearCart}
              >
                Limpar Carrinho
              </button>
              <button
                className="btn btn-success"
                onClick={finalizePurchase}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Cart;
