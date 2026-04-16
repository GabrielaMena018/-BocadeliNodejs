//Es el punete de conexión entre el .env y el código, aqui se dejan guardadas todas las
// llaves o claves que estan en .env desde el inicio del programa
import dotenv from "dotenv"

//Ejecutamos la libreria dotenv
dotenv.config();

export const config = {
    JWT: {
        secret: process.env.JWT_Secret_Key
    },
    
    email:{
        user_email: process.env.USER_EMAIL,
        user_password: process.env.USER_PASSWORD
    }


}

