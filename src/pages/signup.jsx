import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../services/firebaseconfig";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [adminCode, setAdminCode] = useState(""); // Código especial para admin

  async function signup() {
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }
    if (senha.length < 6) {
      alert("Sua senha precisa ter 6 caracteres!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      // Verifica se o usuário possui o código de administrador
      const role = adminCode === "11111" ? "admin" : "user";

      // Armazena o papel do usuário no Firestore
      await setDoc(doc(db, "usuarios", email), {
        nome: nome,
        email: email,
        role: role,  // "admin" ou "user"
      });

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao criar conta. Verifique os dados inseridos.");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Crie sua conta</h2>

        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            className="form-control"
            type="text"
            placeholder="Digite seu nome"
            onChange={(e) => setNome(e.target.value)}
            value={nome}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            className="form-control"
            type="password"
            placeholder="Digite sua senha"
            onChange={(e) => setSenha(e.target.value)}
            value={senha}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Código de administrador (opcional)</label>
          <input
            className="form-control"
            type="text"
            placeholder="Digite o código de administrador"
            onChange={(e) => setAdminCode(e.target.value)}
            value={adminCode}
          />
        </div>

        <button onClick={signup} className="btn btn-primary w-100 mb-3">
          Criar Conta
        </button>

        <p className="text-center">
          Já possui uma conta?{" "}
          <Link to="/login" className="text-primary">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
