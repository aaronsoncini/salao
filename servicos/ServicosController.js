const express = require("express");
const router = express.Router();
const Servico = require("./Servico");
const { requireAdmin } = require("../middlewares/auth");

// ─── PROTEGIDO: página de novo serviço ────────────────────────────
router.get("/admin/novoservico", requireAdmin, async (req, res) => {
    try {
        const servicos = await Servico.findAll();
        res.render('admin/novoservico', { servicos });
    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
});

// ─── PROTEGIDO: salvar novo serviço ───────────────────────────────
router.post("/admin/salvarservico", requireAdmin, (req, res) => {
    const { nome, valor } = req.body;

    if (nome && valor) {
        Servico.create({
            nomeServico: nome,
            valorServico: valor
        }).then(() => {
            res.redirect("/admin/novoservico");
        });
    } else {
        res.redirect("/admin/novoservico");
    }
});

// ─── PROTEGIDO: deletar serviço ───────────────────────────────────
router.post("/admin/deletarservico", requireAdmin, async (req, res) => {
    const { id } = req.body;
    if (id != null && !isNaN(id)) {
        try {
            await Servico.destroy({ where: { id } });
        } catch (err) {
            console.error(err);
        }
    }
    res.redirect("/admin/novoservico");
});

module.exports = router;
