import { useState } from "react";
import { db, storage } from "../services/firebaseconfig"; // Assuming you have both db and storage configured
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate para redirecionamento

export default function AddProduto() {
  const [nomeProduto, setNomeProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [productImg, setProductImg] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Inicializa o hook de navegação

  const types = ["image/png", "image/jpeg"]; // Tipos de imagem válidos

  const productImgHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setProductImg(selectedFile);
      setError("");
    } else {
      setProductImg(null);
      setError("Por favor, selecione uma imagem válida (png ou jpeg).");
    }
  };

  const btnAdicionar = async () => {
    if (!nomeProduto || !tamanho || !preco || !categoria || !productImg) {
      alert("Preencha todos os campos!");
      return;
    }

    const storageRef = ref(storage, `product-images/${productImg.name}`);
    const uploadTask = uploadBytesResumable(storageRef, productImg);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progresso: ${progress}%`);
      },
      (err) => {
        setError(err.message);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "produtos"), {
            nome: nomeProduto,
            tamanho: tamanho,
            preco: parseFloat(preco),
            categoria: categoria,
            imagem: url,
          });

          setNomeProduto("");
          setTamanho("");
          setPreco("");
          setCategoria("");
          setProductImg(null);
          document.getElementById("file").value = "";
          alert("Produto adicionado com sucesso!");
        } catch (error) {
          console.error("Erro ao adicionar o documento: ", error);
          alert("Erro ao adicionar o documento.");
        }
      }
    );
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admHome")} // Redireciona para a página admHome
          >
          voltar
          </button>
          <h2 className="mb-0 text-center flex-grow-1">Adicionar Produto</h2>
        </div>

        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            onChange={(e) => setNomeProduto(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Nome do produto"
            value={nomeProduto}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tamanho</label>
          <input
            onChange={(e) => setTamanho(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Tamanho do produto"
            value={tamanho}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Valor</label>
          <input
            onChange={(e) => setPreco(e.target.value)}
            type="number"
            className="form-control"
            placeholder="Valor do produto (ex.: 120.00)"
            value={preco}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoria do produto</label>
          <input
            onChange={(e) => setCategoria(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Categoria do produto (ex.: Camiseta)"
            value={categoria}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Imagem do produto</label>
          <input
            onChange={productImgHandler}
            type="file"
            className="form-control"
            placeholder="Insira a imagem do produto"
            id="file"
          />
          {error && <p className="text-danger">{error}</p>}
        </div>

        <button onClick={btnAdicionar} className="btn btn-primary w-100">
          Adicionar Produto
        </button>
      </div>
    </div>
  );
}
