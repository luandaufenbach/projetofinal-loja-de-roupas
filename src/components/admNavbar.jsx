import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { MdRequestPage } from "react-icons/md";
import { Link } from "react-router-dom";
import { auth } from "../services/firebaseconfig"; // Importar a autenticação do Firebase
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Importar Firestore
import "../style.css";

const AdmNavbar = ({ onCategorySelect, onSearch }) => {
  const [user, setUser] = useState(null); // Estado para o nome do usuário logado
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca
  const db = getFirestore(); // Instância do Firestore

  // Verificar se o usuário está logado quando carrega a página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userEmail = currentUser.email; // Email do usuário logado
        try {
          // Consulta ao Firestore para buscar o nome pelo email
          const usersRef = collection(db, "usuarios");
          const q = query(usersRef, where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Assumimos que só há um documento por email
            const userData = querySnapshot.docs[0].data();
            setUser(userData.nome || userEmail); // Atualizar com o nome ou email se o nome não estiver disponível
          } else {
            setUser(userEmail); // Se não encontrado no Firestore, usar o email
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
          setUser(userEmail); // Se ocorrer um erro, usar o email
        }
      } else {
        setUser(null); // Se não houver usuário logado
      }
    });

    return () => unsubscribe(); // Limpar a função ao desmontar o componente
  }, [db]);

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
          <Link to="/admHome">
            <img src="/images/logo.png" alt="Logo da Marca" />
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
          </form>
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
            <a
              href="https://wa.me/5548999425176"
              target="_blank"
              rel="noopener noreferrer"
            >
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
              <Link to="/login" className="btn-login">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>

      <ul className="navbar-categories">
        <li onClick={() => onCategorySelect("Camiseta")}>
          <strong>CAMISETAS</strong>
        </li>
        <li onClick={() => onCategorySelect("Camiseta manga longa")}>
          <strong>CAMISETAS MANGA LONGA</strong>
        </li>
        <li onClick={() => onCategorySelect("Jaqueta")}>
          <strong>JAQUETAS</strong>
        </li>
        <li onClick={() => onCategorySelect("Moletom")}>
          <strong>MOLETONS</strong>
        </li>
        <li onClick={() => onCategorySelect("Calça")}>
          <strong>CALÇAS</strong>
        </li>
        <li onClick={() => onCategorySelect("Bermuda")}>
          <strong>BERMUDAS</strong>
        </li>
      </ul>
      <hr className="traco" />
    </nav>
  );
};

export default AdmNavbar;
