"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, User, Package, ShoppingCart, List, Trash2, Eye } from "lucide-react"

// Dados mockados para os lotes na barra lateral
const mockLotesSidebar = [
  { codigo: "L001", data: "15/03/2023" },
  { codigo: "L002", data: "20/04/2023" },
  { codigo: "L003", data: "10/05/2023" },
]

// Dados mockados para fornecedoras
const mockFornecedoras = [
  { id: 1, nome: "Fornecedora ABC Ltda" },
  { id: 2, nome: "Distribuidora XYZ S.A." },
  { id: 3, nome: "Indústria Têxtil Nacional" },
  { id: 4, nome: "Confecções Moda Brasil" },
  { id: 5, nome: "Tecidos & Cia" },
]

export default function CadastroLotePage() {
  const router = useRouter()
  // Use a fixed ID to avoid hydration errors
  const [loteId, setLoteId] = useState("L000")
  const [isClient, setIsClient] = useState(false)
  const [fornecedora, setFornecedora] = useState("")
  const [items, setItems] = useState([])
  const [novoItem, setNovoItem] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "Ótimo",
    valor: "",
    genero: "",
    imagem: "/placeholder.svg?height=80&width=80",
  })

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true)
    // Generate random ID only on the client side
    setLoteId(`L${String(Math.floor(Math.random() * 900) + 100)}`)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovoItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddItem = () => {
    // Validação básica
    if (!novoItem.descricao || !novoItem.valor) {
      alert("Por favor, preencha pelo menos a descrição e o valor")
      return
    }

    const newItem = {
      id: items.length + 1,
      imagem: novoItem.imagem,
      descricao: novoItem.descricao,
      estadoConservacao: novoItem.estadoConservacao,
      valor: Number.parseFloat(novoItem.valor),
      codigo: `ALC${Math.floor(Math.random() * 900000) + 100000}`,
      genero:
        novoItem.genero === "Masculino" ? "Masc" : novoItem.genero === "Feminino" ? "Fem" : novoItem.genero || "Unisex",
    }

    setItems((prev) => [...prev, newItem])

    // Limpar o formulário
    setNovoItem({
      descricao: "",
      marca: "",
      tamanho: "",
      estadoConservacao: "Ótimo",
      valor: "",
      genero: "",
      imagem: "/placeholder.svg?height=80&width=80",
    })
  }

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleViewItem = (id) => {
    const item = items.find((item) => item.id === id)
    if (item) {
      alert(`Detalhes do item: ${item.descricao}\nValor: R$ ${item.valor.toFixed(2)}\nCódigo: ${item.codigo}`)
    }
  }

  const handleFinalizarLote = () => {
    if (items.length === 0) {
      alert("Adicione pelo menos um item ao lote antes de finalizar.")
      return
    }

    if (!fornecedora) {
      alert("Selecione uma fornecedora para o lote.")
      return
    }

    alert(`Lote ${loteId} finalizado com ${items.length} itens!`)
    router.push("./")
  }

  const handleGoBack = () => {
    router.push("./lotes_geral")
  }

  const handleGoHome = () => {
    router.push("../fornecedores/fornecedores_tabela")
  }

  const calcularValorTotal = () => {
    return items.reduce((total, item) => total + item.valor, 0)
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
          background-color: #f8c0e0;
          display: flex;
          flex-direction: column;
          padding: 20px;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          z-index: 10;
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

        .input-field {
          padding: 20px;
          border-radius: 10px;
          border: none;
          background-color: #f8f8f8;
          width: 100%;
          font-size: 17px;
          color: #555;
          box-shadow: 0 8px 15px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          min-height: 65px;
        }

        .input-field:focus {
          outline: none;
          box-shadow: 0 10px 20px rgba(0,0,0,0.18);
          transform: translateY(-2px);
        }

        .select-field {
          padding: 20px;
          border-radius: 10px;
          border: none;
          background-color: #f8f8f8;
          width: 100%;
          font-size: 17px;
          color: #555;
          box-shadow: 0 8px 15px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          min-height: 65px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23555' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
          padding-right: 45px;
        }

        .select-field:focus {
          outline: none;
          box-shadow: 0 10px 20px rgba(0,0,0,0.18);
          transform: translateY(-2px);
        }

        .table-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        th {
          background: #ffd0e8;
          text-align: left;
          padding: 16px;
          font-weight: 600;
          font-size: 17px;
          border-top: 1px solid #ffc0e0;
          border-bottom: 1px solid #ffc0e0;
        }

        th:first-child {
          border-top-left-radius: 10px;
          border-left: 1px solid #ffc0e0;
        }

        th:last-child {
          border-top-right-radius: 10px;
          border-right: 1px solid #ffc0e0;
        }

        td {
          padding: 16px;
          border-bottom: 1px solid #eee;
          font-size: 16px;
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
          padding: 8px;
          border-radius: 6px;
        }

        .action-button:hover {
          background: #f0f7ff;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .buttons-container {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
        }

        .pink-button {
          background: #ffd0e8;
          border: none;
          padding: 18px 50px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        .pink-button:hover {
          background: #ffb0d8;
          box-shadow: 0 12px 24px rgba(0,0,0,0.2);
          transform: translateY(-4px);
        }

        /* Responsive styles */
        @media (max-width: 1024px) {
          .sidebar {
            width: 220px;
          }
          .main-content {
            margin-left: 220px;
          }
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
          .main-content {
            margin-left: 0;
            padding: 20px;
          }
          .header-title h1 {
            font-size: 30px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .table-container {
            overflow-x: auto;
          }
          .buttons-container {
            flex-direction: column;
            gap: 16px;
          }
          .pink-button {
            width: 100%;
          }
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
            {mockLotesSidebar.map((lote) => (
              <div key={lote.codigo} className="lote-item">
                <span>{lote.codigo}</span>
                <span>{lote.data}</span>
              </div>
            ))}
          </div>
        </div>


        <div className="main-content">
          <header className="header">
            <button className="nav-button" onClick={handleGoBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="header-title">
              <h1>CADASTRAR LOTE</h1>
              <p>Lote: {isClient ? loteId : "L000"}</p>
            </div>
            <button className="nav-button" onClick={handleGoHome}>
              <Home size={20} />
            </button>
          </header>

          <div className="form-grid">
            <input
              type="text"
              className="input-field"
              placeholder="Descrição do item"
              name="descricao"
              value={novoItem.descricao}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Marca"
              name="marca"
              value={novoItem.marca}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Tamanho"
              name="tamanho"
              value={novoItem.tamanho}
              onChange={handleInputChange}
            />
            <select
              className="select-field"
              name="estadoConservacao"
              value={novoItem.estadoConservacao}
              onChange={handleInputChange}
            >
              <option value="Ótimo">Ótimo</option>
              <option value="Bom">Bom</option>
              <option value="Regular">Regular</option>
            </select>
            <input
              type="number"
              className="input-field"
              placeholder="Valor (R$)"
              name="valor"
              value={novoItem.valor}
              onChange={handleInputChange}
              step="0.01"
            />
            <select className="select-field" name="genero" value={novoItem.genero} onChange={handleInputChange}>
              <option value="">Selecione o gênero</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Unisex">Unisex</option>
            </select>
            <select className="select-field" value={fornecedora} onChange={(e) => setFornecedora(e.target.value)}>
              <option value="">Selecione a fornecedora</option>
              {mockFornecedoras.map((f) => (
                <option key={f.id} value={f.nome}>
                  {f.nome}
                </option>
              ))}
            </select>
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
                  <th>Gênero</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      Nenhum item adicionado ao lote
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
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
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleViewItem(item.id)}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                          >
                            <Eye size={20} color="#4b5563" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                          >
                            <Trash2 size={20} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {items.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                      Total:
                    </td>
                    <td colSpan={4} style={{ fontWeight: "bold" }}>
                      R$ {calcularValorTotal().toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="buttons-container">
            <button className="pink-button" onClick={handleAddItem}>
              Adicionar Item
            </button>
            <button className="pink-button" onClick={handleFinalizarLote}>
              Finalizar Lote
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

