import { useState } from "react";
export default function AddProduto() {
  const [nomeProduto, setNomeProduto] = useState([]);
  const [tamanho, setTamanho] = useState([]);
  const [preco, setPreco] = useState([]);
  const [categoria, setCategoria] = useState([]);

  return (
    <div className="pageColumn">
      <input
        onChange={(e) => setNomeProduto(e.target.value)}
        type="text"
        placeholder="Nome do produto"
      />
      <input
        onChange={(e) => setTamanho(e.target.value)}
        type="text"
        placeholder="Tamanho do produto"
      />
      <input
        onChange={(e) => setPreco(e.target.value)}
        type="price"
        placeholder="Valor do produto"
      />
      <input
        onChange={(e) => setCategoria(e.target.value)}
        type="text"
        placeholder="Categoria do produto (ex: Camiseta)"
      />
    </div>
  );
}
