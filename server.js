const express = require("express");
const fs = require("fs"); //le e escreve o arquivo diario.json
const http = require("http");
const WebSocket = require("ws");  //biblioteca WebSocket

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); //servidor WebSocket usando a mesma porta

app.use(express.json());
app.use(express.static("public"));

let diario = JSON.parse(fs.readFileSync("diario.json")); //le o json e guarda

let longPollingClients = [];

function salvar() { //salva o objeto atualizado no arquivo
    fs.writeFileSync("diario.json", JSON.stringify(diario, null, 2));
}

wss.on("connection", ws => { //roda quando um cliente webSocket conecta
    
    console.log("Cliente WebSocket conectado");

    // Envia estado atual ao conectar
    ws.send(JSON.stringify(diario));

    ws.on("close", () => {
        console.log("Cliente WebSocket desconectado");
    });

    ws.on("error", err => {
        console.log("Erro WS:", err.message);
    });
});

function notificar() { //atualiza webSockets, responde clientes Long Polling, limpa a lista
    console.log("Notificando clientes...");
    console.log("Clientes WebSocket:", wss.clients.size);
    console.log("Clientes Long Polling:", longPollingClients.length);

    // implementar
    //  WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(diario));
        }
    });

    //  Long Polling
    longPollingClients.forEach(res => {
        try {
            res.json(diario);
        } catch (e) {}
    });

    longPollingClients = [];
}

// 🔹 Criar nova aula (data atual)
app.post("/nova-aula", (req, res) => {
    // implementar
    const data = new Date().toISOString().split("T")[0];

    if (!diario.aulas) diario.aulas = [];

    const aulaExistente = diario.aulas.find(a => a.data === data);

    if (aulaExistente) {
        return res.json({ msg: "Aula já existe" });
    }

    diario.aulas.push({ data, presencas: {} });

    salvar();
    notificar();

    res.json({ mensagem: "Aula criada", data });
});

// 🔹 Marcar presença
app.post("/marcar", (req, res) => {
    // implementar
    const { matricula, status } = req.body;
    const data = new Date().toISOString().split("T")[0];

    const aula = diario.aulas.find(a => a.data === data);

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
    // implementar
    const timeout = setTimeout(() => {
        res.json({ timeout: true });
    }, 30000);

    longPollingClients.push(res);

    req.on("close", () => {
        clearTimeout(timeout);
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
    const { status } = req.body;
    const data = new Date().toISOString().split("T")[0];

    const aula = diario.aulas.find(a => a.data === data);

    if (!aula) {
        return res.status(400).json({ erro: "Crie a aula primeiro" });
    }

    diario.alunos.forEach(aluno => {
        aula.presencas[aluno.matricula] = status;
    });

    salvar();
    notificar();

    res.json({ mensagem: "Todos marcados" });
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
    const index = diario.aulas.findIndex(a => a.data === req.params.data);
    if (index === -1) return res.status(404).json({ erro: "Aula não encontrada" });

    diario.aulas.splice(index, 1);
    salvar();
    notificar();
    res.json({ mensagem: "Aula removida" });
});

server.listen(3000, () =>
    console.log("Servidor rodando em http://localhost:3000")
);