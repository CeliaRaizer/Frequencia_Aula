## Atividade Prática — Atualização de Dados em Tempo Real

### Objetivo

Implementar três formas de atualização de dados entre cliente e servidor:

- Polling
- Long Polling
- WebSocket

> Comparar o comportamento de cada abordagem.

### Contexto

Você deverá desenvolver um Sistema de Controle de Presença com:

 - Um servidor Node.js usando Express
 - Um arquivo diario.json para armazenar dados (em anexo)
 - Registro de presença por aula (a aula pode ser a data atual)

A aplicação deve permitir:

- Criar uma nova aula (data atual)
- Marcar presença/ausência para cada aluno
- Visualizar as presenças atualizadas em tempo real de três maneiras diferentes (Polling, Long Polling e WebSocket)

> Use o projeto fornecido como base para implementar as funcionalidades. O foco é entender as diferenças entre as abordagens de atualização de dados em tempo real e como elas afetam a experiência do usuário.
