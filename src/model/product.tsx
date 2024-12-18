import mongoose, { Schema, Document, Types } from "mongoose";

// Subdocumento para operações
interface Operation {
  entry_date: Date; // Data da operação
  quantity: number; // Quantidade da operação
  validity?: Date; // Validade (apenas para entradas)
  record_type: "Entrada" | "Saída"; // Tipo da operação
  used_event?: string; // Evento (apenas para saídas)
}

// Interface do Produto
export interface Product extends Document {
  name: string;
  category: string;
  quantity: number; // Estoque atual
  operations: Types.DocumentArray<Operation>; // Array de operações
}

// Schema de Operações
const OperationSchema: Schema = new Schema({
  entry_date: { type: Date, default: Date.now, required: true },
  quantity: { type: Number, required: true },
  validity: { type: Date }, // Opcional
  record_type: { type: String, enum: ["Entrada", "Saída"], required: true },
  used_event: { type: String }, // Opcional
});

// Schema de Produtos
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 }, // Estoque atual
  operations: [OperationSchema], // Array de operações
});

export default mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema);