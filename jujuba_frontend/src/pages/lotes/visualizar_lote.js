"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Eye, Home, Pencil, User, Package, ShoppingCart, List } from "lucide-react"

export default function VisualizarLotePage() {
  const [items, setItems] = useState([
    {
      imagem: "/placeholder.svg?height=80&width=80",
      descricao: "Camisa Lacoste (Original) Tamanho 8 anos",
      estadoConservacao: "Ótimo",
      valor: 89.9,
      codigo: "ALC222333",
      genero: "Masc",
    },
    {
      imagem: "/placeholder.svg?height=80&width=80",
      descricao: "Crocs Minnie Tamanho 19/20",
      estadoConservacao: "Ótimo",
      valor: 68.9,
      codigo: "ALC352333",
      genero: "Fem",
    },
  ])

  const lotes = [
    { codigo: "A321", data: "31/02/2025" },
    { codigo: "B321", data: "03/08/2024" },
    { codigo: "C123", data: "21/06/2024" },
    { codigo: "K123", data: "12/04/2024" },
    { codigo: "L569", data: "10/04/2024" },
    { codigo: "M123", data: "07/03/2024" },
  ]

  return (
    <>
      <style jsx>{`
        .container {
          display: flex;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 276px;
          background-color: #f8c0e0;
          display: flex;
          flex-direction: column;
          padding: 20px;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin: 20px 0 40px;
        }

        .logo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .menu-item {
          display: flex;
          align-items: center;
          color: #6b7280;
          margin-bottom: 16px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .menu-item:hover {
          background-color: rgba(255,255,255,0.5);
          transform: translateX(5px);
        }

        .menu-item svg {
          margin-right: 12px;
        }

        .lotes-list {
          margin-top: 40px;
        }

        .lotes-list h3 {
          color: #6b7280;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: bold;
        }

        .lote-item {
          display: flex;
          justify-content: space-between;
          background-color: #ffd0e8;
          padding: 8px 12px;
          margin-bottom: 6px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .lote-item:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .main-content {
          flex: 1;
          margin-left: 276px;
          background-color: #a3e0f5;
          padding: 32px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
        }

        .header-title {
          text-align: center;
        }

        .header-title h1 {
          font-size: 40px;
          font-weight: 800;
          color: #333;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          margin-bottom: 12px;
        }

        .header-title p {
          color: #666;
          font-size: 18px;
        }

        .nav-button {
          background: transparent;
          border-radius: 50%;
          padding: 12px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          color: #333;
        }

        .nav-button:hover {
          transform: scale(1.1);
          color: #000;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .input-readonly {
          padding: 20px; /* Increased padding */
          border-radius: 10px; /* Slightly more rounded */
          border: none;
          background-color: #f8f8f8;
          width: 100%;
          font-size: 17px; /* Larger font */
          color: #555; /* Slightly darker text for better readability */
          box-shadow: 0 8px 15px rgba(0,0,0,0.15); /* Enhanced shadow */
          transition: all 0.3s ease;
          min-height: 65px; /* Ensure minimum height */
          display: flex;
          align-items: center;
        }

        .input-readonly:hover {
          box-shadow: 0 10px 20px rgba(0,0,0,0.18); /* Shadow grows on hover */
          transform: translateY(-2px); /* Slight lift effect */
        }

        .table-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.15); /* Enhanced shadow */
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        th {
          background: #ffd0e8;
          text-align: left;
          padding: 16px; /* Larger padding */
          font-weight: 600;
          font-size: 17px; /* Larger font */
          border-top: 1px solid #ffc0e0;
          border-bottom: 1px solid #ffc0e0;
        }

        th:first-child {
          border-top-left-radius: 10px; /* More rounded */
          border-left: 1px solid #ffc0e0;
        }

        th:last-child {
          border-top-right-radius: 10px; /* More rounded */
          border-right: 1px solid #ffc0e0;
        }

        td {
          padding: 16px; /* Larger padding */
          border-bottom: 1px solid #eee;
          font-size: 16px; /* Larger font */
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover td {
          background-color: #f9f9f9;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .action-button {
          color: #2563eb;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px; /* Larger padding */
          border-radius: 6px; /* More rounded */
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #f0f7ff;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Added shadow on hover */
        }

        .center-button {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .pink-button {
          background: #ffd0e8;
          border: none;
          padding: 18px 50px; /* Larger button */
          border-radius: 9999px;
          font-weight: 600;
          font-size: 18px; /* Larger font */
          cursor: pointer;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15); /* Enhanced shadow */
          transition: all 0.3s ease;
        }

        .pink-button:hover {
          background: #ffb0d8;
          box-shadow: 0 12px 24px rgba(0,0,0,0.2); /* Enhanced shadow on hover */
          transform: translateY(-4px); /* More pronounced lift */
        }
      `}</style>

      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo-container">
            <div className="logo">
              <Image src="/placeholder.svg?height=80&width=80" alt="Jujuba Logo" width={100} height={40} />
            </div>
          </div>

          <div>
            <div className="menu-item">
              <User size={20} />
              <span>Fornecedores</span>
            </div>
            <div className="menu-item">
              <Package size={20} />
              <span>Estoque</span>
            </div>
            <div className="menu-item">
              <ShoppingCart size={20} />
              <span>Vendas</span>
            </div>
            <div className="menu-item">
              <List size={20} />
              <span>Lotes</span>
            </div>
          </div>

          <div className="lotes-list">
            <h3>Lista de Lotes</h3>
            {lotes.map((lote) => (
              <div key={lote.codigo} className="lote-item">
                <span>{lote.codigo}</span>
                <span>{lote.data}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <header className="header">
            <button className="nav-button">
              <ArrowLeft size={20} />
            </button>
            <div className="header-title">
              <h1>VISUALIZAR LOTE</h1>
              <p>Lote:123</p>
            </div>
            <button className="nav-button">
              <Home size={20} />
            </button>
          </header>

          <div className="form-grid">
            <div className="input-readonly">Camisa Lacoste (Original)</div>
            <div className="input-readonly">Lacoste</div>
            <div className="input-readonly">Tamanho 8 anos</div>
            <div className="input-readonly">Ótimo</div>
            <div className="input-readonly">R$ 89,90</div>
            <div className="input-readonly">Fornecedor ABC</div>
            <div className="input-readonly">Masculino</div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Descrição</th>
                  <th>Estado de conservação</th>
                  <th>Valor</th>
                  <th>Código do Produto</th>
                  <th>Genero</th>
                  <th style={{ textAlign: "center" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Image
                        src={item.imagem || "/placeholder.svg"}
                        alt={item.descricao}
                        width={80}
                        height={80}
                        style={{ borderRadius: "10px" }}
                      />
                    </td>
                    <td>{item.descricao}</td>
                    <td>{item.estadoConservacao}</td>
                    <td>R$ {item.valor.toFixed(2).replace(".", ",")}</td>
                    <td>{item.codigo}</td>
                    <td>{item.genero}</td>
                    <td>
                      <div className="actions">
                        <button className="action-button">
                          <Eye size={22} />
                        </button>
                        <button className="action-button">
                          <Pencil size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="center-button">
            <button className="pink-button">Adicionar Item</button>
          </div>
        </div>
      </div>
    </>
  )
}

