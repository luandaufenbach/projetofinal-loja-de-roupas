import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdmNavbar from "../components/admNavbar"; // Navbar para administrador
import "../style.css";
import { getDocs, collection } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";


export default function AdmHome() {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [nomeUser, setNomeUser] = useState(""); // Estado para o nome do usuário

  // Função para buscar os produtos do Firestore
  async function getProdutos() {
    try {
      const dataProdutos = await getDocs(collection(db, "produtos"));
      const lProdutos = dataProdutos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProdutos(lProdutos);
      setFilteredProdutos(lProdutos); // Inicializa com todos os produtos
    } catch (error) {
      alert(error);
    }
  }

  // Função para pegar o nome do usuário logado
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setNomeUser(user.displayName || "Admin"); // Usa o displayName ou "Admin" como fallback
    }
  }, []);

  useEffect(() => {
    getProdutos(); // Busca os produtos ao carregar a página
  }, []);

  // Função para filtrar os produtos por categoria
  const handleCategorySelect = (category) => {
    const filtered = produtos.filter(
      (produto) => produto.categoria === category
    );
    setFilteredProdutos(filtered);
  };

  return (
    <div className="PageHome">
      {/* Passa o nome do usuário logado para o AdmNavbar */}
      <AdmNavbar admin={nomeUser} onCategorySelect={handleCategorySelect} />
      <div className="page-content">
        <div className="product-container">
          {/*produtos filtrados ou todos os produtos */}
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
                  <Link to={`/admProduto/${product.id}`}>
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
