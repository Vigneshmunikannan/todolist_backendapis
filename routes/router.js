const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validatetoken')
const {
    register,
    login,
    addtask,
    updatestatus,
    deletetask,
    getallcompletedtaskofsingleuser,
    getallnotcompletedtaskofsingleuser,
    getalltaskofuser,
    logout
} = require("../controllers/controllers")

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/user/addtask').post(validateToken, addtask)

router.route('/user/updatetaskstatus').put(validateToken, updatestatus)

router.route('/user/delete').delete(validateToken, deletetask)

router.route('/user/gettask/completed').post(validateToken, getallcompletedtaskofsingleuser)

router.route('/user/gettask/notcompleted').post(validateToken, getallnotcompletedtaskofsingleuser)

router.route('/user/getallusertask').post(validateToken,getalltaskofuser)

router.route('/user/logout').post(validateToken,logout)

module.exports = router