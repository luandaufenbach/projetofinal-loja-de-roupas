import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 

const Checkout = () => {
  const [formData, setFormData] = useState({
    cep: '',
    numero: '',
    rua: '',
    complemento: '',
  });
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate(); 

  // verificar o estado de autenticação e obter o email do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Carrega os itens do carrinho do localStorage quando carrega a página
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("carrinho")) || [];
    setCartItems(savedCart);
  }, []);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para salvar os dados de entrega e do carrinho no Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    try {
      // Adiciona os dados de entrega, do carrinho e o email ao Firestore
      await addDoc(collection(db, 'pedidos'), {
        email: userEmail,
        endereco: formData,
        produtos: cartItems,
        status: 'em processo',
        data: new Date(),
      });

      alert('Pedido realizado com sucesso!');

      // Limpar o localStorage e o formulário dps do pedido
      localStorage.removeItem("carrinho");
      setCartItems([]);
      setFormData({ cep: '', numero: '', rua: '', complemento: '' });

      // Redirecionar para a página de pedidos
      navigate('/pedidos'); 
    } catch (error) {
      console.error("Erro ao salvar pedido: ", error);
      alert('Erro ao finalizar o pedido. Tente novamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Informações de Entrega</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>CEP</label>
          <input
            type="text"
            name="cep"
            className="form-control"
            value={formData.cep}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Número</label>
          <input
            type="text"
            name="numero"
            className="form-control"
            value={formData.numero}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Rua</label>
          <input
            type="text"
            name="rua"
            className="form-control"
            value={formData.rua}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Complemento (opcional)</label>
          <input
            type="text"
            name="complemento"
            className="form-control"
            value={formData.complemento}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Finalizar Compra</button>
      </form>
    </div>
  );
};

export default Checkout;
