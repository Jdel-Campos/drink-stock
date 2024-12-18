import { MongooseCache } from "@/type/mongo_type";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Por favor, defina a variável MONGODB_URI no arquivo .env");
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        console.log("Usando conexão existente com MongoDB");
        return cached.conn;
    }

    if (!cached.promise) {
      console.log("Iniciando nova conexão com MongoDB...");
      cached.promise = mongoose.connect(MONGODB_URI)
        .then((mongoose) => {
          console.log("Conexão ao MongoDB estabelecida com sucesso!");
          return mongoose;
        })
        .catch((error) => {
          console.error("Erro ao conectar ao MongoDB:", error);
          throw error;
        });
    }

    cached.conn = await cached.promise;

    if (process.env.NODE_ENV === "development") {
      mongoose.set("debug", true);
    }

    return cached.conn;
}

export default connectDB;
