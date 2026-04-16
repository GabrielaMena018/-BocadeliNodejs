import customerModel from "../models/customer.js";

const customerController = {};


//Get
customerController.getCustomers = async (req, res) => {
    try {
        const customers = await customerModel.find()
        return res.status(200).json(customers)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//Update
customerController.updateCustomers = async (req, res) => {
    try {
        let{
            name,
            lastName,
            email,
            password,
            phone,
            address,
            isVerified,
        } = req.body;

        //Validaciones
        //Sanitizar
        name = name?.trim()
        password = password?.trim()
        email = email.trim()

        //Validar campos requeridos
        if(!name || !email || !password || !phone){
            return res.json.status(400).json({message: "Fields required"})
        }

         //Longitud de caracteres
        if(name.length < 3 || name.length > 15){
            return res.status(400).json({message: "Please insert a valid name"})
        }
        if(password < 8 || password > 10){
            return res.status(400).json({message: "Please insert a valid password"})
        }

        const customerUpdate = await customerModel.findByIdAndUpdate(req.params.id, {
            name,
            lastName,
            email,
            password,
            phone,
            address,
            isVerified
        }, { new: true })

        if(!customerUpdated){
            return res.status(404).json({message: "Customer not found"});
        }

        return res.status(200).json(customerUpdate)

    } catch (error) {
         console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//DELETE
customerController.deleteCustomers = async (req, res) => {
    try {
        const deletedCustomer = customerModel.findByIdAndDelete(req.params.id);

        if(!deletedCustomer){
            return res.status(404).json({message: "Customer not found"});
        }

        return res.status(200).json({message: "customer deleted"})
        
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default customerController;