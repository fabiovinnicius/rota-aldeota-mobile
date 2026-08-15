# Rota Aldeota LEIT - Aplicativo Mobile de Roteirização e Leitura

Solução mobile desenvolvida para o Desafio Técnico de Desenvolvimento Mobile. O aplicativo atende às necessidades de equipes em campo durante atividades de roteirização, leitura de medidores de utilidades, registro fotográfico, geolocalização e sincronização resiliente de dados.

---

## 1. Instruções de Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Gerenciador de pacotes npm

### Instalação de Dependências

Para instalar as dependências do projeto, acesse a pasta raiz e execute:

```bash
npm install
```

### Execução em Ambiente Web (Recomendado para Avaliação)

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

- **Framework**: React Native com Expo e TypeScript, adotado devido à tipagem estática rigorosa e compatibilidade multiplataforma (Web, Android e iOS).
- **Persistência Local**: `@react-native-async-storage/async-storage` para armazenamento local chave-valor e retenção de dados offline.
- **Câmera**: `expo-camera` e `expo-image-picker` para captura de fotografias e associação aos atendimentos.
- **Geolocalização**: `expo-location` para captura de coordenadas (latitude e longitude) e timestamp da visita.
- **Gerenciamento de Estado**: React Context API para controle centralizado do estado das rotas e sincronização.
- **Testes Automatizados**: Jest para testes unitários das regras de validação.

---

## 3. Funcionamento Offline

Ao iniciar pela primeira vez, o aplicativo lê o arquivo JSON fornecido (`rota_aldeota_LEIT.json`) e armazena a estrutura da rota no banco de dados local (`AsyncStorage`).

- **Disponibilidade**: A rota, a lista de pontos e o percurso permanecem acessíveis mesmo sem conexão à internet.
- **Preservação de Dados**: Leituras, fotografias e coordenadas de geolocalização são gravadas localmente sob o estado pendente, garantindo que nenhum dado seja perdido ao fechar ou reiniciar o aplicativo.

---

## 4. Estratégia de Sincronização

A sincronização foi modelada como uma máquina de estados finitos composta por quatro estados:

`PENDENTE ➔ SINCRONIZANDO ➔ SINCRONIZADO (ou ERRO)`

- **Simulação de Sincronização**: Ao acionar o comando de sincronização, os registros pendentes são processados e marcados como sincronizados localmente.
- **Substituição por API Real**: A lógica de persistência e comunicação foi encapsulada na classe `StorageService`. Para integração com um backend real em produção, basta substituir o método simulado por chamadas HTTP REST ou GraphQL (utilizando `fetch` ou `axios`), preservando intactos os contratos e a camada de interface visual.

---

## 5. Decisões Técnicas

- **Stack Tecnológica (React Native + Expo + TypeScript)**: Opção por React Native com Expo devido ao suporte maduro a módulos nativos de hardware (câmera e GPS), aliada à tipagem estática do TypeScript que reduz falhas em tempo de execução e garante previsibilidade nos modelos de dados.
- **Gerenciamento de Estado Leve (Context API)**: Escolha do React Context API nativo em vez de gerenciadores de estado mais pesados (como Redux), evitando complexidade desnecessária de boilerplate para a escala do aplicativo.
- **Persistência Local Chave-Valor (AsyncStorage)**: Adotado para armazenamento persistente por ser assíncrono, leve e altamente confiável para gravação da rota e dos registros de leitura em formato JSON.
- **Arquitetura Offline-First**: Todo registro de visita é obrigatoriamente gravado primeiro no banco local do dispositivo e etiquetado como pendente. Essa abordagem garante resposta instantânea para a equipe em campo, independentemente da presença de sinal de internet.
- **Desacoplamento de Camadas**: Organização estrita em módulos (`domain`, `services`, `store`, `components`, `screens`, `utils`), garantindo que alterações na camada de persistência ou de interface não afetem a lógica de negócios da rota.

---

## 6. Limitações e Proposta de Evolução

### Limitações Identificadas

1. **Reconhecimento Automático de Leitura (OCR)**:
   - **Motivo**: O processamento de OCR local exigiria a inclusão de modelos pesados de visão computacional (como ML Kit ou Tesseract), o que aumentaria significativamente o tamanho final do instalador e a complexidade de compilação.
   - **Proposta de Evolução**: Integração futura de módulo leve de visão computacional na captura da câmera para preenchimento automático da leitura do medidor.

2. **Upload de Fotografias para Servidor Remoto**:
   - **Motivo**: Na ausência de um backend real ativo no desafio, as imagens capturadas são mantidas no sistema de arquivos local do dispositivo e vinculadas via URI interna no registro JSON.
   - **Proposta de Evolução**: Implementação de pipeline de upload em nuvem (como AWS S3 ou Firebase Storage) enviando os binários da foto antes de marcar a leitura como sincronizada.

3. **Sincronização Automática em Segundo Plano (Background Fetch)**:
   - **Motivo**: A simulação de envio é acionada manualmente ou via alternador de estado de rede na interface. Execuções em segundo plano demandam agendadores do sistema operacional (como WorkManager no Android) que extrapolam o escopo simulado.
   - **Proposta de Evolução**: Adicionar rotinas nativas de `BackgroundFetch` para reenvio automático silencioso de registros pendentes sempre que a conectividade for restabelecida.
