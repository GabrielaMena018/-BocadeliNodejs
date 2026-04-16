import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/PriceSmartDB")

///Comprobar que funciona la conexión
const connection = mongoose.conection;

connection.once("open",()=>{
    console.log("DB is connected")
})
connection.on("desconnected", ()=>{
    console.log("DB is disconnected")
})
connection.on("error", (error)=>{
    console.log("error found" + error)
})