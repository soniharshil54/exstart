const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
	name:{
		type:"String",
		required : "true"
	},
	email:{
		type:"String",
		required : "true"
	},
	contact:{
		type:"String",
		required : "true"
	},
	address:{
		type:"String",
		required : "true"
	},
	qualification:{
		type:"String",
		required : "true"
	},
	gender:{
		type:"String",
		required:"true"
	},
	password:{
		type:"String",
		required:"true"
	},
	profile:{
		type:"String",
		required:"true"
	}
})


module.exports = mongoose.model("Users",userSchema)