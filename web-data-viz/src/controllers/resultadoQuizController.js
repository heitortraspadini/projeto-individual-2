// !!!!!!!!!
var resultadoQuizModel = require("../models/resultadoQuizModel");
var categoriasQuiz = ["Grifinória", "Corvinal", "Lufa-Lufa", "Sonserina"];

function cadastrar(req, res) {
    var fkUsuario = req.body.fkUsuarioServer;
    var quiz = req.body.quizServer;
    var resultado = req.body.resultadoServer;

    if (fkUsuario == undefined) {
        res.status(400).send("O id do usuário está indefinido!");
    } else if (quiz == undefined) {
        res.status(400).send("O quiz está indefinido!");
    } else if (resultado == undefined) {
        res.status(400).send("O resultado está indefinido!");
    } else {
        resultadoQuizModel.cadastrar(fkUsuario, quiz, resultado)
            .then(function (resultadoCadastro) {
                res.status(201).json(resultadoCadastro);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao salvar o resultado do quiz: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarResumoDashboard(req, res) {
    var fkUsuario = req.params.fkUsuario;

    if (fkUsuario == undefined) {
        res.status(400).send("O id do usuário está indefinido!");
        return;
    }

    Promise.all([
        resultadoQuizModel.buscarUltimoResultadoPorQuiz(fkUsuario, "casas"),
        resultadoQuizModel.buscarUltimoResultadoPorQuiz(fkUsuario, "patronos"),
        resultadoQuizModel.contarUsuariosRespondentes("casas"),
        resultadoQuizModel.contarUsuariosRespondentes("patronos"),
        resultadoQuizModel.buscarDistribuicaoResultados("casas"),
        resultadoQuizModel.buscarDistribuicaoResultados("patronos")
    ]).then(function (resultados) {
        var ultimoResultadoCasas = resultados[0][0] || null;
        var ultimoResultadoPatronos = resultados[1][0] || null;
        var totalUsuariosCasas = resultados[2][0] ? Number(resultados[2][0].total_usuarios) : 0;
        var totalUsuariosPatronos = resultados[3][0] ? Number(resultados[3][0].total_usuarios) : 0;

        function montarDistribuicao(dados) {
            return categoriasQuiz.map(function (categoria) {
                var encontrado = dados.find(function (item) {
                    return item.resultado === categoria;
                });

                return {
                    resultado: categoria,
                    total: encontrado ? Number(encontrado.total) : 0
                };
            });
        }

        function calcularPercentuais(distribuicao) {
            var total = distribuicao.reduce(function (acumulado, item) {
                return acumulado + item.total;
            }, 0);

            return distribuicao.map(function (item) {
                return {
                    resultado: item.resultado,
                    total: item.total,
                    percentual: total > 0 ? Number(((item.total * 100) / total).toFixed(2)) : 0
                };
            });
        }

        res.json({
            ultimoResultadoCasas: ultimoResultadoCasas,
            ultimoResultadoPatronos: ultimoResultadoPatronos,
            totalUsuariosCasas: totalUsuariosCasas,
            totalUsuariosPatronos: totalUsuariosPatronos,
            distribuicaoCasas: calcularPercentuais(montarDistribuicao(resultados[4])),
            distribuicaoPatronos: calcularPercentuais(montarDistribuicao(resultados[5]))
        });
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar o resumo do dashboard de quizzes: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    cadastrar,
    buscarResumoDashboard
};