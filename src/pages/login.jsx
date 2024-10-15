import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../services/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, senha);

      // Verifica o papel do usuário
      const userDoc = await getDoc(doc(db, "usuarios", email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          alert("Logado como Administrador");
          navigate("/admHome");
        } else {
          alert("Logado como Usuário");
          navigate("/");
        }
      } else {
        alert("Usuário não encontrado.");
      }
    } catch (error) {
      alert("Senha ou email incorreto.");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Digite seu email"
        />
        
        <label className="form-label">Senha</label>
        <input
          className="form-control"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
          value={senha}
          placeholder="Digite sua senha"
        />
        
        <br />
        <button onClick={login} className="btn btn-primary w-100 mb-3">
          LOGIN
        </button>

        <p className="text-center">
          Não tem uma conta? Cadastre-se <Link to="/signup">Aqui</Link>
        </p>
      </div>
    </div>
  );
}
