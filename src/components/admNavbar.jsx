import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { MdRequestPage } from "react-icons/md";
import { Link } from "react-router-dom";
import { auth } from "../services/firebaseconfig"; // Importar a autenticação do Firebase
import { onAuthStateChanged } from "firebase/auth";
import "../style.css";

const AdmNavbar = ({ onCategorySelect }) => {
  const [user, setUser] = useState(null); // Estado para o usuário logado

  // verificar se o usuário está logado quando carrega a página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.displayName || currentUser.email); // Defina o nome ou email
      } else {
        setUser(null); // Se não exisitir usuário logado
      }
    });

    return () => unsubscribe(); // Limpar a função ao desmontar o componente
  }, []);

  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="navbar-logo">
          <Link to="/admHome">
            <img src="/images/logo.png" alt="Logo da Marca" />
          </Link>
        </div>

        <div className="navbar-search">
          <input type="text" placeholder="Buscar..." />
        </div>

        <div className="navbar-right">
          <div className="navbar-cart">
            <Link to="/AdicionarProduto">
              <CgAddR size={27} style={{ color: "black" }} />
            </Link>
            <Link to="/admPedidos">
              <MdRequestPage size={27} style={{ color: "black" }} />
            </Link>
          </div>

          <div className="navbar-contact">
            <a href="https://wa.me/5548999425176" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} /> Fale Conosco
            </a>
          </div>

          <div className="navbar-user">
            {user ? (
              <>
                <span>{`Bem-vindo, ${user}`}</span>
                <button
                  className="btn-logout"
                  onClick={() => auth.signOut().then(() => setUser(null))}
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

export default AdmNavbar;
