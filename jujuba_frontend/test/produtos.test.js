// test/produtos.int.test.js
import { listarProdutos, buscarProdutoPorId, excluirProduto } from "src/pages/api/produtos.js";
import httpMocks from "node-mocks-http";

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
    const req = httpMocks.createRequest({ method: "POST", body: produtoNovo });
    const res = httpMocks.createResponse();

    await (await import("src/pages/api/produtos.js")).default(req, res);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.id).toBeDefined();
    expect(data.descricao).toBe(produtoNovo.descricao);
    produtoCriado = data; // salvar para os proximos testes
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
    const req = httpMocks.createRequest({ method: "PUT", body: atualizado });
    const res = httpMocks.createResponse();

    await (await import("src/pages/api/produtos.js")).default(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.descricao).toBe("Produto Atualizado");
  });

  it("deve excluir produto do backend", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      query: { id: produtoCriado.id },
    });
    const res = httpMocks.createResponse();

    await (await import("src/pages/api/produtos.js")).default(req, res);

    expect(res.statusCode).toBe(204);
  });
});
