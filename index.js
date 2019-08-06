const express = require("express")
const bodyParser = require("body-parser")
const Users = require("./models/users.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(bodyParser.json())


mongoose.connect("mongodb://soni3360:soni3360@ds157707.mlab.com:57707/interuser", 
	() => console.log("mongodb connected"))

function checkAuth(req,res,next){
	try {
		const token = req.headers.authorization
		const decoded = jwt.verify(token,"soni3360")
		req.userData = decoded
		next() 
	}
	catch(err){
		res.status(500)
		return
	}
}

app.get("/get",(req,res,next) => {
	Users.find()
		 .then(result=>res.json(result))
		 .catch(err=>res.json(err))

})

app.get("/getone/:id", (req,res) => {
	Users.findOne({_id:req.params.id})
	     .then(result=>res.json(result))
	     .catch(err=>res.json(err))

})


app.post("/api/signup", (req,res) => {


	Users.find({email:req.body.email})
		 .then(user=>{
		 	if(user.length>=1){
		 		res.status(500).send("email already exists")
		 		return
	 		}


	 		else{

	 			bcrypt.hash(req.body.password,10,(err,hash)=>{
	 				if(err){
	 					res.status(500).json({"error":err})
	 				}
	 				else{
	 					const user = new Users({
		        		  name:req.body.name,
		       		      email:req.body.email,
		        		  contact:req.body.contact,
		        		  address:req.body.address,
		        		  qualification:req.body.qualification,
		         		  gender:req.body.gender,
		         		  password:hash,
		        		  profile:req.body.profile
						})          


				user.save()
					.then((result)=>{
						res.json({"result":"user created", "addeduser":result})
					})
					.catch((err)=>{
						console.log(err)
						res.status(400).json(err)
					})

	 				}
	 			})

	 			

	 	}

	 })
		 .catch(err=>res.status(500).json(err))

})

app.post("/api/login", (req,res) => {
	const email= req.body.email
	const password = req.body.password
	const loguser = {
		email,
		password
	}

	Users.findOne({email:email})
		 .then(user=> {
		 	if(!user){
		 		res.status(404).send("user not found")
		 		return
		 	}

		 else{
		 	console.log(user)
		 	bcrypt.compare(req.body.password,user.password,(err,response)=>{

		 		if(err){
		 			console.log(err)
		 			
		 			
		 		}
		 		

		 		if(response){
		 			const token = jwt.sign({
		 				email:user.email,

		 			},"soni3360")
		 			

		 			res.status(200).json({"message":"auth succesfull","token":token})
		 			return
		 		}

		 		if(!response){
		 			console.log(err)
		 			return res.status(500).send("password didnt match")
		 			
		 		}


		 	})
		 }	

		 })
		 .catch(err=>{
		 	console.log(err)
		 	res.status(502).json(err)})

})


app.delete("/api/delete/:id",(req,res) => {
	Users.findOneAndRemove({_id:req.params.id})
		.then(result=> res.json({"result":"user deteted","deleteduser":result}))
		.catch(err=>res.status(404).json(err))

})


app.put("api/update/:id", (req,res) => {
	Users.findOneAndUpdate({_id:req.params.id},req.body)
		.then(result=> res.json({"result":"user updated","updateduser":result}))
		.catch(err=>res.status(404).json(err))

})







app.listen(5000, () => console.log("server started on port 5000"))