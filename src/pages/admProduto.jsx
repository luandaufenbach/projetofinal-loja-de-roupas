import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";
import Navbar from "../components/admNavbar";
import "../style.css";

export default function AdmProduto() {
  const { id } = useParams(); // Pega o id da URL
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [categoria, setCategoria] = useState("");
  const [userName, setUserName] = useState(""); // Adiciona estado para armazenar o nome do usuário

  useEffect(() => {
    async function fetchProduto() {
      try {
        const produtoDoc = await getDoc(doc(db, "produtos", id));
        if (produtoDoc.exists()) {
          const data = produtoDoc.data();
          setProduto(data);
          setNome(data.nome);
          setPreco(data.preco);
          setTamanho(data.tamanho);
          setCategoria(data.categoria);
        } else {
          alert("Produto não encontrado");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduto();
  }, [id]);

  // Função para editar o produto
  async function editarProduto() {
    try {
      await updateDoc(doc(db, "produtos", id), {
        nome: nome,
        preco: preco,
        tamanho: tamanho,
        categoria: categoria,
      });
      alert("Produto atualizado com sucesso!");
      navigate("/admHome"); // Redireciona para a página do amd
    } catch (error) {
      alert("Erro ao atualizar produto");
      console.log(error);
    }
  }

  // Função para excluir o produto
  async function excluirProduto() {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este produto?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "produtos", id));
        alert("Produto excluído com sucesso!");
        navigate("/admHome"); // Redireciona para a página do administrador
      } catch (error) {
        alert("Erro ao excluir produto");
        console.log(error);
      }
    }
  }

  // Função para buscar o nome do usuário logado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || user.email); // Pega o nome, se não, usa o email
      } else {
        setUserName("");
      }
    });
    return () => unsubscribe(); // Limpa o listener quando o componente desmontar
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!produto) {
    return <p>Produto não encontrado</p>;
  }

  return (
    <div className="PageHome">
      <Navbar userName={userName} /> {/* Passa o nome do usuário para a Navbar */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="card-img-top"
              />
            </div>
          </div>
          <div className="col-md-6">
            <h2>Editar Produto</h2>
            <div className="mb-3">
              <label className="form-label">Nome:</label>
              <input
                type="text"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Preço:</label>
              <input
                type="text"
                className="form-control"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tamanho:</label>
              <input
                type="text"
                className="form-control"
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Categoria:</label>
              <input
                type="text"
                className="form-control"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
            <button onClick={editarProduto} className="btn btn-primary me-2">
              Salvar Alterações
            </button>
            <button onClick={excluirProduto} className="btn btn-danger">
              Excluir Produto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 