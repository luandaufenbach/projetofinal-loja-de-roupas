import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa o useNavigate
import { getDoc, doc, getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/navbar";
import "../style.css";

export default function Produto() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [nomeUser, setNomeUser] = useState("");
  const navigate = useNavigate(); // Inicializa o useNavigate

  // Função para buscar informações do usuário logado
  async function getUsuarios() {
    try {
      if (user && user.email) {
        const q = query(
          collection(db, "usuarios"),
          where("email", "==", user.email)
        );
        const dataUsuario = await getDocs(q);
        const lUsuario = dataUsuario.docs.map((doc) => ({ ...doc.data() }));
        setNomeUser(lUsuario[0]?.nome);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getUsuarios();
    }
  }, [user]);

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
    if (!produto) {
      alert("Produto não encontrado");
      return;
    }

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const produtoAdicionado = {
      id: id,
      nome: produto.nome,
      preco: parseFloat(produto.preco),
      imagem: produto.imagem,
      tamanho: produto.tamanho,
    };

    carrinho.push(produtoAdicionado);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
    navigate("/"); // Redireciona para a página inicial
  }

  function handleCategorySelect(category) {
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
      <Navbar user={nomeUser} onCategorySelect={handleCategorySelect} />
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
