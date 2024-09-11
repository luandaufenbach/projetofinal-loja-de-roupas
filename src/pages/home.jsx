import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "../style.css"; // Certifique-se de criar e estilizar o arquivo CSS para os cards
import { getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { lutimes } from "fs";

export default function Home() {
  // Exemplo de dados de produtos. Substitua com os dados reais ou uma chamada à API
  const [produtos, setProdutos] = useState([]);
  const [user, setUser] = useState([]);
  const [userLogado, setUserLogado] = useState([]);

  async function getUsuarios() {
    try {
      const q = query(
        collection(db, "usuarios"),
        where("email", "==", user.email)
      );
      const dataUsuario = await getDocs(q);
      const lUsuario = dataUsuario.docs.map((doc) => ({
        ...doc.data(),
      }));
      setUserLogado(lUsuario);
      console.log(lUsuario);
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

  return (
    <div className="PageHome">
      <Navbar user={user} />
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
              <p className="product-price">{product.preco}</p>
              <p className="product-category">{product.categoria}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
