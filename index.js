let express = require("express");

let { MongoClient } = require("mongodb");

let client = new MongoClient("mongodb+srv://rk0418813:123%40rohit@cluster0.oo8dtsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

let app = express();

app.get("/products" ,async(req,res)=>{

await client.connect();

let db = client.db("rohit_db");

let products = db.collection("products_1");

let resp = await products.find({}).toArray();

res.json(resp)

});

app.listen(7800 , ()=>console.log("Api server start"));
