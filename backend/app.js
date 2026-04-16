import express from "express"
//import productRoute from "./src/routes/products.js";
import customersRoute from "./src/routes/customers.js"
const app = express();

//app.use("/api/products", productRoute)
app.use("/api/customer", customersRoute)
app.use("/api/employees")
app.use("/api/products")


export default app;