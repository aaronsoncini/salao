const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");
const { requireAdmin } = require("./middlewares/auth");

// Routers
const agendamentosController = require("./agendamentos/AgendamentosController");
const servicosController = require("./servicos/ServicosController");
const ocupadoController = require("./ocupados/OcupadoController");

// Models
const Servico = require("./servicos/Servico");
const Agendamento = require("./agendamentos/Agendamento");
const Ocupado = require("./ocupados/Ocupado");

// View engine
app.set('view engine', 'ejs');

// Arquivos estáticos
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sessão
app.use(session({
    secret: 'salao-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// Conexão com o banco
connection.authenticate().then(() => {
    console.log("Conexão com o banco de dados realizada!");
}).catch((error) => {
    console.log(error);
});

// ─── ROTAS PÚBLICAS ───────────────────────────────────────────────
app.get("/", (req, res) => {
    res.render("index");
});

// Agendamento público e verificação de datas (sem login)
app.use("/", agendamentosController);
app.use("/", ocupadoController);

// ─── ROTAS DE LOGIN ADMIN ─────────────────────────────────────────
app.get("/admin/login", (req, res) => {
    if (req.session && req.session.adminLogado) {
        return res.redirect("/admin/agendamentos");
    }
    res.render("admin/login", { erro: null });
});

app.post("/admin/login", (req, res) => {
    const { usuario, senha } = req.body;

    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin123";

    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
        req.session.adminLogado = true;
        res.redirect("/admin/agendamentos");
    } else {
        res.render("admin/login", { erro: "Usuário ou senha incorretos." });
    }
});

app.get("/admin/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
});

// ─── ROTAS PROTEGIDAS (requerem login) ────────────────────────────
app.use("/admin/agendamentos", requireAdmin);
app.use("/admin/novoservico", requireAdmin);
app.use("/admin/salvarservico", requireAdmin);
app.use("/admin/deletarservico", requireAdmin);
app.use("/admin/ganhos", requireAdmin);

app.use("/", servicosController);

// ─── SERVIDOR ─────────────────────────────────────────────────────
app.listen(8080, () => {
    console.log("O servidor está rodando em http://localhost:8080");
});
