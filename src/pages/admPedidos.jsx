import React, { useState, useEffect } from "react";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirecionamento

const AdmPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate(); // Inicializa o hook de navegação

  // Função para buscar todos os pedidos do Firestore
  async function getPedidos() {
    try {
      const dataPedidos = await getDocs(collection(db, "pedidos"));
      const listaPedidos = dataPedidos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPedidos(listaPedidos);
    } catch (error) {
      alert("Erro ao carregar pedidos: " + error);
    }
  }

  // Função para atualizar o status do pedido no Firestore
  const handleStatusChange = async (pedidoId, newStatus) => {
    try {
      const pedidoRef = doc(db, "pedidos", pedidoId);
      await updateDoc(pedidoRef, { "status": newStatus });
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, status: newStatus } : pedido
        )
      );
    } catch (error) {
      alert("Erro ao atualizar o status do pedido: " + error);
    }
  };

  useEffect(() => {
    getPedidos(); // Carrega todos os pedidos ao iniciar a página
  }, []);

  // Função para calcular o total do pedido somando os preços dos produtos
  const calculateTotal = (produtos) => {
    if (Array.isArray(produtos)) {
      return produtos.reduce((total, item) => total + item.preco, 0);
    }
    return 0;
  };

  return (
    <div className="PagePedidos container mt-5">
      <div className="page-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Todos os Pedidos</h1>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admHome")} // Redireciona para a página inicial
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

                  {/* Select para atualizar o status */}
                  <label htmlFor={`status-${pedido.id}`} className="mt-3"><strong>Alterar Status:</strong></label>
                  <select
                    id={`status-${pedido.id}`}
                    value={pedido.status}
                    onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                    className="form-select mt-2"
                  >
                    <option value="em processo">Em Processo</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                  </select>
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

export default AdmPedidos;
