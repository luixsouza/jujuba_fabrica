API de Produtos
Este projeto implementa APIs REST para gerenciamento de produtos, permitindo operações de CRUD (Create, Read, Update, Delete). O backend foi desenvolvido em Java utilizando Spring Boot e pode ser consumido por um frontend desenvolvido em Next.js.

Estrutura de Endpoints
Base URL:
http://localhost:8080/api/produtos

1. Listar Produtos
Endpoint: GET /api/produtos

Retorna uma lista de todos os produtos cadastrados.

Exemplo de Resposta json:


{
    "id": 1,
    "nome": "Produto A",
    "descricao": "Descrição do Produto A",
    "codigo": "1234",
    "preco": 50.00
},
{
    "id": 2,
    "nome": "Produto B",
    "descricao": "Descrição do Produto B",
    "codigo": "5678",
    "preco": 75.99
}

2. Cadastrar Produto
Endpoint: POST /api/produtos

Payload (JSON):

{
  "nome": "Produto C",
  "descricao": "Descrição do Produto C",
  "codigo": "91011",
  "preco": 100.00
}
Exemplo de Resposta json:
{
  "mensagem": "Produto cadastrado com sucesso!"
}

3. Atualizar Produto
Endpoint: PUT /api/produtos/{id}

Parâmetro na URL:
id - ID do produto a ser atualizado.

Payload (JSON):

{
  "nome": "Produto C Atualizado",
  "descricao": "Nova descrição do Produto C",
  "codigo": "91011",
  "preco": 120.00
}Exemplo de Resposta:

{
  "id": 3,
  "nome": "Produto C Atualizado",
  "descricao": "Nova descrição do Produto C",
  "codigo": "91011",
  "preco": 120.00
}

4. Excluir Produto
Endpoint: DELETE /api/produtos/{id}

Parâmetro na URL:
id - ID do produto a ser excluído.

Exemplo de Resposta:

{
  "mensagem": "Produto excluído com sucesso!"
}

5. Buscar Produto por ID
Endpoint: GET /api/produtos/{id}

Parâmetro na URL:
id - ID do produto a ser buscado.

Exemplo de Resposta:

{
  "id": 3,
  "nome": "Produto C",
  "descricao": "Descrição do Produto C",
  "codigo": "91011",
  "preco": 100.00
}