const express = require("express");
const router = express.Router();

const Ocupado = require("../ocupados/Ocupado");
const Agendamento = require("../agendamentos/Agendamento");

router.get("/admin/verificar-data",async (req,res)=>{
    const dataAlvo = req.query.data;

    try{
        const ocupado = await Ocupado.findAll({
            where:{
                diaOcupado:dataAlvo
            }
        })
        const agendado = await Agendamento.findAll({
            where:{
                data:dataAlvo
            }
        })

        return res.json({ocupado:ocupado,agendado:agendado});
    }
    catch{
        console.log("Não tem ocupação");
        return false;
    }
})

module.exports = router;