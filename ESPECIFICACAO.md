# 👟 SNKRS - Sistema de Gerenciamento de Vendas de Tênis

Sistema web REST desenvolvido para gerenciamento de catálogo e vendas de tênis (sneakers), permitindo aos usuários navegar, buscar produtos e aos administradores gerenciar o inventário de forma centralizada e estruturada.

Projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

---

# 📌 1. Objetivo do Sistema

O sistema tem como objetivo permitir que clientes naveguem e comprem tênis de forma intuitiva, enquanto administradores gerenciam o catálogo de produtos, preços, imagens e disponibilidade de forma eficiente.

---

# 🧠 2. Regras de Negócio

## 👤 Usuário (Cliente)

- **RN01** – O e-mail do usuário é obrigatório e único no sistema.
- **RN02** – A senha é obrigatória e deve possuir no mínimo 8 caracteres.
- **RN03** – O usuário deve ser autenticado via email e senha.
- **RN04** – A senha deve ser armazenada criptografada (bcrypt).
- **RN05** – O campo `role` define o perfil do usuário: `admin` ou `user`.
- **RN06** – Apenas usuários com role `admin` podem criar, editar e deletar produtos.
- **RN07** – Usuários comuns (`user`) podem apenas visualizar produtos.
- **RN08** – A data de criação (`created_at`) e atualização (`updated_at`) são registradas automaticamente.

---

## 👨‍💼 Administrador

- **RN09** – O administrador pode criar novos produtos.
- **RN10** – O administrador pode editar informações de produtos.
- **RN11** – O administrador pode deletar produtos do catálogo.
- **RN12** – O administrador pode fazer upload de imagens para produtos.
- **RN13** – O campo `uploaded_by` registra qual admin criou/atualizou o produto.

---

## 👟 Produto

- **RN14** – O nome do produto é obrigatório.
- **RN15** – O estilo do produto é obrigatório (ex: "Sneaker", "Running", "Basketball").
- **RN16** – O preço é obrigatório e deve ser maior que zero.
- **RN17** – O SKU (Stock Keeping Unit) é obrigatório e único no sistema.
- **RN18** – O status do produto deve ser um dos valores: `disponivel`, `indisponivel` ou `descontinuado`.
- **RN19** – O status padrão é `disponivel`.
- **RN20** – A descrição do produto é opcional.
- **RN21** – O produto pode ter múltiplas imagens armazenadas em formato JSON.
- **RN22** – Apenas arquivos de imagem (JPG, PNG, WebP) ou PDF são aceitos para upload.
- **RN23** – O caminho da imagem deve ser armazenado no banco de dados.
- **RN24** – A data de criação e atualização do produto são registradas automaticamente.

---

# 📋 3. Casos de Uso

---

## 🎯 UC01 – Registrar Novo Usuário

**Ator:** Cliente/Administrador  
**Descrição:** Permite registrar um novo usuário no sistema.

### Fluxo Principal

1. O usuário informa e-mail e senha.
2. O sistema valida o formato do e-mail.
3. O sistema verifica se o e-mail já está cadastrado.
4. O sistema valida a força da senha (mínimo 8 caracteres).
5. O sistema criptografa a senha com bcrypt.
6. O sistema salva o usuário com role padrão `user`.
7. O sistema retorna confirmação de cadastro com token JWT.

### Fluxo Alternativo

- E-mail já cadastrado → sistema exibe erro "E-mail já registrado".
- Senha fraca → sistema exibe erro "Senha deve ter no mínimo 8 caracteres".
- E-mail inválido → sistema exibe erro "E-mail inválido".

---

## 🎯 UC02 – Autenticar Usuário

**Ator:** Cliente/Administrador

### Fluxo Principal

1. O usuário informa e-mail e senha.
2. O sistema busca o usuário no banco.
3. O sistema verifica a senha com bcrypt.
4. O sistema gera token JWT válido por 24 horas.
5. O sistema retorna token e dados do usuário.

### Fluxo Alternativo

- Usuário não existe → erro "E-mail ou senha incorretos".
- Senha incorreta → erro "E-mail ou senha incorretos".

---

## 🎯 UC03 – Criar Produto (Admin)

**Ator:** Administrador

### Fluxo Principal

1. O admin informa nome, estilo, preço, SKU e descrição.
2. O sistema valida os campos obrigatórios.
3. O sistema verifica se o SKU já existe.
4. O sistema valida que o preço é maior que zero.
5. O sistema salva o produto com status `disponivel`.
6. O sistema registra o ID do admin em `uploaded_by`.
7. O sistema retorna confirmação de criação.

### Fluxo Alternativo

- SKU já cadastrado → erro "SKU já existe".
- Preço inválido → erro "Preço deve ser maior que zero".
- Campos obrigatórios faltando → erro com lista de campos.

---

## 🎯 UC04 – Upload de Imagem de Produto (Admin)

**Ator:** Administrador

### Fluxo Principal

1. O admin seleciona um produto.
2. O admin escolhe um arquivo de imagem (JPG, PNG, WebP).
3. O sistema valida o tipo de arquivo.
4. O sistema salva o arquivo no servidor (pasta `/public/images`).
5. O sistema armazena o caminho da imagem em formato JSON no produto.
6. O sistema retorna confirmação de upload.

### Fluxo Alternativo

- Arquivo inválido → erro "Apenas imagens (JPG, PNG, WebP) são permitidas".
- Arquivo muito grande → erro "Tamanho máximo de 5MB excedido".

---

## 🎯 UC05 – Listar Produtos

**Ator:** Cliente/Administrador

### Fluxo Principal

1. O sistema retorna lista de produtos cadastrados.
2. O cliente pode filtrar por estilo, preço ou status.
3. O cliente pode ordenar por nome ou preço.
4. O sistema retorna paginação (20 itens por página).

---

## 🎯 UC06 – Buscar Produto por ID

**Ator:** Cliente/Administrador

### Fluxo Principal

1. O usuário informa o ID do produto.
2. O sistema busca o produto no banco.
3. O sistema retorna detalhes completos do produto (incluindo imagens).

### Fluxo Alternativo

- Produto não encontrado → erro 404 "Produto não encontrado".

---

## 🎯 UC07 – Atualizar Produto (Admin)

**Ator:** Administrador

### Fluxo Principal

1. O admin seleciona um produto existente.
2. O admin altera nome, estilo, preço, descrição ou status.
3. O sistema valida os dados alterados.
4. O sistema salva as alterações.
5. O sistema atualiza automaticamente a data de modificação.

### Fluxo Alternativo

- SKU duplicado → erro "SKU já existe".
- Produto não encontrado → erro 404.

---

## 🎯 UC08 – Deletar Produto (Admin)

**Ator:** Administrador

### Fluxo Principal

1. O admin seleciona um produto.
2. O sistema solicita confirmação.
3. O sistema remove o registro do banco.
4. O sistema remove as imagens do servidor (se houver).
5. O sistema retorna confirmação de exclusão.

### Fluxo Alternativo

- Produto não encontrado → erro 404.

---

# 📌 4. Requisitos Funcionais

- **RF01** – O sistema deve permitir registrar novo usuário.
- **RF02** – O sistema deve permitir autenticar usuário com email e senha.
- **RF03** – O sistema deve permitir listar todos os produtos.
- **RF04** – O sistema deve permitir buscar produto por ID.
- **RF05** – O sistema deve permitir criar novo produto (apenas admin).
- **RF06** – O sistema deve permitir editar produto (apenas admin).
- **RF07** – O sistema deve permitir deletar produto (apenas admin).
- **RF08** – O sistema deve permitir upload de imagens para produto (apenas admin).
- **RF09** – O sistema deve gerar e validar tokens JWT.
- **RF10** – O sistema deve implementar filtros e paginação na listagem de produtos.

---

# ⚙ 5. Requisitos Não Funcionais

- **RNF01** – A aplicação deve seguir arquitetura REST com verbos HTTP corretos.
- **RNF02** – A comunicação deve ocorrer via HTTP/HTTPS.
- **RNF03** – Os dados devem ser armazenados em MySQL com Sequelize ORM.
- **RNF04** – O sistema deve validar dados antes de persistir no banco.
- **RNF05** – O sistema deve garantir integridade referencial no banco de dados.
- **RNF06** – O sistema deve aceitar apenas arquivos de imagem (JPG, PNG, WebP) com máximo 5MB.
- **RNF07** – O sistema deve registrar automaticamente datas de criação e atualização.
- **RNF08** – Senhas devem ser criptografadas com bcrypt (salt mínimo 10).
- **RNF09** – Tokens JWT devem ter expiração de 24 horas.
- **RNF10** – Imagens devem ser armazenadas em pasta `/public/images` no servidor.
- **RNF11** – O sistema deve retornar respostas JSON com status HTTP apropriados.
- **RNF12** – Apenas usuários autenticados podem acessar endpoints protegidos.

---

# 🏗 6. Arquitetura

**Backend:** Node.js + Express  
**Banco de Dados:** MySQL com Sequelize ORM  
**Autenticação:** JWT (JSON Web Tokens)  
**Armazenamento de Arquivos:** Sistema de arquivos local

### Arquitetura em Camadas:

```
src/
├── controllers/     # Lógica de negócio e resposta HTTP
├── models/          # Definição das entidades (User, Product)
├── routes/          # Definição das rotas (auth, products)
├── config/          # Configuração de banco de dados
└── middleware/      # Autenticação e validação
```

---

## 📊 Diagrama de Entidades

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ role        │
│ created_at  │
│ updated_at  │
└─────────────┘

┌──────────────────┐
│    Product       │
├──────────────────┤
│ id (PK)          │
│ name             │
│ style            │
│ price            │
│ description      │
│ sku (UNIQUE)     │
│ status           │
│ images           │
│ uploaded_by (FK) │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

---

## 🔌 Endpoints Principais

### Autenticação
```
POST   /auth/register          Registrar novo usuário
POST   /auth/login             Autenticar usuário
```

### Produtos
```
GET    /products               Listar todos os produtos
GET    /products/:id           Buscar produto por ID
POST   /products               Criar novo produto (admin)
POST   /products/upload        Upload de imagem (admin)
PUT    /products/:id           Atualizar produto (admin)
DELETE /products/:id           Deletar produto (admin)
```

---

# 🧪 7. Plano de Testes

## 🧪 Testes Unitários

### Testes do Usuário
- [ ] Validar registro com email válido
- [ ] Rejeitar email duplicado
- [ ] Rejeitar senha fraca (< 8 caracteres)
- [ ] Criptografar senha corretamente
- [ ] Validar autenticação com credenciais corretas
- [ ] Rejeitar autenticação com credenciais incorretas

### Testes do Produto
- [ ] Validar criação de produto com dados válidos
- [ ] Rejeitar produto sem nome
- [ ] Rejeitar produto com preço inválido
- [ ] Rejeitar SKU duplicado
- [ ] Validar que apenas admin pode criar produto
- [ ] Validar que apenas admin pode editar produto
- [ ] Validar que apenas admin pode deletar produto

### Testes de Upload
- [ ] Aceitar arquivo JPG válido
- [ ] Aceitar arquivo PNG válido
- [ ] Rejeitar arquivo de texto
- [ ] Rejeitar arquivo maior que 5MB
- [ ] Salvar caminho correto da imagem no banco

---

## 🧪 Testes de Integração

### Autenticação
- [ ] Fluxo completo de registro → login → acesso a recurso protegido
- [ ] Token inválido retorna erro 401
- [ ] Token expirado retorna erro 401
- [ ] Refresh token funciona corretamente

### Produtos
- [ ] Admin consegue criar, editar e deletar produtos
- [ ] Cliente consegue apenas visualizar produtos
- [ ] Cliente recebe erro 403 ao tentar criar produto
- [ ] Listagem retorna produtos com paginação
- [ ] Filtros funcionam corretamente

### Upload de Arquivo
- [ ] Admin consegue fazer upload de imagem
- [ ] Arquivo é salvo corretamente no servidor
- [ ] Caminho é armazenado no banco de dados
- [ ] Cliente consegue visualizar a imagem

---

## 🧪 Testes de API (E2E)

### GET /products
- [ ] Retorna status 200
- [ ] Retorna array de produtos
- [ ] Produtos contêm campos obrigatórios
- [ ] Paginação funciona corretamente

### GET /products/:id
- [ ] Retorna status 200 com produto válido
- [ ] Retorna status 404 para ID inexistente
- [ ] Inclui todas as imagens do produto

### POST /auth/register
- [ ] Cria usuário com status 201
- [ ] Retorna token JWT
- [ ] Rejeita email duplicado com status 400
- [ ] Rejeita senha fraca com status 400

### POST /auth/login
- [ ] Retorna token para credenciais válidas
- [ ] Retorna erro 401 para credenciais inválidas
- [ ] Token funciona em requisições posteriores

### POST /products (Admin)
- [ ] Cria produto com status 201
- [ ] Valida campos obrigatórios
- [ ] Rejeita SKU duplicado com status 400
- [ ] Usuário comum recebe erro 403

### PUT /products/:id (Admin)
- [ ] Atualiza produto com status 200
- [ ] Falha com erro 404 para produto inexistente
- [ ] Usuário comum recebe erro 403

### DELETE /products/:id (Admin)
- [ ] Deleta produto com status 200
- [ ] Remove arquivo do servidor
- [ ] Falha com erro 404 para produto inexistente

### POST /products/upload (Admin)
- [ ] Faz upload de imagem com status 200
- [ ] Rejeita arquivo inválido com status 400
- [ ] Salva no servidor em `/public/images`
- [ ] Armazena caminho no banco de dados

---

## 🧪 Testes de Validação

- [ ] Email com formato inválido é rejeitado
- [ ] Preço negativo é rejeitado
- [ ] SKU vazio é rejeitado
- [ ] Status inválido é rejeitado
- [ ] Campo nome com mais de 255 caracteres é rejeitado
- [ ] Descrição muito longa é truncada ou rejeitada

---

## 🧪 Testes de Segurança

- [ ] Senha não é retornada em nenhuma resposta
- [ ] Apenas admin pode editar/deletar produtos
- [ ] Token expirado não permite acesso
- [ ] Requisição sem token retorna erro 401
- [ ] Arquivo mal-intencionado é rejeitado
- [ ] SQL Injection não é possível (Sequelize)
- [ ] XSS não é possível em respostas JSON

---

## 🧪 Testes de Performance

- [ ] Listar 1000 produtos não excede 2 segundos
- [ ] Buscar produto por ID é instantâneo
- [ ] Upload de imagem 5MB não excede 5 segundos
- [ ] Autenticação completa não excede 500ms

---

## 🧪 Testes de Banco de Dados

- [ ] Integridade referencial é mantida
- [ ] Timestamps são atualizados corretamente
- [ ] Campos unique funcionam como esperado
- [ ] Campos NOT NULL são validados
- [ ] Conexão com banco é estabelecida corretamente

---

# 🎓 8. Considerações Acadêmicas

O sistema foi modelado seguindo princípios de:

- ✅ Arquitetura REST com separação de responsabilidades
- ✅ Autenticação segura com JWT e bcrypt
- ✅ ORM (Sequelize) para segurança contra SQL Injection
- ✅ Validação de entrada em todas as camadas
- ✅ Tratamento robusto de erros
- ✅ Padrão MVC (Model-View-Controller)
- ✅ Boas práticas de segurança
- ✅ Testes abrangentes em múltiplos níveis
- ✅ Documentação clara de casos de uso

---

# 📝 Histórico de Versões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 2026-05-29 | Tim | Versão inicial da especificação |

---
