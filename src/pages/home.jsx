import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { Link, useNavigate  } from "react-router-dom";
import "../style.css";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [user, setUser] = useState([]);
  const [userLogado, setUserLogado] = useState([]);
  const [nomeUser, setNomeUser] = useState([]);

  const navigate = useNavigate()

  async function getUsuarios() {
    try {
      console.log(user.email);
      const q = query(
        collection(db, "usuarios"),
        where("email", "==", user.email)
      );
      const dataUsuario = await getDocs(q);
      const lUsuario = dataUsuario.docs.map((doc) => ({
        ...doc.data(),
      }));
      setUserLogado(lUsuario);
      setNomeUser(lUsuario[0].nome);
    } catch (error) {
      console.log(error);
    }
  }

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      console.log(user.email);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getProdutos();
  }, []);

  useEffect(() => {
    if (user) {
      getUsuarios();
    }
  }, [user]);

/*   // Função para adicionar o ID do produto no localStorage
  function adicionarAoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    // Remover verificação para adicionar produtos repetidos
    carrinho.push(produtoId);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
  } */

  return (
    <div className="PageHome">
      <Navbar user={nomeUser} />
      <div className="product-container">
        {produtos.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.imagem}
              style={{ width: "150px", height: "auto" }}
              alt=""
            />
            <div className="product-info">
              <h3 className="product-name">{product.nome}</h3>
              <p className="product-price">R$ {product.preco}</p>
              <p className="product-category">{product.categoria}</p>
              <button
                className="btn-adc-carrinho"
                onClick={() => navigate("/produto")}
              >
                Ver mais
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
