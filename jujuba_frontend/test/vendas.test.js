// test/vendas.int.test.js
import {
  listarVendasRealizadas,
  buscarVendaPorId,
  criarVenda,
  atualizarVenda,
  excluirVenda,
  finalizarVendaFornecedora,
  finalizarVendaSimples,
} from "../src/pages/api/vendas.js";

describe("API Vendas - Testes de Integração", () => {
  const vendaNova = {
    total: 200,
    fornecedoraId: 1, // ajuste para um ID valido no  banco
    itens: [
      { produtoId: 1, quantidade: 2, preco: 100 }, // ajuste para um produto valido no bd 
    ],
  };

  let vendaCriada = null;

  it("deve criar uma venda no backend", async () => {
    const result = await criarVenda(vendaNova);
    expect(result.sucesso).toBe(true);
    expect(result.venda.id).toBeDefined();
    vendaCriada = result.venda;
  });

  it("deve listar vendas realizadas no backend", async () => {
    const result = await listarVendasRealizadas();
    expect(result.sucesso).toBe(true);
    expect(result.vendas.length).toBeGreaterThan(0);
  });

  it("deve buscar uma venda por ID no backend", async () => {
    const result = await buscarVendaPorId(vendaCriada.id);
    expect(result.sucesso).toBe(true);
    expect(result.venda.id).toBe(vendaCriada.id);
  });

  it("deve atualizar uma venda no backend", async () => {
    const atualizado = { ...vendaCriada, total: 300 };
    const result = await atualizarVenda(vendaCriada.id, atualizado);
    expect(result.sucesso).toBe(true);
    expect(result.venda.total).toBe(300);
  });

  it("deve finalizar venda para fornecedora no backend", async () => {
    const result = await finalizarVendaFornecedora(vendaCriada.fornecedoraId);
    expect(result.sucesso).toBe(true);
    expect(result.venda.id).toBeDefined();
  });

  it("deve finalizar venda simples no backend", async () => {
    const result = await finalizarVendaSimples();
    expect(result.sucesso).toBe(true);
    expect(result.venda.id).toBeDefined();
  });

  it("deve excluir uma venda no backend", async () => {
    const result = await excluirVenda(vendaCriada.id);
    expect(result.sucesso).toBe(true);
  });
});
