const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

// ========== Imports ==========
const Diario = require("./app/models/Diario");
const Notificador = require("./app/utils/Notificador");
const AulaController = require("./app/controllers/AulaController");
const PresencaController = require("./app/controllers/PresencaController");
const configurarRotas = require("./app/routes/routes");

// ========== Setup ==========
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

// ========== Middleware ==========
app.use(express.json());
app.use(express.static("public"));

// ========== Inicializar Componentes ==========
const diario = new Diario("diario.json");
const notificador = new Notificador(wss);
const aulaController = new AulaController(diario, notificador);
const presencaController = new PresencaController(diario, notificador);

// ========== WebSocket Connection ==========
wss.on("connection", ws => {
    console.log("Cliente conectado");

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });

    ws.on("error", err => {
        console.log("Erro no WebSocket:", err.message);
    });

    ws.send(JSON.stringify(diario.obterDados()));
});

// ========== Configurar Rotas ==========
const rotas = configurarRotas(app, aulaController, presencaController, notificador);
app.use(rotas);

// ========== Iniciar Servidor ==========
server.listen(PORT, () => {
    console.log(`\n Servidor rodando na porta ${PORT}`);
});