import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import AdmNavbar from "../components/admNavbar";
import "../style.css";

const AdmPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  // Função para buscar os pedidos do Firestore
  async function getPedidos() {
    try {
      const dataPedidos = await getDocs(collection(db, "pedidos"));
      const listaPedidos = dataPedidos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPedidos(listaPedidos);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getPedidos(); // Busca os pedidos ao carregar a página
  }, []);

  return (
    <div className="PagePedidos">
      <AdmNavbar admin={true} />
      <div className="page-content">
        <h1>Pedidos</h1>
        <div className="orders-container">
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <div key={pedido.id} className="order-card">
                <h3>Pedido #{pedido.id}</h3>
                <p>Endereço: {pedido.endereco}</p>
                <p>CEP: {pedido.cep}</p>
                <p>Itens:</p>
                <ul>
                  {pedido.itens.map((item, index) => (
                    <li key={index}>{item.nome} - Tamanho: {item.tamanho} - R$ {item.preco}</li>
                  ))}
                </ul>
                <p>Total: R$ {pedido.total}</p>
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
