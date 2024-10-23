import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc, getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig"; // Certifique-se de importar auth
import { onAuthStateChanged } from "firebase/auth"; // Importar para verificar o usuário logado
import Navbar from "../components/navbar";
import "../style.css";

export default function Produto() {
  const { id } = useParams(); // Pega o id da URL
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado
  const [nomeUser, setNomeUser] = useState("");

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
        setNomeUser(lUsuario[0]?.nome); // Atualiza o nome do usuário logado
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Verifica o estado do usuário logado com Firebase Authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Define o usuário logado
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Limpa o listener ao desmontar o componente
  }, []);

  useEffect(() => {
    if (user) {
      getUsuarios(); // Busca os dados do usuário se estiver logado
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
