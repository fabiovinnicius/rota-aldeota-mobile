# Rota Aldeota LEIT - Aplicativo Mobile de Roteirização e Leitura

Solução mobile desenvolvida para o Desafio Técnico de Desenvolvimento Mobile. O aplicativo atende às necessidades de equipes em campo durante atividades de roteirização, leitura de medidores de utilidades, registro fotográfico, geolocalização e sincronização resiliente de dados.

## 1. Instruções de Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Gerenciador de pacotes npm

### Instalação de Dependências

Para instalar as dependências do projeto, acesse a pasta raiz e execute:

```bash
npm install
```

### Execução em Ambiente Web

Para executar a aplicação em modo web no navegador:

```bash
npx expo start --web
```

### Execução em Dispositivo Móvel (Expo Go)

Para executar no aplicativo Expo Go em um dispositivo Android ou iOS:

```bash
npx expo start
```

Após a inicialização, escaneie o código QR gerado no terminal utilizando o aplicativo Expo Go ou a câmera do dispositivo.

---

## 2. Tecnologias Utilizadas

A escolha da stack foi fundamentada em critérios de performance, manutenibilidade e flexibilidade para operação offline:

- **React Native com Expo (TypeScript)**: Adotado devido à tipagem estática rigorosa, produtividade no desenvolvimento e suporte nativo a hardware de dispositivos móveis.
- **@react-native-async-storage/async-storage**: Utilizado para persistência de dados local chave-valor, garantindo a disponibilidade das informações sem dependência de conectividade.
- **expo-camera & expo-image-picker**: Módulos para acesso à câmera e gerenciamento das fotografias capturadas dos medidores.
- **expo-location**: Biblioteca para obtenção de coordenadas geográficas (latitude e longitude) e carimbo de data/hora (timestamp).
- **React Context API**: Gerenciamento de estado global da aplicação de forma desacoplada e centralizada.
- **Jest**: Framework para execução de testes automatizados unitários.

---

## 3. Funcionamento Offline e Persistência de Dados

Ao iniciar pela primeira vez, o aplicativo realiza a leitura do arquivo JSON fornecido (`rota_aldeota_LEIT.json`) e armazena os dados da rota no armazenamento local do dispositivo (`AsyncStorage`).

- **Disponibilidade Contínua**: O usuário pode visualizar a rota, consultar detalhes dos pontos e registrar novas leituras mesmo em áreas sem cobertura de rede.
- **Integridade dos Dados**: As leituras registradas, fotografias e coordenadas de geolocalização são persistidas imediatamente no banco local sob o estado pendente, garantindo a preservação das informações mesmo após o fechamento ou reinicialização do aplicativo.

---

## 4. Estratégia de Sincronização Simulada

A sincronização de dados foi projetada com base em uma máquina de estados finitos composta por quatro estados:

`PENDENTE ➔ SINCRONIZANDO ➔ SINCRONIZADO (ou ERRO)`

- **Fluxo de Envio**: Ao acionar a ação de sincronização, os registros pendentes são processados e atualizados no banco local.
- **Resiliência e Controle de Rede**: A aplicação conta com um alternador de estado de rede (Online/Offline) na interface para simulação da variação de conectividade.
- **Integração com Backend Real**: A arquitetura isola a lógica de persistência na classe `StorageService`. Para conectar a um ambiente de produção real, basta substituir o método de simulação por chamadas HTTP REST ou GraphQL (utilizando `fetch` ou `axios`), mantendo a interface de contrato da camada de serviços intacta.

---

## 5. Decisões Técnicas e Arquitetura

O projeto foi estruturado seguindo os princípios de separação de responsabilidades e modularidade:

```
src/
├── domain/       # Modelos de dados e interfaces TypeScript
├── services/     # Serviços de armazenamento local, rede e geolocalização
├── store/        # Gerenciamento de estado global (Context API)
├── components/   # Componentes visuais reutilizáveis de interface
├── screens/      # Telas principais da aplicação
└── utils/        # Funções utilitárias e regras de validação
```
