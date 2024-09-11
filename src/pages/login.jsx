import { useState, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { db, auth } from "../services/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";


export default function Login() {
    const navigate = useNavigate();

  const [email, setEmail] = useState([]);
  const [senha, setSenha] = useState([]);

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("logado");
      navigate("/")
    } catch (error) {
      alert("senha ou email incorreto.")
    }
  }

  return (
    <div className="container">
      <br />
      <h2>Login</h2>
      <br />
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <label className="senha">Senha</label>
        <input
          type="password"
          className="form-control"
          onChange={(e) => setSenha(e.target.value)}
          value={senha}
        />
        <br />
        <button onClick={login} className="btn-login">
          LOGIN
        </button>
      <br />
      <span>
        Não tem uma conta? Cadastre-se
        <Link to="/signup"> Aqui</Link>
      </span>
    </div>
  );
}
