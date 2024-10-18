import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import "../style.css";
import { Link } from "react-router-dom";

const AdmNavbar = ({ admin, onCategorySelect }) => {
  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="navbar-logo">
          {/* Redirecionar para a página admHome ao clicar na logo */}
          <Link to="/admHome">
            <img src="/images/logo.png" alt="Logo da Marca" />
          </Link>
        </div>

        <div className="navbar-search">
          <input type="text" placeholder="Buscar..." />
        </div>

        <div className="navbar-right">
          {/* Botão para acessar o carrinho de compras (caso seja necessário para o administrador) */}
          <div className="navbar-cart">
            <Link to="/AdicionarProduto">
              <CgAddR size={24} style = {{color: "black"}} />
            </Link>
          </div>

          {/* Contato via WhatsApp */}
          <div className="navbar-contact">
            <a href="https://wa.me/5548999425176" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} /> Fale Conosco
            </a>
          </div>

          {/* Verificação se o admin está logado */}
          <div className="navbar-user">
            {admin ? `Bem-vindo, Admin` : <Link to="/login" className="btn-login">Entrar</Link>}
            
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
    </nav>
  );
};


export default AdmNavbar;
