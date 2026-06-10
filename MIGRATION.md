# Migração de JSON para Banco de Dados MySQL

## Resumo das Mudanças

A aplicação foi atualizada para armazenar dados de produtos em um banco MySQL/MariaDB em vez de um arquivo JSON.

## O que foi feito:

1. **Criado arquivo `.env`** com configurações do banco de dados
2. **Criado modelo Sequelize** (`src/models/ProductSequelize.js`) para definir a tabela `products`
3. **Criado script de migração** (`migrate.js`) que:
   - Sincroniza o banco (cria a tabela se não existir)
   - Lê dados do `products.json`
   - Insere todos os produtos no banco
4. **Atualizado `product.js`** para usar o banco em vez de arquivo JSON
5. **Atualizado controller** para trabalhar com promises/async-await

## Pré-requisitos

- MySQL/MariaDB rodando em `127.0.0.1:3306`
- Banco de dados `snkrs` criado

## Como executar a migração:

### Opção 1: Usando o script batch (Windows)
```bash
double-click run-migration.bat
```

### Opção 2: Manual
```bash
# 1. Instalar dependências
npm install mysql2

# 2. Executar migração
npm run migrate
```

## Variáveis de Ambiente (.env)

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=snkrs
DB_DIALECT=mysql
PORT=3000
```

Ajuste conforme necessário para sua configuração de banco.

## Verificar se funcionou

Após a migração:
```bash
npm run dev
# Acesse http://localhost:3000/products
```

Você verá os 9 produtos do JSON agora vindo do banco de dados!

## Estrutura da Tabela

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  style VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  sku VARCHAR(50) NOT NULL UNIQUE,
  status ENUM('disponivel', 'indisponivel', 'descontinuado') DEFAULT 'disponivel',
  images JSON DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Notas

- O arquivo `products.json` continua existindo mas não é mais usado
- Novos produtos criados via API serão salvos no banco
- IDs agora são gerados automaticamente pelo banco (auto_increment)
