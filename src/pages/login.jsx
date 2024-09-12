import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      navigate("/");
    } catch (error) {
      alert("senha ou email incorreto.");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label className="form-label">Senha</label>
        <input
          className="form-control"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
          value={senha}
        />
        <br />
        <button onClick={login} className="btn btn-primary w-100 mb-3">
          LOGIN
        </button>
        <br />
        <p className="text-center">
          Não tem uma conta? Cadastre-se
          <Link to="/signup"> Aqui</Link>
        </p>
      </div>
    </div>
  );
}
