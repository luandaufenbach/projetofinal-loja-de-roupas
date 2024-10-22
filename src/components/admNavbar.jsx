import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { Link } from "react-router-dom";
import "../style.css";

const AdmNavbar = ({ admin, onCategorySelect }) => {
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
              <CgAddR size={24} style={{ color: "black" }} />
            </Link>
          </div>

          <div className="navbar-contact">
            <a href="https://wa.me/5548999425176" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} /> Fale Conosco
            </a>
          </div>

          <div className="navbar-user">
            {admin ? `Bem-vindo, Admin` : <Link to="/login" className="btn-login">Entrar</Link>}
          </div>

          {/* Link para ver pedidos */}
          <div className="navbar-orders">
            <Link to="/admPedidos" className="btn-orders">Ver Pedidos</Link>
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
