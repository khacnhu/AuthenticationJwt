const User = require("../models/user");
const bcrypt = require("bcrypt");
const SendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const {sendToken, sendRefreshTokenAndToken} = require("../helpers/sendTokenandRefreshToken")

// const sendToken = (user, statusCode, res) => {
//     const token = user.getSignedJwtToken();

//     res.status(statusCode).json({ sucess: true, user, token });
//   };

// const sendRefreshTokenAndToken = (user, statusCode, res) => {
//     const token = user.getSignedJwtToken();
//     const refreshtoken = user.getSignedJwtRefreshToken()

//     res.status(statusCode).json({ sucess: true, user, token, refreshtoken });
// };


// REGISTER.................//////
const register = async (req, res, next)=>{
    try {
        const {username, email, password} = req.body
        const oldUser = await User.findOne({email})
        if (oldUser) {
            res.status(400).send("email của bạn đã từng có người đăng ký")
        }

        const newUser = await User.create({
            username, email, password
        });

        sendToken(newUser, 200, res)

        // res.status(200).send({status: true, newUser})

    } catch (error) {
        next(error)
    }
}




//LOGIN...............////..........///
const login =  async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select("+password")

        if(!user){
            res.status(401).send({status: false, message: "EMAIL CỦA CHƯA ĐƯỢC ĐĂNG KÝ"})
        }

        const isMatchpassword = await user.matchPassword(password)


        if(!isMatchpassword) {
            res.status(401).send({status: false, message: "MẬT KHẨU CỦA BẠN KHÔNG ĐÚNG"})
        }

        sendRefreshTokenAndToken(user, 200, res)
        

    } catch (error) {
        next(error)
    }
}




//REFREH LẠI TOKEN ..................../////

let refreshTokens = []

const refresh = async(req, res, next) => {
    try {
        
        const refreshToken = req.body.token
        
    if (!refreshToken) {
        return res.status(401).send({status: false, message: "TOKEN CỦA BẠN KHÔNG ĐÚNG NÊN BẠN KO CÓ QUYỀN"})
    }

    if (!refreshTokens.includes(refreshToken)){
        return res.status(403).send({status: false, message: "Refresh Token của bạn không có giá trị"})
    }

    jwt.verify(refreshToken,  "refreshsecretkey", (err, user) => {
        err && console.log(err)

        refreshTokens = refreshTokens.filter(token => token !== refreshToken)

        const newAccessToken = user.getSignedJwtToken();
        const newRefreshToken = user.getSignedJwtRefreshToken()

        refreshTokens.push(newRefreshToken)

        res.status(200).send({statue: true, newAccessToken, newRefreshToken })
        
        
    })
    } catch (error) {
        next(error)
    }       
}




//FORGOTPASSWORD....................../////

const forgotpassword = async (req, res, next) => {
    const email = req.body.email
    try {
        
        const user = await User.findOne({email})
        if(!user){
            res.status(404).send({statue: false, message: "EMAIL CỦA BẠN KHÔNG ĐÚNG"})
        }

        const resetToken = user.getResetPasswordToken()
        
        await user.save()

        const resetPasswordUrl = `http://localhost:3000/passwordresset/:${resetToken}`

        const messageText = `
            <h1>ĐÂY LÀ ĐƯỜNG DẪN ĐỂ BẠN RESET PASSWORD</h1>
            <p>XIN HÃY NHẤN VÀO ĐƯỜNG DẪN DƯỚI ĐÂY</p>
            <a href = ${resetPasswordUrl} clicktracking = off >${resetPasswordUrl}</a>
        `
        try {
            await SendMail({
                to: user.email,
                subject: "REQUETS YÊU CẦU THAY ĐỔI PASSWORD",
                text: messageText
            })

            res.status(200).send({statue: true, data: "Email đã được gửi đi"})
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
      
            await user.save();
      
            //cái chỗ error này nên xem lại
            return next(error);
        }

    } catch (error) {
        next(error)
    }
}



//RESET PASSWORD ..........................//....

const resetpassword = async (req, res, next) => {
    const resetToken = req.params.resetToken
    const resetPasswordToken = crypto.createHashh("sha26").update(resetToken).diget("hex");
    
    try {
        
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswrordExpire: { $gt: Date.now()  }
        })
        
        if (!user){
            return res.status(400).json("CO THE CAI REFRESH TOKEN BAN GUI LEN KHONG DUNG HOAC LA BAN KHONG CO QUYEN TRUY CAP VI USER KO CO")

        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save()

        res.status(200).send({status: true, message: "Password cua ban da duoc thay doi", token: user.getSignedJwtToken()})

    } catch (error) {
        next(error)
    }


}

// CÁI CHANGEPASSWORD NÀY CH CHẮC ĐÚNG MONG MỌI NGƯỜI THAM KHẢO HAY LÀ CÓ GÓP Ý GÌ HAY LIÊN HỆ QUA EMAIL
// ĐÂY LÀ EMAIL CỦA TÔI "tknhu1302@gmail.com" hoặc là "henmotmai132@gmail.com"
const changepassword = async (req, res, next) => {
    try {
        const email = req.params.email
        
        const user = await User.findOne({email})
        
        if(!user) {
            res.status(400).json("Email này không đúng")
        }

        const newPassword = req.body.password
        
        //Ban đầu sẽ có ô nhập password cũ để check là bạn có nhớ mật khẩu cũ và xác nhận luôn cho chắc
        //Rồi sau đó đặt password mới, Check password ở đây là xem newpassword có trùng vs password cũ hay không
        user.password = newPassword
        
        await user.save()

        res.status(200).send({status: "true", message: "Bạn đã đổi password thành công"})
    } catch (error) {
        next(error)
    }
}


const logout = async (req, res, next) => {
    const refreshToken = req.body.token
    try{
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        res.status(200).json("Ban đã logout thành công.");
    } catch (error) {
        next(error)
    }

}



module.exports = {
    register,
    login,
    refresh,
    forgotpassword,
    resetpassword,
    changepassword,
    logout
}