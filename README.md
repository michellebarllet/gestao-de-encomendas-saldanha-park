# Gestão de Encomendas

Este é um aplicativo simples de gestão de encomendas, desenvolvido em **React Native**, que permite o registro, controle de retirada e armazenamento de dados usando **AsyncStorage**.

## Funcionalidades  
- Registrar novas encomendas com o nome do morador e número do apartamento.  
- Confirmar a retirada da encomenda, salvando o nome e CPF da pessoa que retirou.  
- Visualizar encomendas pendentes e retiradas.  
- Dados são salvos localmente no dispositivo.

## Como Rodar Localmente

### Pré-requisitos:  
- **Node.js** e **npm** instalados.  
- **Expo CLI** instalado globalmente:
  ```bash
  npm install -g expo-cli  

## Instalação:
- 1. Clone o repositório:
```bash
git clone https://github.com/michellebarllet/gestao-de-encomendas-saldanha-park.git  
cd gestao-encomendas-saldanha-park  

- 2. Instale nas depêndencias
```bash
npm install  

- 3. Inicie o aplicativo:
```bash
npx expo start  

- 4. Escaneie o QR code usando o app Expo Go no seu dispositivo móvel para rodar o aplicativo.

## Tecnologias Utilizadas
- React Native
- AsyncStorage para armazenamento local