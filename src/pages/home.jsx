import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import "../style.css";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [user, setUser] = useState(null);
  const [userLogado, setUserLogado] = useState([]);
  const [nomeUser, setNomeUser] = useState("");

  // Função para buscar informações do usuário logado
  async function getUsuarios() {
    try {
      if (user && user.email) {
        const q = query(collection(db, "usuarios"), where("email", "==", user.email));
        const dataUsuario = await getDocs(q);
        const lUsuario = dataUsuario.docs.map((doc) => ({ ...doc.data() }));
        setUserLogado(lUsuario);
        setNomeUser(lUsuario[0]?.nome);  // Atualiza o nome do usuário logado
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Função para buscar os produtos do Firestore
  async function getProdutos() {
    try {
      const dataProdutos = await getDocs(collection(db, "produtos"));
      const lProdutos = dataProdutos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProdutos(lProdutos);
      setFilteredProdutos(lProdutos);  // Inicializa com todos os produtos
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);  // Atualiza o estado do usuário logado
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getProdutos();  // Busca os produtos ao carregar a página
  }, []);

  useEffect(() => {
    if (user) {
      getUsuarios();  // Busca os dados do usuário se estiver logado
    }
  }, [user]);

  // Função para filtrar os produtos por categoria
  const handleCategorySelect = (category) => {
    const filtered = produtos.filter(produto => produto.categoria === category);
    setFilteredProdutos(filtered);
  };

  return (
    <div className="PageHome">
      {/* Passa o nome do usuário logado para o Navbar */}
      <Navbar user={nomeUser} onCategorySelect={handleCategorySelect} />
      <div className="page-content">
        <div className="product-container">
          {/* Exibe os produtos filtrados ou todos os produtos */}
          {filteredProdutos.length > 0 ? (
            filteredProdutos.map((product) => (
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
                  <Link to={`/produto/${product.id}`}>
                    <button className="btn-adc-carrinho">Ver mais</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado para esta categoria</p>
          )}
        </div>
      </div>
    </div>
  );
}
