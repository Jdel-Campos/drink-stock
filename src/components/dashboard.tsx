'use client'

import { PiNewspaperClippingThin, PiPencilSimpleLineThin } from "react-icons/pi";
import React, {useEffect, useState} from "react";
import { ModalRegister } from "./modal";
import jsPDF from "jspdf"
import "jspdf-autotable";

export function Dashboard () {
    const [lastUpdate, setLastUpdate] = useState <string> (() => {
        return `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`;
    });

    const [isModalRegister, setIsModalRegister] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState (true);
    const [error, setError] = useState ("")

    const openModal = () => setIsModalRegister(true);
    const closeModal = () => {
        setIsModalRegister(false);
        fetchProducts()
    }

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/product", {
                method: "GET",
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao buscar produtos");
            }
        
            const result = await response.json();
            setProducts(result.data);
            setLastUpdate(
                `${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString("pt-BR")}`
            );
            } catch (err: any) {
            console.error("Erro ao buscar produtos:", err.message);
            setError(err.message);
            } finally {
            setLoading(false);
            }
    };

    useEffect (() => {
        fetchProducts ()
    }, [])

    const generateReport = async () => {
        try {
            const response = await fetch("/api/report", { method: "GET" })

            if ( !response.ok ) {
                const errorData = await response.json();
                throw new Error (errorData.message || "Erro ao gerar relatório");
            }

            const result = await response.json()
            const doc = new jsPDF();

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Relatório de Entradas e Saídas - Último Mês", 20, 20);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, 30);

            doc.autoTable({
                startY: 40,
                head: [
                  ["Produto", "Categoria", "Quantidade", "Validade", "Tipo", "Evento", "Data", "Última Atualização"],
                ],
                body: result.data.map((item: any) => [
                  item.name,
                  item.category,
                  item.quantity,
                  item.validity ? new Date(item.validity).toLocaleDateString("pt-BR") : "N/A", // Validade formatada
                  item.record_type,
                  item.used_event || "N/A", // Evento ou "N/A" se não existir
                  new Date(item.entry_date).toLocaleDateString("pt-BR"), // Data de entrada formatada
                  item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("pt-BR") : "N/A", // Última atualização
                ]),
            });

            doc.save("relatorio.pdf");
        } catch (err: any) {
            console.error("Erro ao gerar relatório:", err.message);
            alert("Erro ao gerar relatório. Tente novamente.");
        }
    }

    return(
        <div className="min-h-screen p-6">
                <h1 className="text-3xl font-bold text-center mb-12"> Dashboard de Bebidas </h1>
            <div className="flex justify-around ">
                <div className="flex justify-between boder border-2 border-gray-600 rounded-md">
                    <div className="font-bold px-4 py-2 rounded-md"> Ultima Atualização: </div>
                    <div className="font-bold px-4 py-2 rounded-md"> {lastUpdate} </div>
                </div>
                <div className="flex justify-evenly">
                    <button className="flex items-center mx-4 bg-gray-100 rounded-md" onClick={openModal}>
                        <div className="bg-gray-100 font-bold px-4 py-2 rounded-md"> Registrar </div>
                        <PiPencilSimpleLineThin className="text-2xl text-center mr-4"/>
                    </button>
                    <button className="flex items-center mx-4 bg-gray-100 rounded-md" onClick={generateReport}>
                        <div className="bg-gray-100 font-bold px-4 py-2 rounded-md"> Gerar Relatorio </div>
                        <PiNewspaperClippingThin className="text-2xl text-center mr-4"/>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto flex justify-center mt-8">
                <table className="table-auto w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-500 text-white">
                    <tr>
                    <th className="px-4 py-2 text-center">Produto</th>
                    <th className="px-4 py-2 text-center">Categoria</th>
                    <th className="px-4 py-2 text-center">Quantidade em Estoque</th>
                    <th className="px-4 py-2 text-center">Data de Validade</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                    <tr>
                        <td colSpan={4} className="text-center py-4">
                        Carregando...
                        </td>
                    </tr>
                    ) : error ? (
                    <tr>
                        <td colSpan={4} className="text-center text-red-500 py-4">
                        {error}
                        </td>
                    </tr>
                    ) : products.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="text-center py-4">
                        Nenhum produto encontrado.
                        </td>
                    </tr>
                    ) : (
                    products.map((product: any) => (
                        <tr key={product._id} className="text-center">
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">{product.category}</td>
                        <td className="px-4 py-2">{product.quantity}</td>
                        <td className="px-4 py-2">
                            {product.validity ? new Date(product.validity).toLocaleDateString("pt-BR") : "N/A"}
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
            {isModalRegister && <ModalRegister closeModal={closeModal} />}
        </div>
    );
};