import React, { useState } from 'react';

const Checkout = () => {
  const [formData, setFormData] = useState({
    cep: '',
    numero: '',
    rua: '',
    complemento: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dados de entrega ou armazenar no localStorage
    localStorage.setItem('dadosEntrega', JSON.stringify(formData));
    alert('Dados de entrega salvos com sucesso!');
    // Redirecionar ou continuar com o fluxo da compra
  };

  return (
    <div className="container mt-5">
      <h2>Informações de Entrega</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>CEP</label>
          <input
            type="text"
            name="cep"
            className="form-control"
            value={formData.cep}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Número</label>
          <input
            type="text"
            name="numero"
            className="form-control"
            value={formData.numero}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label>Rua</label>
          <input
            type="text"
            name="rua"
            className="form-control"
            value={formData.rua}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Complemento (opcional)</label>
          <input
            type="text"
            name="complemento"
            className="form-control"
            value={formData.complemento}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Finalizar Compra</button>
      </form>
    </div>
  );
};

export default Checkout;
