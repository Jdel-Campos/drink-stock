import { NextResponse } from "next/server";
import connectDB from "@/ultis/mongodb";
import Product from "@/model/product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, category, quantity, validity, record_type, used_event } = await req.json();
    const existingProduct = await Product.findOne({name, category});

    if ( record_type === "Entrada" ) {
      if ( existingProduct ) {
        existingProduct.quantity += quantity;
        await existingProduct.save();
  
        return NextResponse.json({
          sucess: true,
          mensage: "Quantidade atualizada para o produto existente.",
          data: existingProduct
        });
  
      } else {
        const newProduct = await Product.create({
          name,
          category,
          quantity,
          validity,
          record_type,
          used_event,
        });
    
        return NextResponse.json({
          success: true,
          message: "Produto criado com sucesso!",
          data: newProduct,
        });
      };
    } else if ( record_type === "Saída" ) {
      if ( !existingProduct ) {
        return NextResponse.json(
          { success: false, message: "Produto não encontrado para saída." },
          { status: 404 }
        )
      }
      if (existingProduct.quantity < quantity) {
        return NextResponse.json(
          { success: false, message: "Quantidade insuficiente no estoque." },
          { status: 400 }
        );
      }
      existingProduct.quantity -= quantity;
      await existingProduct.save();

      return NextResponse.json({
        success: true,
        message: "Quantidade reduzida para o produto existente.",
        data: existingProduct,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Tipo de registro inválido." },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error("Erro ao criar produto:", error.message);
    return NextResponse.json(
      { success: false, message: "Erro ao criar produto.", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  try {
    const products = await Product.find();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("Erro ao buscar produtos:", error.message);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar produtos.", error: error.message },
      { status: 500 }
    );
  }
};