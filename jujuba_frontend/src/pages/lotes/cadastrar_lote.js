"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, Eye, Home, Pencil, Upload, User, Package, ShoppingCart, List } from "lucide-react"

export default function NovoLotePage() {
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

  const fileInputRef = useRef(null)

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Handle the file upload here
      console.log("File selected:", file.name)
      // You would typically upload the file to a server or process it here
    }
  }

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
          background-color: #f8c0e0; /* Changed from yellow to pink */
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
          background-color: #ffd0e8; /* Changed from yellow to pink */
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
          margin-bottom: 12px; /* Added margin to create space */
        }

        .header-title p {
          color: #666;
          font-size: 18px;
        }

        .nav-button {
          background: transparent; /* Changed from white to transparent */
          border-radius: 50%;
          padding: 12px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          color: #333; /* Added to ensure icon is visible */
        }

        .nav-button:hover {
          transform: scale(1.1);
          color: #000; /* Darker on hover */
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .input, .select {
          padding: 16px; /* Larger inputs */
          border-radius: 8px;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          width: 100%;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .input:focus, .select:focus {
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        .select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }

        .upload-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: white;
          border: none;
          border-radius: 8px;
          padding: 16px; /* Larger button */
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .upload-button:hover {
          background: #f8f8f8;
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        .table-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        th {
          background: #ffd0e8; /* Changed from yellow to pink */
          text-align: left;
          padding: 14px;
          font-weight: 600;
          font-size: 16px;
          border-top: 1px solid #ffc0e0;
          border-bottom: 1px solid #ffc0e0;
        }

        th:first-child {
          border-top-left-radius: 8px;
          border-left: 1px solid #ffc0e0;
        }

        th:last-child {
          border-top-right-radius: 8px;
          border-right: 1px solid #ffc0e0;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #eee;
          font-size: 15px;
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
          padding: 6px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #f0f7ff;
          transform: scale(1.1);
        }

        .bottom-buttons {
          display: flex;
          justify-content: space-between;
        }

        .yellow-button {
          background: #ffd0e8; /* Changed from yellow to pink */
          border: none;
          padding: 16px 40px; /* Larger buttons */
          border-radius: 9999px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .yellow-button:hover {
          background: #ffb0d8; /* Darker pink on hover */
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          transform: translateY(-3px);
        }

        .hidden-input {
          display: none;
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
              <h1>NOVO LOTE: C123</h1>
              <p>Adicionando item</p>
            </div>
            <button className="nav-button">
              <Home size={20} />
            </button>
          </header>

          <div className="form-grid">
            <input type="text" placeholder="DESCRIÇÃO" className="input" />
            <input type="text" placeholder="MARCA" className="input" />
            <input type="text" placeholder="TAMANHO" className="input" />

            <select className="select">
              <option value="">ESTADO DE CONSERVAÇÃO</option>
              <option value="otimo">Ótimo</option>
              <option value="bom">Bom</option>
              <option value="regular">Regular</option>
            </select>

            <input type="text" placeholder="VALOR" className="input" />
            <input type="text" placeholder="FORNECEDOR" className="input" />

            <select className="select">
              <option value="">GÊNERO</option>
              <option value="masc">Masculino</option>
              <option value="fem">Feminino</option>
              <option value="unisex">Unisex</option>
            </select>

            <button className="upload-button" onClick={handleUploadClick}>
              <Upload size={20} />
              ADICIONAR IMAGEM
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden-input"
              accept="image/*"
            />
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
                        width={70}
                        height={70}
                        style={{ borderRadius: "8px" }}
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
                          <Eye size={20} />
                        </button>
                        <button className="action-button">
                          <Pencil size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bottom-buttons">
            <button className="yellow-button">Adicionar Item</button>
            <button className="yellow-button">Finalizar Lote</button>
          </div>
        </div>
      </div>
    </>
  )
}

