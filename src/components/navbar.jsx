import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { auth, db } from "../services/firebaseconfig"; // Importar a autenticação e Firestore do Firebase
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importar funções do Firestore
import "../style.css";

const Navbar = ({ onCategorySelect, onSearch }) => {
  const [userName, setUserName] = useState(null); // Estado para o nome do usuário
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Obter o documento do usuário no Firestore
        const userDocRef = doc(db, "usuarios", currentUser.email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserName(userDoc.data().nome); // Define o nome do usuário
        } else {
          setUserName(currentUser.email); // Fallback para o email caso o documento não exista
        }
      } else {
        setUserName(null); // Se não houver usuário logado
      }
    });

    return () => unsubscribe(); // Limpar a função ao desmontar o componente
  }, []);

  // Função para lidar com a busca
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim() !== "") {
      onSearch(searchTerm); // Chama a função de busca com o termo
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo da loja de roupas" />
          </Link>
        </div>

        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" style={{ display: "none" }} />
          </form>
        </div>

        <div className="navbar-right">
          <div className="navbar-cart">
            <Link to="/carrinho">
              <FaShoppingCart size={24} style={{ color: "black" }} />
            </Link>
          </div>
          
          <div className="navbar-contacts">
              <Link to="/pedidos">
               Meus pedidos 
              </Link>
          </div>

          <div className="navbar-contact">
            <a href="https://wa.me/5548999425176" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} /> Fale Conosco
            </a>
          </div>

          <div className="navbar-user">
            {userName ? (
              <>
                <span>{`Bem-vindo, ${userName}`}</span>
                <button
                  className="btn-logout"
                  onClick={() => auth.signOut().then(() => setUserName(null))}
                >
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-login">Entrar</Link>
            )}
          </div>
        </div>
      </div>

      <ul className="navbar-categories">
        <li onClick={() => onCategorySelect("Camiseta")}><strong>CAMISETAS</strong></li>
        <li onClick={() => onCategorySelect("Camiseta manga longa")}><strong>CAMISETAS MANGA LONGA</strong></li>
        <li onClick={() => onCategorySelect("Jaqueta")}><strong>JAQUETAS</strong></li>
        <li onClick={() => onCategorySelect("Moletom")}><strong>MOLETONS</strong></li>
        <li onClick={() => onCategorySelect("Calça")}><strong>CALÇAS</strong></li>
        <li onClick={() => onCategorySelect("Bermuda")}><strong>BERMUDAS</strong></li>
      </ul>
      
      <hr className="traco" />
    </nav>
  );
};

export default Navbar;
