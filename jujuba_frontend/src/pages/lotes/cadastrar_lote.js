"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Eye, Home, Pencil, Upload } from "lucide-react"
import Sidebar from "../../components/sidebar"

export default function NovoLotePage() {
  const [items, setItems] = useState([])
  const [lotes, setLotes] = useState([])
  const [loading, setLoading] = useState({
    items: false,
    lotes: false,
  })
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  
  const fetchItems = async () => {
    try {
      setLoading((prev) => ({ ...prev, items: true }))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`)

      if (!response.ok) {
        throw new Error("Failed to fetch items")
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error("Error fetching items:", err)
      setError("Failed to load items. Please try again.")
      setItems([]) // Set empty array instead of mock data
    } finally {
      setLoading((prev) => ({ ...prev, items: false }))
    }
  }

  // Fetch lotes data from API
  const fetchLotes = async () => {
    try {
      setLoading((prev) => ({ ...prev, lotes: true }))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lotes`)

      if (!response.ok) {
        throw new Error("Failed to fetch lotes")
      }

      const data = await response.json()
      setLotes(data)
    } catch (err) {
      console.error("Error fetching lotes:", err)
      setError("Failed to load lotes. Please try again.")
      setLotes([]) // Set empty array instead of mock data
    } finally {
      setLoading((prev) => ({ ...prev, lotes: false }))
    }
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchItems()
    fetchLotes()
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append("image", file)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }


        fetchItems()
      } catch (err) {
        console.error("Error uploading image:", err)
        setError("Failed to upload image. Please try again.")
      }
    }
  }

 
  const handleAddItem = async () => {
    
  }

  return (
    <div className="container">
      {/* Import the Sidebar component */}
      <Sidebar lotes={lotes} />

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

        {error && <div className="error-message">{error}</div>}

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
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden-input" accept="image/*" />
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
              {loading.items ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                    Carregando itens...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Image
                        src={item.imagem || "/placeholder.svg?height=80&width=80"}
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
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                    Nenhum item encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bottom-buttons">
          <button className="yellow-button" onClick={handleAddItem}>
            Adicionar Item
          </button>
          <button className="yellow-button">Finalizar Lote</button>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          font-family: Arial, sans-serif;
          background-color: #a3e0f5;
        }

        .main-content {
          flex: 1;
          margin-left: 276px;
          background-color: #a3e0f5;
          padding: 32px;
          min-height: 100vh;
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

        .input, .select {
          padding: 16px;
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
          padding: 16px;
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
          background: #ffd0e8;
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
          background: #ffd0e8;
          border: none;
          padding: 16px 40px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .yellow-button:hover {
          background: #ffb0d8;
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          transform: translateY(-3px);
        }

        .hidden-input {
          display: none;
        }

        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

