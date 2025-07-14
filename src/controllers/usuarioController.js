var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var nome = req.body.nomeServer;
    var titulo = req.body.tituloServer;
    var compra = req.body.compraServer;
    var venda = req.body.vendaServer;
    


    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (titulo == undefined) {
        res.status(400).send("seu titulo está indefinida!");
    } else if (compra == undefined) {
        res.status(400).send("Seu valor de compra está undefined!");
    }
    else if (venda == undefined) {
        res.status(400).send("Seu valor de venda está undefined!");
    } else {

        usuarioModel.autenticar(nome, titulo, compra, venda)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    res.json({
                                        // id: resultadoAutenticar[0].id,
                                        nome: resultadoAutenticar[0].nome,
                                        venda: resultadoAutenticar[0].venda,
                                        compra: resultadoAutenticar[0].compra,
                                        titulo: resultadoAutenticar[0].titulo,
                                        // nome: resultadoAutenticar[0].nome,
                                        email: resultadoAutenticar[0].email,
                                        aquarios: resultadoAquarios
                                    });
                                } else {
                                    res.status(204).json({ aquarios: [] });
                                }
                            })
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var compra = req.body.compraServer;
    var venda = req.body.vendaServer;
    var titulo = req.body.tituloServer;
    var estoque = req.body.estoqueServer;
    var genero = req.body.generoServer;
    // var fkEmpresa = req.body.idEmpresaVincularServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (titulo == undefined) {
        res.status(400).send("Seu titulo está undefined!");
    } else if (compra == undefined) {
        res.status(400).send("Seu valor de compra está undefined!");
    } else if (venda == undefined) {
        res.status(400).send("Seu valor de venda está undefined!");
    }
     else if (genero == undefined) {
        res.status(400).send("Seu genero de livro está undefined!");
    }
    else if (estoque == undefined) {
        res.status(400).send("Seu valor do estoque está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, titulo, compra, venda, estoque, genero)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}