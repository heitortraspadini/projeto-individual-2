// !!!!!!!!!
var resultadoQuizModel = require("../models/resultadoQuizModel");

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

module.exports = {
    cadastrar
};