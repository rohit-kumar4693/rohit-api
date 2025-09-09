let express = require("express");
let cors = require("cors");

let { MongoClient } = require("mongodb");

let client = new MongoClient("mongodb+srv://rk0418813:123%40rohit@cluster0.oo8dtsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

let app = express();

app.use(cors());



app.get("/customers" ,async(req,res)=>{

await client.connect();

let db = client.db("sqldemo1");

let products = db.collection("customers");

let resp = await products.aggregate([


    {

        $project : {

            customerNumber:1 , _id:0 , customerName:1 , country:1

        }

    },
    {

        $lookup:{

            from:"payments",
            localField:"customerNumber",
            foreignField:"customerNumber",
            as:"payments",
            pipeline:[
                {
                    $project :{

                        _id :0, customerName:0
                    }
                }
                
            ]
        }

    },

    {

        $lookup :{

            from :"orders",
            localField:"customerNumber",
            foreignField:"customerNumber",
            as:"orders",
            pipeline:[

            {
                
                $project :{

                    _id:0 , customerNumber:0 , requiredData :0 , shippedDate:0 , comments:0

                }

            },

            {

                $lookup:{

                    from:"orderdetails",
                    localField:"orderNumber",
                    foreignField:"orderNumber",
                    pipeline:[

                        {

                            $project :{

                                _id:0,productCode:1,quantityOrdered:1

                            }

                        },
                        {

                            $lookup:{

                                from:"products",
                                localField:"productCode",
                                foreignField:"productCode",
                                as:"productDatails",
                               
                                pipeline:[

                                    {

                                        $project:{

                                            _id:0,productName:1,productDescription:1 

                                        }

                                    }

                                ]

                            }

                        }

                    ],
                    as :"orderDetails"



                }

            }


            ]

        }

    }


]).toArray();

res.json(resp)

});

app.get("/payments", async(req,res)=>{

    await client.connect();

    let db = client.db("sqldemo1");

    let payments = db.collection("payments");

    let resp = await payments.find({}).toArray();

    res.json(resp);

})


app.listen(7800 , ()=>console.log("Api server start"));
