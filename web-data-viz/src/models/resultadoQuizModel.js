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

function buscarUltimoResultadoPorQuiz(fkUsuario, quiz) {
    var instrucaoSql = `
                SELECT resultado, DATE_FORMAT(realizado_em, '%d/%m/%Y %H:%i') AS realizado_em_formatado
        FROM resultado_quiz
        WHERE fk_usuario = ${fkUsuario}
          AND quiz = '${quiz}'
                ORDER BY realizado_em DESC, id DESC
        LIMIT 1;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function contarUsuariosRespondentes(quiz) {
    var instrucaoSql = `
        SELECT COUNT(DISTINCT fk_usuario) AS total_usuarios
        FROM resultado_quiz
        WHERE quiz = '${quiz}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDistribuicaoResultados(quiz) {
    var instrucaoSql = `
        SELECT resultado, COUNT(*) AS total
        FROM resultado_quiz
        WHERE quiz = '${quiz}'
        GROUP BY resultado
        ORDER BY total DESC, resultado ASC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    buscarUltimoResultadoPorQuiz,
    contarUsuariosRespondentes,
    buscarDistribuicaoResultados
};