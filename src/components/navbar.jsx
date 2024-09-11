import { React, } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Ícone do carrinho de compras
import "../style.css"; // Certifique-se de ter um arquivo CSS para estilizar
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo da Marca" />{" "}
        {/* Insira o caminho da logo */}
      </div>

      <div className="navbar-search">
        <input type="text" placeholder="Buscar..." />
      </div>

      <div className="navbar-cart">
        <FaShoppingCart size={24} />
      </div>

      <div className="navbar-user">
        {user ? `Bem-vindo, ${user}` : <Link to={"/login"}>Entrar</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
