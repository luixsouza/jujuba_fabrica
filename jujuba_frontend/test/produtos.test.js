// test/produtos.int.test.js
import { 
  listarProdutos, 
  buscarProdutoPorId, 
  excluirProduto, 
  criarProduto, 
  atualizarProduto 
} from "../src/pages/api/produtos.js";

describe("API Produtos - Testes de Integração", () => {
  const produtoNovo = {
    descricao: "Produto Integração",
    marca: "Marca Teste",
    tamanho: "G",
    estadoConservacao: "Novo",
    preco: 150,
    imagemUrl: "http://imagem.com/teste.png",
    fornecedoraId: 1,
  };

  let produtoCriado = null;

  it("deve criar um produto no backend", async () => {
    const result = await criarProduto(produtoNovo);

    expect(result.sucesso).toBe(true);
    expect(result.produto.id).toBeDefined();
    expect(result.produto.descricao).toBe(produtoNovo.descricao);

    produtoCriado = result.produto; // salvar para os próximos testes
  });

  it("deve listar produtos do backend", async () => {
    const result = await listarProdutos();
    expect(result.sucesso).toBe(true);
    expect(result.produtos.length).toBeGreaterThan(0);
  });

  it("deve buscar produto por ID no backend", async () => {
    const result = await buscarProdutoPorId(produtoCriado.id);
    expect(result.sucesso).toBe(true);
    expect(result.produto.id).toBe(produtoCriado.id);
  });

  it("deve atualizar produto no backend", async () => {
    const atualizado = { ...produtoCriado, descricao: "Produto Atualizado" };
    const result = await atualizarProduto(produtoCriado.id, atualizado);

    expect(result.sucesso).toBe(true);
    expect(result.produto.descricao).toBe("Produto Atualizado");
  });

  it("deve excluir produto do backend", async () => {
    const result = await excluirProduto(produtoCriado.id);

    expect(result.sucesso).toBe(true);
  });
});
