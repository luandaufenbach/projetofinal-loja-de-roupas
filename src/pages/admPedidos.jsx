import React, { useState, useEffect } from "react";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const admPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totals, setTotais] = useState({
    faturado: 0,
    totalPedidos: 0,
    enviados: 0,
    entregues: 0,
    emProcesso: 0,
  });
  const navigate = useNavigate();

  // Função para buscar todos os pedidos do Firestore
  async function getPedidos() {
    try {
      const dataPedidos = await getDocs(collection(db, "pedidos"));
      const listaPedidos = dataPedidos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPedidos(listaPedidos);
      setFilteredPedidos(listaPedidos); // Inicialmente exibe todos os pedidos
      calcularTotais(listaPedidos); // Atualiza os totais
    } catch (error) {
      alert("Erro ao carregar pedidos: " + error);
    }
  }

  // Função para calcular os totais
  const calcularTotais = (listaPedidos) => {
    let totalFaturado = 0;
    let totalPedidos = listaPedidos.length;
    let enviados = 0;
    let entregues = 0;
    let emProcesso = 0;

    listaPedidos.forEach((pedido) => {
      const totalPedido = calcularTotal(pedido.produtos);
      totalFaturado += totalPedido;

      if (pedido.status === "enviado") enviados++;
      if (pedido.status === "entregue") entregues++;
      if (pedido.status === "em processo") emProcesso++;
    });

    setTotais({
      faturado: totalFaturado,
      totalPedidos: totalPedidos,
      enviados: enviados,
      entregues: entregues,
      emProcesso: emProcesso,
    });
  };

  // Função para atualizar o status do pedido no Firestore
  const handleStatusChange = async (pedidoId, newStatus) => {
    try {
      const pedidoRef = doc(db, "pedidos", pedidoId);
      await updateDoc(pedidoRef, { status: newStatus });
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, status: newStatus } : pedido
        )
      );
      getPedidos(); // Recalcula os totais
    } catch (error) {
      alert("Erro ao atualizar o status do pedido: " + error);
    }
  };

  useEffect(() => {
    getPedidos(); // Carrega todos os pedidos ao iniciar a página
  }, []);

  // Função para calcular o total do pedido somando os preços dos produtos
  const calcularTotal = (produtos) => {
    if (Array.isArray(produtos)) {
      return produtos.reduce((total, item) => total + item.preco, 0);
    }
    return 0;
  };

  // Função para filtrar pedidos por data
  const filtrarPorData = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const pedidosFiltrados = pedidos.filter((pedido) => {
        const dataPedido = pedido.data?.toDate();
        return dataPedido >= start && dataPedido <= end;
      });

      setFilteredPedidos(pedidosFiltrados);
      calcularTotais(pedidosFiltrados);
    } else {
      setFilteredPedidos(pedidos); // Exibe todos os pedidos caso as datas não sejam válidas
      calcularTotais(pedidos);
    }
  };

  return (
    
<div className="PagePedidos container mt-5">
  <div className="page-contentd-flex justify-content-between align-items-center mb-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
    <h1>Filtrar por Data</h1>
    <button
            className="btn btn-secondary"
            onClick={() => navigate("/admHome")}
          >
            Voltar para a Página Inicial
          </button>
        </div>
    <div className="row g-3 align-items-end">
      <div className="col-auto">
        <label htmlFor="start-date" className="form-label">
          Data Inicial:
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="col-auto">
        <label htmlFor="end-date" className="form-label">
          Data Final:
        </label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="col-auto">
        <button
          className="btn btn-primary"
          onClick={filtrarPorData}
          style={{ marginTop: "8px" }} 
        >
          Filtrar
        </button>
      </div>
    </div>
  </div>
  {/* Conteúdo restante da página */}
  <div className="page-contentd-flex justify-content-between align-items-center mb-4">
    {/* Estatísticas de pedidos */}
    <div className="mb-4">
      <div className="row">
        <div className="col">
          <div className="stat-box bg-light p-3 border rounded">
            <h4>Total Faturamento</h4>
            <p>R$ {totals.faturado.toFixed(2)}</p>
          </div>
        </div>
        <div className="col">
          <div className="stat-box bg-light p-3 border rounded">
            <h4>Total de Pedidos</h4>
            <p>{totals.totalPedidos}</p>
          </div>
        </div>
        <div className="col">
          <div className="stat-box bg-light p-3 border rounded">
            <h4>Pedidos Enviados</h4>
            <p>{totals.enviados}</p>
          </div>
        </div>
        <div className="col">
          <div className="stat-box bg-light p-3 border rounded">
            <h4>Pedidos Entregues</h4>
            <p>{totals.entregues}</p>
          </div>
        </div>
        <div className="col">
          <div className="stat-box bg-light p-3 border rounded">
            <h4>Pedidos em Processo</h4>
            <p>{totals.emProcesso}</p>
          </div>
        </div>
      </div>
    </div>
  </div>



        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Todos os Pedidos</h1>
        </div>


        <div className="orders-container">
          {filteredPedidos.length > 0 ? (
            filteredPedidos.map((pedido) => (
              <div key={pedido.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Pedido ID: {pedido.id}</h5>
                  <p className="text-muted">
                    <strong>Status:</strong> {pedido.status}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {pedido.data?.toDate().toLocaleString()}
                  </p>

                  <h6 className="mt-3">Endereço de Entrega</h6>
                  <p>CEP: {pedido.endereco?.cep}</p>
                  <p>
                    Rua: {pedido.endereco?.rua}, Nº {pedido.endereco?.numero}
                  </p>
                  <p>Complemento: {pedido.endereco?.complemento || "Nenhum"}</p>

                  <h6 className="mt-3">Produtos</h6>
                  <ul className="list-group list-group-flush">
                    {Array.isArray(pedido.produtos) ? (
                      pedido.produtos.map((item, index) => (
                        <li key={index} className="list-group-item">
                          <img
                            src={item.imagem}
                            alt={item.nome}
                            style={{
                              width: "50px",
                              marginRight: "10px",
                            }}
                          />
                          {item.nome} - R$ {item.preco.toFixed(2)} - Tamanho:{" "}
                          {item.tamanho}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">
                        Nenhum item encontrado.
                      </li>
                    )}
                  </ul>
                  <p className="mt-3">
                    <strong>Total:</strong> R${" "}
                    {pedido.total
                      ? pedido.total.toFixed(2)
                      : calcularTotal(pedido.produtos).toFixed(2)}
                  </p>

                  {/* Select para atualizar o status */}
                  <label htmlFor={`status-${pedido.id}`} className="mt-3">
                    Alterar Status:
                  </label>
                  <select
                    id={`status-${pedido.id}`}
                    className="form-select"
                    value={pedido.status}
                    onChange={(e) =>
                      handleStatusChange(pedido.id, e.target.value)
                    }
                  >
                    <option value="enviado">Enviado</option>
                    <option value="em processo">Em Processo</option>
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

  );
};

export default admPedidos;
