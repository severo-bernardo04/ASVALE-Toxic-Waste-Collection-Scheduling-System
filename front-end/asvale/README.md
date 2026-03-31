# ASVALE - Frontend

Frontend da Associação dos Revendedores de Defensivos Agrícolas do Vale do Jaguari (ASVALE).

## Tecnologias Utilizadas

- React
- TypeScript
- Styled Components
- React Router DOM
- Axios
- React Icons

## Requisitos

- Node.js 14.x ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/asvale.git
cd asvale/front-end/asvale
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
REACT_APP_API_URL=http://localhost:3333/api
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
src/
  ├── components/       # Componentes reutilizáveis
  ├── contexts/        # Contextos do React (AuthContext)
  ├── pages/           # Páginas da aplicação
  ├── services/        # Serviços e configuração da API
  ├── styles/          # Estilos globais e tema
  └── App.tsx          # Componente principal
```

## Funcionalidades

- Autenticação de usuários (login/registro)
- Painel do usuário
  - Visualização de informações pessoais
  - Gerenciamento de agendamentos
- Painel administrativo
  - Gerenciamento de usuários
  - Gerenciamento de agendamentos
- Responsividade para diferentes dispositivos

## Personalização

### Imagens
- Para alterar a imagem de fundo da página inicial, substitua o arquivo `/public/images/hero-bg.jpg` por sua própria imagem.
- Recomenda-se usar uma imagem de alta resolução (mínimo 1920x1080) relacionada à agricultura, sustentabilidade ou meio ambiente.
- A imagem deve ter bom contraste para garantir a legibilidade do texto sobreposto.

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm build`: Cria a versão de produção
- `npm test`: Executa os testes
- `npm eject`: Ejeta as configurações do Create React App

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
