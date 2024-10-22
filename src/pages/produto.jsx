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
  const [user, setUser] = useState(null); // Estado para armazenar o usuário

  useEffect(() => {
    // Simulação da verificação do usuário logado
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser); // Define o usuário logado
    }

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
    if (!produto) {
      alert("Produto não encontrado");
      return;
    }
  
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const produtoAdicionado = {
      id: id,
      nome: produto.nome,
      preco: parseFloat(produto.preco), // Certifique-se de que o preço é numérico
      imagem: produto.imagem,
      tamanho: produto.tamanho,
    };
    
    carrinho.push(produtoAdicionado);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
  }
  
  function handleCategorySelect(category) {
    // Implementar o filtro de categoria conforme necessário
    console.log(`Categoria selecionada: ${category}`);
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!produto) {
    return <p>Produto não encontrado</p>;
  }

  return (
    <div className="PageHome">
      {/* Passar o user e onCategorySelect para a Navbar */}
      <Navbar user={user} onCategorySelect={handleCategorySelect} />
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
