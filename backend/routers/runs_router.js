const express = require('express')
const router = express.Router()
const db = require('../models/db.js')
const lampService = require('../services/Lamp_service')
const runService = require('../services/run_service')
const checkAuthenticated = require('../services/auth_service').checkAuthenticated
const events = require('../sse/event');

router.get('/Monitor', checkAuthenticated, events.subscribe)

router.post('/switchLampStatus', checkAuthenticated, (req,res) => {
    lampService.switchLampStatus(req.body.name, req.body.rgb)
    res.status(200).send()
})

router.post('/RemoveLamp', checkAuthenticated, (req,res) => {
    lampService.removeLamp(req.body.name)
    res.status(200).send()
})

router.post('/TurnoffAllLamps', checkAuthenticated, (req,res) => {
    lampService.turnOffAllLamps()
    res.status(200).send()
})

router.post('/TurnoffLamp', checkAuthenticated, (req,res) => {
    lampService.turnOffLamp(req.body.name)
    res.status(200).send()
})

router.post('/getAllLamps', checkAuthenticated, (req,res) => {
    res.status(200).send({Lamps:lampService.getLamps()})
})

router.post('/getAllRuns', checkAuthenticated,(req, res) => {
    db.getAllRunsByUserID(req.user[0].id).then((row) => {
        return res.status(200).send({runs:row})
    }).catch(() => {
        return res.status(500).send({message:"wrond request"})
    })
})

router.post('/getAllRuningRuns', checkAuthenticated,(req, res) => {
    res.status(200).send({RuningRuns:runService.getRuningRuns()})
})

router.post('/addRun', checkAuthenticated,(req, res) => {
    db.insertRun(req.user[0].id,req.body.run).then((row) => {
        return res.status(200).send({message:"Run saved"})
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({message:"wrond request"})
    })
})

router.post('/deleteRun', checkAuthenticated,(req, res) => {
    db.deleteRun(req.user[0].id,req.body.id).then((row) => {
        return res.status(200).send({message:"Run deleted"})
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({message:"wrond request"})
    })
})

router.post('/editRun', checkAuthenticated,(req, res) => {
    db.editRun(req.user[0].id,req.body.id,req.body.run).then((row) => {
        return res.status(200).send({message:"Run deleted"})
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({message:"wrond request"})
    })
})

router.post('/startRun', checkAuthenticated, (req, res) => {
    db.getRunByUserID(req.user[0].id,req.body.id).then((row) => {
        runService.startRun(row[0])
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({message:"wrond request"})
    })
})

router.post('/flashLamp', checkAuthenticated, (req, res) => {
    lampService.flashLamp(req.body.name, req.body.rgb)
    res.status(200).send()
})

router.post('/stopRun', checkAuthenticated, (req, res) => {
    runService.stopRun(req.body.id)
})

router.post('/stopAllRuns', checkAuthenticated, (req, res) => {
    console.log('stopAllRuns')
})

module.exports = router