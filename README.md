# frontend-mobile

Projeto mobile com Expo.

## Requisitos

- Node.js instalado (recomendado: versão LTS)
- npm instalado
- Celular com Expo Go (opcional, para testar no aparelho)

## Instalação

Na pasta do projeto, rode:

```bash
npm install
```

## Executar o projeto

Inicie o servidor do Expo:

```bash
npm start
```

Depois escolha uma das opções abaixo.

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

## Abrir no celular

- Instale o app **Expo Go** no celular.
- Com o projeto rodando (`npm start`), escaneie o QR Code.
- O celular e o computador devem estar na mesma rede Wi-Fi.

## Dicas rápidas (se der erro)

- Se algo falhar, pare o terminal e rode de novo `npm install`.
- Depois execute novamente `npm start`.
- Se a porta estiver ocupada, feche outros processos do Expo e tente de novo.

-----------------------------------------------------------------------

O código foi limpo e otimizado para deixar o aplicativo bem mais rápido e organizado. Juntei as validações repetidas de títulos e toda a parte de acesso à internet em funções únicas, o que facilita futuras manutenções. Também salvei as funções na memória do celular para evitar que a tela fique atualizando à toa e gastando processamento. Por fim, ativei o modelo otimista, que faz qualquer mudança na lista aparecer de forma instantânea para o usuário; se a internet falhar, o sistema desfaz a alteração visual sozinho no mesmo segundo, eliminando travamentos e telas de carregamento.