// !!!!!!!!
var database = require("../database/config");

function cadastrar(fkUsuario, quiz, resultado) {
    console.log("ACESSEI O RESULTADO QUIZ MODEL \n\n function cadastrar():", fkUsuario, quiz, resultado);

    var instrucaoSql = `
        INSERT INTO resultado_quiz (fk_usuario, quiz, resultado) VALUES (${fkUsuario}, '${quiz}', '${resultado}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar
};