const express = require("express");
const server = express();

// pegar banco de dados
const db = require("./database/db.js");

// configurar pasta public
server.use(express.static("public"));

// habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }));

// utilizando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

// configurar caminhos da aplicação
//página inicial
// req: requisição - pedido
// res: resposta
server.get("/", (req, res) => {
  return res.render("index.html", { title: "um título" });
});
server.get("/create-point", (req, res) => {
  return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {
  // inserir dados no database
  const query = `
     INSERT INTO places (
       image,
       name, 
       address, 
       address2,
       state,
       city, 
       items
     ) VALUES (?, ?, ?, ?, ?, ?, ?);
   `;
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ];

  function afterInsertData(err) {
    if (err) {
      console.log(err);
      return res.send("Erro no cadastro");
    }
    console.log("Cadastrado com sucesso");
    console.log(this);

    return res.render("create-point.html", { saved: true });
  }
  db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {
  const search = req.query.search;

  if (search == "") {
    // pesquisa vazia
    return res.render("results.html", { total: 0 });
  }

  // pegar dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (
    err,
    rows
  ) {
    if (err) {
      return console.log(err);
    }
    const total = rows.length;
    // mostrar a página html com os dados do database
    return res.render("results.html", { places: rows, total: total });
  });
});

// ligar o servidor
server.listen(3000);
