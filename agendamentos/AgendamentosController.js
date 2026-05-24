const express = require("express");
const router = express.Router();
const { Op } = require('sequelize');

const Agendamento = require("./Agendamento");
const Servico = require("../servicos/Servico");
const Ocupado = require("../ocupados/Ocupado");
const { requireAdmin } = require("../middlewares/auth");

// ─── PÚBLICO: página de agendamento ───────────────────────────────
router.get("/agendar", async (req, res) => {
    try {
        const [servicos, ocupados] = await Promise.all([
            Servico.findAll(),
            Ocupado.findAll()
        ]);
        res.render("agendar", { servicos, ocupados });
    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
});

// ─── PÚBLICO: salvar agendamento ──────────────────────────────────
router.post("/agendamento/salvar", async (req, res) => {
    const { nome, telefone, servico, data, horario } = req.body;

    const servicoValor = await Servico.findOne({ where: { id: servico } });
    const valor = servicoValor ? servicoValor.valorServico : 0;

    if (nome && telefone && servico && data) {
        await Agendamento.create({
            nomeCliente: nome,
            telefoneCliente: telefone,
            servicoId: servico,
            data,
            horario,
            valor
        });
        res.redirect("/agendar");
    } else {
        res.redirect("/agendar");
    }
});

// ─── PÚBLICO: verificar disponibilidade de data ───────────────────
router.get("/admin/verificar-data", async (req, res) => {
    const data = req.query.data;
    try {
        const [agendado, ocupado] = await Promise.all([
            Agendamento.findAll({ where: { data } }),
            Ocupado.findAll({ where: { diaOcupado: data } })
        ]);
        res.json({ agendado, ocupado });
    } catch (err) {
        res.json({ agendado: [], ocupado: [] });
    }
});

// ─── PROTEGIDO: listar agendamentos ───────────────────────────────
router.get("/admin/agendamentos", requireAdmin, async (req, res) => {
    try {
        Ocupado.destroy({
            where: { diaOcupado: { [Op.lt]: new Date() } }
        });

        const hoje = new Date().toISOString().split('T')[0];

        const [agendamentos, ocupados] = await Promise.all([
            Agendamento.findAll({
                where: { data: { [Op.gte]: hoje } },
                include: [{
                    model: Servico,
                    as: 'servico',
                    attributes: ['nomeServico']
                }]
            }),
            Ocupado.findAll()
        ]);

        res.render("admin/agendamentos", { agendamentos, ocupados });
    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
});

// ─── PROTEGIDO: deletar agendamento ───────────────────────────────
router.post("/admin/agendamentos/deletar", requireAdmin, async (req, res) => {
    const { id } = req.body;

    if (id != null && !isNaN(id)) {
        try {
            await Agendamento.destroy({ where: { id } });
        } catch (err) {
            console.error("Erro ao deletar agendamento:", err);
        }
    }
    res.redirect("/admin/agendamentos");
});

// ─── PROTEGIDO: ganhos ────────────────────────────────────────────
router.get("/admin/ganhos", requireAdmin, async (req, res) => {
    res.render("admin/ganhos");
});

module.exports = router;
