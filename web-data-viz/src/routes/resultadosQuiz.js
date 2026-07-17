// !!!!!!!!!
var express = require("express");
var router = express.Router();

var resultadoQuizController = require("../controllers/resultadoQuizController");

router.post("/cadastrar", function (req, res) {
    resultadoQuizController.cadastrar(req, res);
});

router.get("/resumo/:fkUsuario", function (req, res) {
    resultadoQuizController.buscarResumoDashboard(req, res);
});

module.exports = router;