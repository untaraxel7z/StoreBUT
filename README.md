# 👟 SNKRS

Sistema web REST desenvolvido para gerenciamento e vendas de tênis (sneakers), permitindo aos clientes navegar e comprar produtos, enquanto administradores gerenciam catálogo, preços, imagens e disponibilidade.

Projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas (ADS).

---

## 👥 Integrantes

| Nome | RA | Cargo |
|------|----|----|
| Kaue Mata | 2402317 | Desenvolvedor Fullstack |

---

## 🚀 Tecnologias Utilizadas

### 🔧 Back-end
- Node.js 18+
- Express 5.x
- Sequelize (ORM)

### 🗄️ Banco de Dados
- MySQL 8.0+

### 🎨 Front-end
- HTML5
- CSS3
- JavaScript

### 🛠️ Ferramentas de Desenvolvimento
- VS Code (IDE)
- Postman (Testes de API)
- Nodemon (Auto-reload)
- Sequelize CLI (Migrations)

---

## ⚡ Como Começar

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/snkrs.git
cd snkrs
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar Banco de Dados
```bash
# Criar banco de dados
mysql -u root -p
CREATE DATABASE snkrs_db;
```

### 4️⃣ Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas credenciais
nano .env
```

### 5️⃣ Rodar a Aplicação
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

A aplicação estará disponível em: `http://localhost:5000`

---

## 📚 Documentação

Para documentação técnica completa, consulte:
- **[ESPECIFICACAO_COMPLETA.md](./ESPECIFICACAO_COMPLETA.md)** - Especificação detalhada do projeto
- **[ESPECIFICACAO.md](./ESPECIFICACAO.md)** - Especificação simplificada

---

## 🔗 Links Úteis

- 📋 **Postman Collection**: Importe a coleção para testar a API
- 🗄️ **Modelo de Banco**: Veja a estrutura das tabelas
- 📖 **Guia de API**: Endpoints e exemplos de requisição

---

## ✨ Features Principais

✅ Registro e autenticação de usuários  
✅ Listagem de produtos com filtros  
✅ Busca avançada por nome, preço e estilo  
✅ Upload de múltiplas imagens por produto  
✅ Painel administrativo para gerenciar catálogo  
✅ Sistema de permissões (cliente vs admin)  

---

## 📝 Licença

Este projeto está licenciado sob a Licença ISC.

---

<div align="center">

**Feito com ❤️ por Kaue Mata**

</div>
