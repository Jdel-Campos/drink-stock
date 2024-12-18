import { NextResponse } from "next/server";
import connectDB from "@/ultis/mongodb";
import Product from "@/model/product";

export async function GET() {
  try {
    await connectDB();

    // Obter a data de 1 mês atrás
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Buscar produtos com `entry_date` no último mês
    const products = await Product.find({
      entry_date: { $gte: lastMonth }, // Data de entrada maior ou igual ao último mês
    }). sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error.message);
    return NextResponse.json(
      { success: false, message: "Erro ao gerar relatório." },
      { status: 500 }
    );
  }
}
