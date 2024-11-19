import React, { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth"; // Para verificar o usuário logado
import { useNavigate } from "react-router-dom"; 

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado
  const navigate = useNavigate(); // Hook de navegação

  // Verifica o estado de autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Define o usuário logado
      } else {
        setUser(null); // Reseta caso o usuário não esteja logado
      }
    });
    return () => unsubscribe();
  }, []);

  // Função para buscar todos os pedidos do Firestore
  async function getPedidos() {
    if (!user) return; // Sai se o usuário não estiver logado

    try {
      let q;
      if (user.email === "admin@example.com") { // Verifique o email ou role do admin
        q = query(collection(db, "pedidos"));
      } else {
        // Filtra pedidos apenas do usuário logado
        q = query(
          collection(db, "pedidos"),
          where("email", "==", user.email) // Somente pedidos do usuário logado
        );
      }

      const dataPedidos = await getDocs(q);
      const listaPedidos = dataPedidos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPedidos(listaPedidos);
    } catch (error) {
      alert("Erro ao carregar pedidos: " + error);
    }
  }

  // Função para calcular o total do pedido somando os preços dos produtos
  const calculateTotal = (produtos) => {
    if (Array.isArray(produtos)) {
      return produtos.reduce((total, item) => total + item.preco, 0);
    }
    return 0;
  };

  useEffect(() => {
    getPedidos(); // Carrega todos os pedidos ao iniciar a página, filtrados pelo usuário
  }, [user]);

  return (
    <div className="PagePedidos container mt-5">
      <div className="page-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Meus Pedidos</h1>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")} // Redireciona para a página inicial
          >
            Voltar para a Página Inicial
          </button>
        </div>
        
        <div className="orders-container">
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <div key={pedido.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Pedido ID: {pedido.id}</h5>
                  <p className="text-muted"><strong>Status:</strong> {pedido.status}</p>
                  <p><strong>Data:</strong> {pedido.data?.toDate().toLocaleString()}</p>

                  <h6 className="mt-3">Endereço de Entrega</h6>
                  <p>CEP: {pedido.endereco?.cep}</p>
                  <p>Rua: {pedido.endereco?.rua}, Nº {pedido.endereco?.numero}</p>
                  <p>Complemento: {pedido.endereco?.complemento || 'Nenhum'}</p>

                  <h6 className="mt-3">Produtos</h6>
                  <ul className="list-group list-group-flush">
                    {Array.isArray(pedido.produtos) ? (
                      pedido.produtos.map((item, index) => (
                        <li key={index} className="list-group-item">
                          <img src={item.imagem} alt={item.nome} style={{ width: "50px", marginRight: "10px" }} />
                          {item.nome} - R$ {item.preco.toFixed(2)} - Tamanho: {item.tamanho}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">Nenhum item encontrado.</li>
                    )}
                  </ul>
                  <p className="mt-3"><strong>Total:</strong> R$ {pedido.total ? pedido.total.toFixed(2) : calculateTotal(pedido.produtos).toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
