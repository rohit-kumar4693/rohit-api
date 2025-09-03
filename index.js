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



app.get("/categories" ,async(req,res)=>{

await client.connect();

let db = client.db("rohit_db");

let categories = db.collection("category");

let resp = await categories.aggregate([

    {

        $project : {

            cat_name:1,cat_alias:1,_id:0,id:1

        }

    },

    {

        $lookup : {

            from : "products_1",
            localField : "id",
            foreignField : "cat_id",
            pipeline : [
                {
                    $project :{
                        _id:0,cat_name:0
                    }
                }
            ],
            as : "prd"

        }

    }


]).toArray();

res.json(resp)

});






app.listen(7800 , ()=>console.log("Api server start"));
