import { useState } from "react";
import { db, storage } from "../services/firebaseconfig"; // Assuming you have both db and storage configured
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function AddProduto() {
  const [nomeProduto, setNomeProduto] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [productImg, setProductImg] = useState(null);
  const [error, setError] = useState("");

  const types = ["image/png", "image/jpeg"]; // Valid image types

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

    const storageRef = ref(storage, `product-images/${productImg.name}`); // Use storage instead of db
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

          // Clear the form fields
          setNomeProduto("");
          setTamanho("");
          setPreco("");
          setCategoria("");
          setProductImg(null);
          document.getElementById("file").value = ""; // Clear file input
          alert("Produto adicionado com sucesso!");
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Erro ao adicionar o documento.");
        }
      }
    );
  };

  return (
    <div className="pageColumn">
      <input
        onChange={(e) => setNomeProduto(e.target.value)}
        type="text"
        placeholder="Nome do produto"
        value={nomeProduto}
      />
      <input
        onChange={(e) => setTamanho(e.target.value)}
        type="text"
        placeholder="Tamanho do produto"
        value={tamanho}
      />
      <input
        onChange={(e) => setPreco(e.target.value)}
        type="number"
        placeholder="Valor do produto"
        value={preco}
      />
      <input
        onChange={(e) => setCategoria(e.target.value)}
        type="text"
        placeholder="Categoria do produto (ex: Camiseta)"
        value={categoria}
      />
      <input
        onChange={productImgHandler}
        type="file"
        placeholder="Insira a imagem do produto"
        id="file"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={btnAdicionar}>Adicionar</button>
    </div>
  );
}
