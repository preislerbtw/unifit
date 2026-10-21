
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { naoEncontrado, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Servidor rodando!" });
});

app.use(routes);

app.use(naoEncontrado);
app.use(errorHandler);

module.exports = app;
