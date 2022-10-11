// const nodemailer = require("nodemailer");

// const sendEmail = (options) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: false,
//     auth: {
//       user: "tknhu1302@gmail.com",
//       pass: "Duhocsinhmy132",
//     },
//   });

//   const mailOptions = {
//     from: "tknhu1302@gmail.com",
//     to: options.to,
//     subject: options.subject,
//     html: options.text,
//   };

// transporter.sendMail(mailOptions, function (err, info) {
//   if (err) {
//       console.log(err);

//       //   SAU KHI XOG HAY LỖI ĐỀU NÊN TRẢ VỀ TRANG CHU
//       //   res.redirect("/")
//     } else {
//       console.log(info);
//     //   res.redirect("/")
//     }
//   });
// // };


// module.exports = sendEmail


require('dotenv').config({ path: '/MERNAUTHENTICATION/.env' })
const {google} = require("googleapis")
const nodemailer = require("nodemailer")
require("dotenv").config()

const CLIENT_ID = process.env.CLIENT_ID
console.log(CLIENT_ID)
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const SendMail = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "tknhu1302@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
                from: "tknhu1302@gmail.com",
                to: options.to,
                subject: options.subject,
                html: options.text,
              };

        // let info = await transporter.sendMail({
        //     from: '"Fred Foo 👻" <tknhu1302@gmail.com>', // sender address
        //     to: "henmotmai132@gmail.com", // list of receivers
        //     subject: "Hello ✔", // Subject line
        //     text: "Hello world?", // plain text body
        //     html: "<b>MERN AUTHENTICATION</b>", // html body
        //   });
        
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
        
            //   SAU KHI XOG HAY LỖI ĐỀU NÊN TRẢ VỀ TRANG CHU
            //   res.redirect("/")
            } else {
              console.log(info);
            //   res.redirect("/")
            }
          });

          console.log(info)
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = SendMail





