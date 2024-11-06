import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  // Obter o email do usuário logado
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

  // Carregar os pedidos do usuário logado
  useEffect(() => {
    const fetchPedidos = async () => {
      if (userEmail) {
        const pedidosRef = collection(db, 'pedidos');
        const q = query(pedidosRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        const pedidosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPedidos(pedidosList);
      }
    };
    
    fetchPedidos();
  }, [userEmail]);

  if (!userEmail) {
    return <p>Você precisa estar logado para ver seus pedidos.</p>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Meus Pedidos</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Página Inicial
        </button>
      </div>
      {pedidos.length > 0 ? (
        pedidos.map((pedido) => (
          <div key={pedido.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pedido ID: {pedido.id}</h5>
              <p className="text-muted"><strong>Status:</strong> {pedido.status}</p>
              <p><strong>Data:</strong> {pedido.data.toDate().toLocaleString()}</p>

              <h6 className="mt-3">Endereço de Entrega</h6>
              <p>CEP: {pedido.endereco.cep}</p>
              <p>Rua: {pedido.endereco.rua}, Nº {pedido.endereco.numero}</p>
              <p>Complemento: {pedido.endereco.complemento || 'Nenhum'}</p>

              <h6 className="mt-3">Produtos</h6>
              <ul className="list-group list-group-flush">
                {pedido.produtos.map((produto, index) => (
                  <li key={index} className="list-group-item">
                    {produto.nome} - R$ {produto.preco.toFixed(2)} - Tamanho: {produto.tamanho}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>Você ainda não fez nenhum pedido.</p>
      )}
    </div>
  );
};

export default Pedidos;
