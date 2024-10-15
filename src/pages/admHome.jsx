import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import "../style.css";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebaseconfig";

export default function AdmHome() {
  const [produtos, setProdutos] = useState([]);

  // Função para buscar os produtos do Firestore
  async function getProdutos() {
    try {
      const dataProdutos = await getDocs(collection(db, "produtos"));
      const lProdutos = dataProdutos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProdutos(lProdutos);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getProdutos(); // Busca os produtos ao carregar a página
  }, []);

  return (
    <div className="PageHome">
      <Navbar />
      <div className="page-content">
        <div className="product-container">
          {/* Exibe todos os produtos */}
          {produtos.length > 0 ? (
            produtos.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.imagem}
                  style={{ width: "150px", height: "auto" }}
                  alt={product.nome}
                />
                <div className="product-info">
                  <h3 className="product-name">{product.nome}</h3>
                  <p className="product-price">R$ {product.preco}</p>
                  <p className="product-category">{product.categoria}</p>
                  <Link to={`/admProduto/${product.id}`}>
                    <button className="btn-adc-carrinho">Ver mais</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
}
