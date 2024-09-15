import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import Navbar from "../components/navbar";
import "../style.css";

export default function Produto() {
  const { id } = useParams(); // Pega o id da URL
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const produtoDoc = await getDoc(doc(db, "produtos", id));
        if (produtoDoc.exists()) {
          setProduto(produtoDoc.data());
        } else {
          alert("Produto não encontrado");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduto();
  }, [id]);

  function adicionarAoCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push(id);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!produto) {
    return <p>Produto não encontrado</p>;
  }

  return (
    <div className="PageHome">
      <Navbar />
      <div className="product-details">
        <div className="product-image-container">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="product-main-image"
          />
        </div>
        <div className="product-info">
          <h2>{produto.nome}</h2>
          <p className="product-price">Preço: R$ {produto.preco}</p>
          <p>Categoria: {produto.categoria}</p>
          <p>Tamanhos disponíveis: {produto.tamanho}</p>
          <button onClick={adicionarAoCarrinho} className="btn-adc-carrinho">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
