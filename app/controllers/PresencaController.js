class PresencaController {
    constructor(diario, notificador) {
        this.diario = diario;
        this.notificador = notificador;
    }

    marcarPresenca(req, res) {
        const { matricula, status } = req.body;
        const data = new Date().toISOString().split("T")[0];

        const sucesso = this.diario.marcarPresenca(matricula, status, data);

        if (!sucesso) {
            return res.status(400).json({ erro: "Crie a aula primeiro" });
        }

        this.notificador.notificar(this.diario.obterDados());
        res.json({ ok: true });
    }

    marcarTodos(req, res) {
        const { status } = req.body;
        const data = new Date().toISOString().split("T")[0];

        const sucesso = this.diario.marcarTodosPresenca(status, data);

        if (!sucesso) {
            return res.status(400).json({ erro: "Crie a aula primeiro" });
        }

        this.notificador.notificar(this.diario.obterDados());
        res.json({ ok: true });
    }
}

module.exports = PresencaController;