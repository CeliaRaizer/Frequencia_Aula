class AulaController {
    constructor(diario, notificador) {
        this.diario = diario;
        this.notificador = notificador;
    }

    criarNovaAula(req, res) {
        const data = new Date().toISOString().split("T")[0];
        const aula = this.diario.criarAula(data);

        if (!aula) {
            return res.json({ mensagem: "Aula já criada hoje" });
        }

        this.notificador.notificar(this.diario.obterDados());
        res.json({ mensagem: "Nova aula criada", data });
    }

    obterAulaAtual(req, res) {
        const data = new Date().toISOString().split("T")[0];
        const aula = this.diario.obterAulaPorData(data);
        res.json(aula || null);
    }

    obterAulaPorData(req, res) {
        const { data } = req.params;
        const aula = this.diario.obterAulaPorData(data);
        res.json(aula || null);
    }

    obterAulas(req, res) {
        res.json(this.diario.obterAulas());
    }

    deletarAula(req, res) {
        const { data } = req.params;
        const sucesso = this.diario.deletarAula(data);

        if (!sucesso) {
            return res.status(404).json({ erro: "Aula não encontrada" });
        }

        this.notificador.notificar(this.diario.obterDados());
        res.json({ mensagem: "Aula removida" });
    }

    obterDiario(req, res) {
        res.json(this.diario.obterDados());
    }
}

module.exports = AulaController;