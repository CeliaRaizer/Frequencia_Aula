const express = require("express");
const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static("public"));

let diario = JSON.parse(fs.readFileSync("diario.json"));

let longPollingClients = [];

function salvar() {
    fs.writeFileSync("diario.json", JSON.stringify(diario, null, 2));
}

wss.on("connection", ws => {
    console.log("Cliente conectado");

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });

    ws.on("error", err => {
        console.log("Erro no WebSocket:", err.message);
    });

    ws.send(JSON.stringify(diario));
});

function notificar() {
    console.log("Notificando clientes...");

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(diario));
        }
    });

    longPollingClients.forEach(res => {
        try {
            res.json(diario);
        } catch (e) { }
    });

    longPollingClients = [];
}

// 🔹 Criar nova aula (data atual)
app.post("/nova-aula", (req, res) => {
    const data = new Date().toISOString().split("T")[0];
    if (!diario.aulas) diario.aulas = [];

    const aulaExistente = diario.aulas.find(a => a.data === data)
    if (aulaExistente) {
        return res.json({ mensagem: "Aula já criada hoje" });
    }

    const novaAula = {
        data,
        presencas: {}
    };

    diario.aulas.push(novaAula);
    salvar();
    notificar();

    res.json({ mensagem: "Nova aula criada", data });
});

// 🔹 Marcar presença
app.post("/marcar", (req, res) => {
    const { matricula, status } = req.body;
    const data = new Date().toISOString().split("T")[0];

    let aula = diario.aulas.find(a => a.data === data);
    if (!aula) {
        return res.status(400).json({ erro: "Crie a aula primeiro" });
    }

    aula.presencas[matricula] = status;

    salvar();
    notificar();

    res.json({ ok: true });
});

// 🔹 Buscar dados completos
app.get("/diario", (req, res) => {
    res.json(diario);
});

// 🔹 Long polling
app.get("/long-poll", (req, res) => {
    longPollingClients.push(res);

    req.on("close", () => {
        console.log("Cliente de long polling desconectado");
        longPollingClients = longPollingClients.filter(r => r !== res);
    });
});

app.get("/aula-atual", (req, res) => {
    const data = new Date().toISOString().split("T")[0];
    const aula = diario.aulas ? diario.aulas.find(a => a.data === data) : null;

    res.json(aula || null);
});

app.get("/aulas", (req, res) => {
    res.json(diario.aulas);
});

app.get("/aulas/:data", (req, res) => {
    const aula = diario.aulas.find(a => a.data === req.params.data);
    res.json(aula || null);
});

app.post("/marcar-todos", (req, res) => {
    // TODO: marcar todos os alunos com o mesmo status
});

app.post("/marcar-todos", (req, res) => {
    // TODO: marcar todos os alunos com o mesmo status
});

// public/professor.html
app.get("/professor", (req, res) => {
    res.sendFile(__dirname + "/public/professor.html");
});

app.get("/coordenacao-pooling", (req, res) => {
    res.sendFile(__dirname + "/public/coordenacao-pooling.html");
});

app.get("/coordenacao-long", (req, res) => {
    res.sendFile(__dirname + "/public/coordenacao-long.html");
});

app.get("/coordenacao-ws", (req, res) => {
    res.sendFile(__dirname + "/public/coordenacao-ws.html");
});

app.delete("/aula/:data", (req, res) => {
    // TODO: remover aula por data
});

server.listen(3000, () =>
    console.log("Servidor rodando em http://localhost:3000")
);