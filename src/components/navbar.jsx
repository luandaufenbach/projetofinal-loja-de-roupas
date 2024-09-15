import React from "react";
import { FaShoppingCart, FaWhatsapp } from "react-icons/fa";
import "../style.css";
import { Link } from "react-router-dom";

const Navbar = ({ user, onCategorySelect }) => {
  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo da Marca" />
          </Link>
        </div>

        <div className="navbar-search">
          <input type="text" placeholder="Buscar..." />
        </div>

        <div className="navbar-right">
          <div className="navbar-cart">
            <FaShoppingCart size={24} />
          </div>

          <div className="navbar-contact">
            <a href="https://wa.me/5548999425176" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} /> Fale Conosco
            </a>
          </div>

          <div className="navbar-user">
            {user ? `Bem-vindo, ${user}` : <Link to={"/login"} className="btn-login">Entrar</Link>}
          </div>
        </div>
      </div>

      <ul className="navbar-categories">
        <li onClick={() => onCategorySelect("Camiseta")}><strong>CAMISETA</strong></li>
        <li onClick={() => onCategorySelect("Camiseta manga longa")}><strong>CAMISETA MANGA LONGA</strong></li>
        <li onClick={() => onCategorySelect("Jaqueta")}><strong>JAQUETAS</strong></li>
        <li onClick={() => onCategorySelect("Moletom")}><strong>MOLETOM</strong></li>
        <li onClick={() => onCategorySelect("Calça")}><strong>CALÇA</strong></li>
        <li onClick={() => onCategorySelect("Bermuda")}><strong>BERMUDA</strong></li>
      </ul>
    </nav>
  );
};

export default Navbar;
