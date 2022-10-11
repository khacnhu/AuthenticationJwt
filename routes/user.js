const express = require("express")
const router = express.Router()
const {register, login, refresh, forgotpassword, resetpassword, changepassword, logout} = require("../contronllers/userControllers")
const verify = require("../middleware/verifyToken")


router.post("/register", register)
router.post("/login", login)

//REFRESHTOKEN.....................
router.post("/refresh", refresh)

router.post("/forgotpassword", forgotpassword)

router.put("/passwordreset/:resetToken", resetpassword)


router.post("/changepassword/:email", changepassword)


//ĐỂ Ý CHỖ NÀY TRƯỚC KHI LOGOUT HỌ CÓ MIDDLEWARE CHECK TOKEN Ở HEADER AUTHORIZATION NHA
router.post("/logout",verify.verifyToken ,logout)

module.exports = router



