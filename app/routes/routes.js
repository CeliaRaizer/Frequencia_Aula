const express = require("express");
const path = require("path");

function configurarRotas(app, aulaController, presencaController, notificador) {
    const router = express.Router();

    // ========== Rota Inicial ==========
    router.get("/", (req, res) => res.sendFile(path.join(__dirname, "../../public/index.html")));

    // ========== Rotas de Aula ==========
    router.post("/nova-aula", (req, res) => aulaController.criarNovaAula(req, res));
    router.get("/diario", (req, res) => aulaController.obterDiario(req, res));
    router.get("/aula-atual", (req, res) => aulaController.obterAulaAtual(req, res));
    router.get("/aulas", (req, res) => res.sendFile(path.join(__dirname, "../../public/aulas.html")));
    router.get("/aulas/:data", (req, res) => aulaController.obterAulaPorData(req, res));
    router.get("/aula/:data", (req, res) => aulaController.obterAulaPorData(req, res));
    router.delete("/aula/:data", (req, res) => aulaController.deletarAula(req, res));

    // ========== Rotas de Presença ==========
    router.post("/marcar", (req, res) => presencaController.marcarPresenca(req, res));
    router.post("/marcar-todos", (req, res) => presencaController.marcarTodos(req, res));

    // ========== Rotas de Views ==========
    router.get("/professor", (req, res) => res.sendFile(path.join(__dirname, "../../public/professor.html")));
    router.get("/coordenacao-pooling", (req, res) => res.sendFile(path.join(__dirname, "../../public/coordenacao-pooling.html")));
    router.get("/coordenacao-long", (req, res) => res.sendFile(path.join(__dirname, "../../public/coordenacao-long.html")));
    router.get("/coordenacao-ws", (req, res) => res.sendFile(path.join(__dirname, "../../public/coordenacao-ws.html")));

    // ========== Long Polling ==========
    router.get("/long-poll", (req, res) => {
        const timeout = setTimeout(() => {
            res.json({ timeout: true });
        }, 30000); // 30 segundos

        notificador.adicionarClienteLongPolling(res);

        req.on("close", () => {
            clearTimeout(timeout);
            notificador.removerClienteLongPolling(res);
        });
    });

    router.get("/health", (req, res) => res.json({ status: "ok" }));

    return router;
}

module.exports = configurarRotas;