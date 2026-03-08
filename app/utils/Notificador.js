const WebSocket = require("ws");

class Notificador {
    constructor(wss) {
        this.wss = wss;
        this.longPollingClients = [];
    }

    adicionarClienteLongPolling(res) {
        this.longPollingClients.push(res);
    }

    removerClienteLongPolling(res) {
        this.longPollingClients = this.longPollingClients.filter(r => r !== res);
    }

    notificar(diario) {
        console.log("Notificando clientes...");
        console.log("Clientes WebSocket:", this.wss.clients.size);
        console.log("Clientes Long Polling:", this.longPollingClients.length);

        // Notificar WebSocket
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log("Enviando atualização via WebSocket");
                client.send(JSON.stringify(diario));
            }
        });

        // Notificar Long Polling
        this.longPollingClients.forEach(res => {
            try {
                res.json(diario);
            } catch (e) {
                console.error("Erro ao notificar cliente long polling:", e.message);
            }
        });

        this.longPollingClients = [];
    }
}

module.exports = Notificador;