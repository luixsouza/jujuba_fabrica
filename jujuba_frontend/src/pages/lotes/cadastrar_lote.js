"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Trash2, Eye } from "lucide-react"
import { salvarLote, listarLotes } from "../api/lotes"
import Sidebar from "../../components/sidebar"

export default function CadastroLotePage() {
  const router = useRouter()
  const [loteId, setLoteId] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [fornecedoraId, setFornecedoraId] = useState("")
  const [items, setItems] = useState([])
  const [lotesSidebar, setLotesSidebar] = useState([])
  const [fornecedoras, setFornecedoras] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [novoItem, setNovoItem] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "Ótimo",
    preco: "",
    genero: "",
    quantidade: 1,
    imagem: "/placeholder.svg?height=80&width=80",
  })

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true)
    // Generate random ID only on the client side
    setLoteId(`L${String(Math.floor(Math.random() * 900) + 100)}`)

    // Carregar lotes para a barra lateral
    fetchLotes()

    // Carregar fornecedoras
    fetchFornecedoras()
  }, [])

  const fetchLotes = async () => {
    try {
      setLoading(true)
      const response = await listarLotes()
      if (response.data) {
        // Formatar os dados para exibição na barra lateral
        const lotesFormatados = response.data
          .map((lote) => ({
            id: lote.id,
            codigo: `L${lote.id}`,
            data: new Date(lote.dataCriacao).toLocaleDateString("pt-BR"),
          }))
          .slice(0, 5) // Limitar a 5 lotes para a barra lateral

        setLotesSidebar(lotesFormatados)
      }
    } catch (error) {
      console.error("Erro ao buscar lotes:", error)
      setError("Não foi possível carregar os lotes.")
    } finally {
      setLoading(false)
    }
  }

  const fetchFornecedoras = async () => {
    try {
      setLoading(true)
      // Aqui você precisaria de um endpoint para buscar fornecedoras
      // Como não temos esse endpoint na API fornecida, vamos simular
      // Em um caso real, você substituiria isso por uma chamada à API
      const response = await fetch("http://localhost:8080/api/fornecedoras")
      if (response.ok) {
        const data = await response.json()
        setFornecedoras(data)
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedoras:", error)
      setError("Não foi possível carregar as fornecedoras.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovoItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddItem = () => {
    // Validação básica
    if (!novoItem.descricao || !novoItem.preco) {
      alert("Por favor, preencha pelo menos a descrição e o valor")
      return
    }

    const newItem = {
      id: Date.now(), // ID temporário para manipulação na interface
      imagem: novoItem.imagem,
      descricao: novoItem.descricao,
      marca: novoItem.marca,
      tamanho: novoItem.tamanho,
      estadoConservacao: novoItem.estadoConservacao,
      preco: Number.parseFloat(novoItem.preco),
      genero: novoItem.genero || "Unisex",
      quantidade: Number.parseInt(novoItem.quantidade) || 1,
    }

    setItems((prev) => [...prev, newItem])

    // Limpar o formulário
    setNovoItem({
      descricao: "",
      marca: "",
      tamanho: "",
      estadoConservacao: "Ótimo",
      preco: "",
      genero: "",
      quantidade: 1,
      imagem: "/placeholder.svg?height=80&width=80",
    })
  }

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleViewItem = (id) => {
    const item = items.find((item) => item.id === id)
    if (item) {
      alert(
        `Detalhes do item: ${item.descricao}\nValor: R$ ${item.preco.toFixed(2)}\nMarca: ${item.marca}\nTamanho: ${item.tamanho}`,
      )
    }
  }

  const handleFinalizarLote = async () => {
    if (items.length === 0) {
      alert("Adicione pelo menos um item ao lote antes de finalizar.")
      return
    }

    if (!fornecedoraId) {
      alert("Selecione uma fornecedora para o lote.")
      return
    }

    try {
      setLoading(true)
      // Chamar a API para salvar o lote
      await salvarLote(fornecedoraId, items)

      alert(`Lote finalizado com ${items.length} itens!`)
      router.push("./lotes_geral")
    } catch (error) {
      console.error("Erro ao finalizar lote:", error)
      setError("Não foi possível finalizar o lote.")
      alert("Erro ao finalizar lote. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    router.push("./lotes_geral")
  }

  const handleGoHome = () => {
    router.push("../fornecedores/fornecedores_tabela")
  }

  const calcularValorTotal = () => {
    return items.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  return (
    <>
      <style jsx>{`
        .container {
          display: flex;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .main-content {
          flex: 1;
          margin-left: 244px;
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

        .pink-button:disabled {
          background: #f5f5f5;
          color: #999;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* Responsive styles */
        @media (max-width: 1024px) {
          .main-content {
            margin-left: 244px;
          }
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
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

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-size: 18px;
          color: #666;
        }

        .error {
          background-color: #fee2e2;
          color: #ef4444;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 16px;
        }
      `}</style>

      <div className="container">
        <Sidebar lotes={lotesSidebar} />

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

          {error && <div className="error">{error}</div>}

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
              name="preco"
              value={novoItem.preco}
              onChange={handleInputChange}
              step="0.01"
            />
            <input
              type="number"
              className="input-field"
              placeholder="Quantidade"
              name="quantidade"
              value={novoItem.quantidade}
              onChange={handleInputChange}
              min="1"
            />
            <select className="select-field" name="genero" value={novoItem.genero} onChange={handleInputChange}>
              <option value="">Selecione o gênero</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Unisex">Unisex</option>
            </select>
            <select className="select-field" value={fornecedoraId} onChange={(e) => setFornecedoraId(e.target.value)}>
              <option value="">Selecione a fornecedora</option>
              {fornecedoras.map((f) => (
                <option key={f.id} value={f.id}>
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
                  <th>Quantidade</th>
                  <th>Marca</th>
                  <th>Tamanho</th>
                  <th>Gênero</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center" }}>
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
                      <td>R$ {item.preco.toFixed(2).replace(".", ",")}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.marca || "-"}</td>
                      <td>{item.tamanho || "-"}</td>
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
                    <td colSpan={6} style={{ fontWeight: "bold" }}>
                      R$ {calcularValorTotal().toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="buttons-container">
            <button className="pink-button" onClick={handleAddItem} disabled={loading}>
              Adicionar Item
            </button>
            <button
              className="pink-button"
              onClick={handleFinalizarLote}
              disabled={loading || items.length === 0 || !fornecedoraId}
            >
              {loading ? "Processando..." : "Finalizar Lote"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
