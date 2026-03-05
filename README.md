# Sistema de Qualidade PDV - Versão Standalone

Este é um sistema de avaliação de qualidade para Pontos de Venda (PDVs) da Rottas Construtora, desenvolvido como uma aplicação web React standalone, independente da plataforma Base44.

## 🚀 Funcionalidades

- **Dashboard**: Visão geral dos relatórios de qualidade
- **Gestão de PDVs**: Lista e gerenciamento de pontos de venda
- **Relatórios de Qualidade**: Criação e visualização de relatórios de avaliação
- **Sistema de Autenticação**: Autenticação simplificada (mock)
- **Exportação PDF**: Geração de relatórios em PDF

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework frontend
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **Radix UI** - Componentes de UI acessíveis
- **React Query** - Gerenciamento de estado e cache
- **React Router** - Roteamento
- **Date-fns** - Manipulação de datas
- **Lucide React** - Ícones

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd qualidade-pdv
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no navegador

## 🏗️ Estrutura do Projeto

```
src/
├── api/              # APIs (agora mock)
├── components/       # Componentes React
│   ├── ui/          # Componentes de UI reutilizáveis
│   └── relatorio/   # Componentes específicos de relatórios
├── lib/             # Utilitários e configurações
├── pages/           # Páginas da aplicação
└── utils/           # Funções utilitárias
```

## 🔧 Configuração

### Dados Mock

Os dados são fornecidos através de mocks localizados em `src/lib/mock-data.js`. Você pode modificar este arquivo para adicionar mais dados de teste.

### Variáveis de Ambiente

Não são necessárias variáveis de ambiente para a versão standalone. Todas as configurações são hardcoded.

## 📊 Dados de Exemplo

A aplicação vem com dados de exemplo incluindo:

- 3 PDVs de exemplo
- 3 relatórios de qualidade
- Itens de avaliação por setor (PDV, MKT, etc.)

## 🔒 Autenticação

Na versão standalone, a autenticação é mockada - todos os usuários são considerados autenticados como administradores.

## 📄 Geração de PDF

Os relatórios podem ser exportados em PDF usando a funcionalidade integrada.

## 🐛 Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificação de linting

### Estrutura de Dados

#### Relatório de Qualidade
```javascript
{
  // após migração a coluna `id` é numérica (primary key autoincrement)
  id: number | string,
  // `pdv_id` referencia PDV.id (número), embora alguns relatórios antigos ainda usem UUIDs
  pdv_id: number | string,
  pdv_nome: string,
  data_avaliacao: string,
  resultado: 'aprovado' | 'reprovado' | 'pendente',
  nota_geral: number,
  avaliador: string,
  itens: [{
    item: string,
    setor: string,
    status: 'conforme' | 'nao_conforme',
    observacao: string
  }]
}
```

#### PDV
```javascript
{
  // primary key autoincrement numérico (novos registros)
  id: number | string,
  nome: string,
  endereco: string,
  status: 'ativo' | 'inativo'
}
```

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é propriedade da Rottas Construtora e Incorporadora.