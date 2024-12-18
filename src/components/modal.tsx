import { useState } from "react";

export function ModalRegister({ closeModal }: { closeModal: () => void }) {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    category: "",
    quantity: "",
    validity: "",
    record_type: "",
    used_event: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.record_type) {
      setError("Por favor, selecione o tipo de registro (Entrada ou Saída).");
      setLoading(false);
      return;
    }

    if (formData.record_type === "Saída" && !formData.used_event) {
      setError("O campo 'Evento' é obrigatório para registros do tipo 'Saída'.");
      setLoading(false);
      return;
    }

    try {
      const formattedValidity = formData.validity ? new Date (formData.validity).toISOString().split("t")[0] : null;
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nome,
          category: formData.category,
          quantity: Number(formData.quantity),
          validity: formattedValidity,
          record_type: formData.record_type,
          used_event: formData.used_event || null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Produto registrado com sucesso!");
        closeModal(); // Fecha o modal após o sucesso
      } else {
        setError(result.message || "Erro ao registrar o produto.");
      }
    } catch (err) {
      console.error("Erro ao conectar à API:", err);
      setError("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false); // Finalizar carregamento
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Adicionar Nova Bebida</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nome do Produto</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Categoria</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Quantidade</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Registro</label>
            <select
              name="record_type"
              value={formData.record_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="" disabled>
                Selecione o tipo de registro
              </option>
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
          </div>

          {formData.record_type === "Entrada" && (
            <div>
              <label className="block mb-1">Validade</label>
              <input
                type="date"
                name="validity"
                value={formData.validity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}

          {formData.record_type === "Saída" && (
            <div>
              <label className="block mb-1">Evento</label>
              <input
                type="text"
                name="used_event"
                value={formData.used_event}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          )}

          {/* Exibir mensagens de erro */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
