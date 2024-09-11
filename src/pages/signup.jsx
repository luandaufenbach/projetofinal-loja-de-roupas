import { useState, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { db, auth } from "../services/firebaseconfig";
import {getDocs, collection, setDoc, doc} from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth";


export default function Signup() {
    const navigate = useNavigate();

  const [email, setEmail] = useState([]);
  const [senha, setSenha] = useState([]);
  const [nome, setNome] = useState([]);

  async function signup() {
    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!")
        return;
    }
    if (senha.length<6) {
        alert("Sua senha precisa ter 6 caracteres!")
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      await setDoc(doc(db, "usuarios", email), {
        nome: nome,
        email: email
      })
      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      alert("senha ou email incorreto.")
    }
  }

  return (
    <div className="container">
      <br />
      <h2>Crie sua conta</h2>
      <br />
      <label>Nome</label>
        <input
          type="text"
          onChange={(e) => setNome(e.target.value)}
          value={nome}
        />
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
        <button onClick={signup} className="btn-login">
          CRIAR CONTA
        </button>
      <br />
      <span>
        Já possui uma conta? Entre
        <Link to="/login"> Aqui</Link>
      </span>
    </div>
  );
}
