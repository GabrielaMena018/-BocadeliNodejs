/**
 * Campos:
    name
    lastName
    email
    password
    role
    salary
    phone
    isVerified
 */

import {Schema,model} from "mongoose"

const employeesSchema = new Schema({
    name:{
        type: String
    },
    lastname:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    role:{
        type: String
    },
    salary:{
        type: Number
    },
    phone:{
        type: String
    },
    isVerified:{
        type: Boolean
    }
});

export default model("Employees", employeesSchema)