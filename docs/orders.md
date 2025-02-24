# Refinamento

Este documento descreve o domínio e as entidades de banco de dados da aplicação Orders.

## Domínio da Aplicação

Abaixo estão descritas as entidades de domínio definidas para o projeto.

### Entidades de Domínio

#### Product

Entidade que representa um produto

| Campo       | Descrição         | Obrigatório | Tipo          |
|-------------|-------------------|-------------|---------------|
| name        | Nome              | true        | `string`      |
| category    | Categoria         | true        | `string`      |
| description | Descrição         | true        | `string`      |
| amount      | Valor unitário    | true        | `number`      |
| image       | Imagem            | false       | `string` |
| notes       | Notas             | false       | `string`      |

#### Order

Entidade que representa um pedido.

| Campo    | Descrição            | Obrigatório | Tipo        |
|----------|----------------------|-------------|-------------|
| amount   | Valor                | true        | `number`    |
| number   | Número do pedido     | true        | `number`    |
| products | Produtos             | true        | `Product[]` |
| customer | Cliente identificado | false       | `Customer`  |
| status   | Status               | true        | `Status`    |

_Status Enum: RECEIVED | PREPARING | DONE | FINISHED_

## Entidades de Banco de Dados

Abaixo estão descritas as entidades de banco de dados definidas para o projeto.

### products

Entidade de banco de dados que representa um produto.

| Campo        | Descrição            | Obrigatório | Tipo        |
|--------------|----------------------|-------------|-------------|
| id (PK)      | Identificador único  | true        | `Varchar`   |
| name         | Nome                 | true        | `Varchar`   |
| category     | Categoria            | true        | `Varchar`   |
| description  | Descrição            | true        | `Varchar`   |
| amount       | Valor unitário       | true        | `Numeric`   |
| image        | Imagem do produto    | true        | `Varchar`     |
| created_at   | Data de criação      | true        | `Timestamp` |
| updated_at   | Data de atualização  | true        | `Timestamp` |

### orders

Entidade de banco de dados que representa um pedido.

| Campo         | Descrição               | Obrigatório | Tipo        |
|---------------|-------------------------|-------------|-------------|
| id (PK)       | Identificador único     | true        | `Varchar`   |
| amount        | Valor total             | true        | `Numeric`   |
| number        | Número do pedidos       | true        | `Numeric`   |
| customer_id   | Identificador do cliente| false       | `Varchar`   |
| status        | Status                  | true        | `Varchar`   |
| created_at    | Data de criação         | true        | `Timestamp` |
| updated_at    | Data de atualização     | true        | `Timestamp` |

### orders_products

Entidade de banco de dados associativa que representa os produtos de um pedido.

| Campo           | Descrição               | Obrigatório | Tipo      |
|-----------------|-------------------------|-------------|-----------|
| order_id (PFK)  | Identificador do pedido | true        | `Varchar` |
| product_id (PFK)| Identificador do produto| true        | `Varchar` |
| quantity        | Quantidade de produtos  | true        | `Numeric` |
| notes           | Notas sobre o produto   | false       | `Varchar` |
