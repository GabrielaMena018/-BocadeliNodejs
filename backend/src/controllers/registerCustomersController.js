import nodemailer from "nodemailer"; //Enviar correos
import crypto from "crypto"; //Generar códigos aleatorios
import jsonwebtoken from "jsonwebtoken"; //Generar tokens de autenticación
import bcryptojs from "bcryptjs"; //Encriptar contraseñas

import customerModel from "../models/customers.js";

//Importar archivo config
import { config } from "../../config.js";

//array de funciones
const registerCustomerController = {};

registerCustomerController.resgisterCustomer = async (req, res) => {
    try {
        const{
            name,
            lastName,
            email,
            password,
            phone,
            address,
            isVerified,
            loginAttemps,
            timeOut
            
        } = req.body;

         //2. Validar si el correo existe en la base de datos
        const existCustomer = await customerModel.findOne({ email: email });

        if (existCustomer) {
            return res.status(400).json({ message: "Customer already exists" })
        }

        //3.Encriptar la contraseña 
        const passwordHashed = await bcryptojs.hash(password, 10)

        //4.Generar un código aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign({
            name,
            lastName,
            email,
            password: passwordHashed,
            phone,
            address,
            isVerified,
            loginAttemps,
            timeOut
        },

        config.JWT.secret,

        {expiresIn: "15m"}

    );

     //6. Guardamos el token en una cookie
        res.cookie("registrationCookie", token, {maxAge: 15 * 60 * 1000})

        //7. Enviar el correo con el codigo aleatorio
        //PASO 1: Quien lo envia -> Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            },
        });

        //PASO 2: QUIEN LO RECIBE Y CÓMO-> mailOptions
        const mailOptions ={
            from: config.email.user_email,
            to: email,
            subject: "Verificar cuenta",
            text: "Para verificar tu cuenta, utiliza este código" + randomCode + " expira en 15 minutos"
        };

        //PASO #: ENVIAR EL CORREO ELECTRONICO 
        transporter.sendMail(mailOptions, (error, info) =>{
            if(error){
                console.log("error")
                return res.status(500).json({message: "Error sending email"})
            }
            
            return res.status(200).json({message: "Email sent"})
        })


    } catch (error) {
         console.log("Error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
    
}

//----------------------------------------------------------------------------------
// ------------------- Verificar el codigo  que acabamos de enviar -----------------
//----------------------------------------------------------------------------------
registerCustomerController.verifyCode = async (req, res) => {
    try {
        //PASO 1 solitamos el codigo que el usuario escribio en el frontend
    const { vericationCodeRequest } = req.body;

    //Obtener el token de las cookies
    const token = req.cookies.registrationCookie
    //Extraer toda la información del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    const{
        randomCode: storedCode,
        name,
        lastName,
        email,
        password,
        phone,
        address,
        isVerified,
        loginAttemps,
        timeOut

    }= decoded

    if(vericationCodeRequest !== storedCode){
        return res.status(400).json({message: "Invalid code"})
    
    }
       const newCustomer = customerModel({
        name,
        lastName,
        email,
        password,
        phone,
        address,
        password,
        isVerified: true,
    });

     await newCustomer.save()

    res.clearCookie("registrationCookie")

    return res.status(200).json({message: "Customer registered"})

    } catch (error) {
        console.log("Error" + error)
    return res.status(500).json({message: "Internal server error"})
    }

    
}

export default registerCustomerController;