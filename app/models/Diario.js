const fs = require("fs");
const path = require("path");

class Diario {
    constructor(filePath = "diario.json") {
        this.filePath = filePath;
        this.carregar();
    }

    carregar() {
        try {
            const dados = fs.readFileSync(this.filePath, "utf-8");
            this.dados = JSON.parse(dados);
        } catch (err) {
            console.error("Erro ao carregar diário:", err.message);
            this.dados = { aulas: [], alunos: [] };
        }
    }

    salvar() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.dados, null, 2));
        } catch (err) {
            console.error("Erro ao salvar diário:", err.message);
        }
    }

    obterDados() {
        return this.dados;
    }

    obterAulas() {
        return this.dados.aulas || [];
    }

    obterAulaPorData(data) {
        return this.dados.aulas?.find(a => a.data === data) || null;
    }

    criarAula(data) {
        const aulaExistente = this.obterAulaPorData(data);
        if (aulaExistente) {
            return null;
        }

        const novaAula = {
            data,
            presencas: {}
        };

        if (!this.dados.aulas) this.dados.aulas = [];
        this.dados.aulas.push(novaAula);
        this.salvar();
        return novaAula;
    }

    marcarPresenca(matricula, status, data) {
        const aula = this.obterAulaPorData(data);
        if (!aula) {
            return false;
        }

        aula.presencas[matricula] = status;
        this.salvar();
        return true;
    }

    marcarTodosPresenca(status, data) {
        const aula = this.obterAulaPorData(data);
        if (!aula) {
            return false;
        }

        if (this.dados.alunos) {
            this.dados.alunos.forEach(aluno => {
                aula.presencas[aluno.matricula] = status;
            });
        }

        this.salvar();
        return true;
    }

    deletarAula(data) {
        const index = this.dados.aulas?.findIndex(a => a.data === data);
        if (index === -1 || index === undefined) {
            return false;
        }

        this.dados.aulas.splice(index, 1);
        this.salvar();
        return true;
    }
}

module.exports = Diario;