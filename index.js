const express = require("express");
const { MongoClient } = require('mongodb');
const app = express();
const cors = require("cors")
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcshw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("shop_zone");
      const productsCollection = database.collection("products");
      const usersCollection = database.collection("users");


      // Get products from mongodb 

      app.get('/products', async (req, res)=>{
          const cursor = productsCollection.find({});
          const products = await cursor.toArray();
          res.json(products)
      })

      // Get a single product from mongodb 
      app.get('/products/:id', async (req, res)=>{
        const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.json(product);
      })

      // Post product from client site to mongodb 
      app.post('/products', async (req, res)=>{
          const product = req.body
          const result = await productsCollection.insertOne(product);
          res.json(result)
      })

      // Get user from mongodb 
      app.get('/users', async (req, res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.json(users)
    })

      // Keep user to mongodb 
      app.post('/users', async (req, res)=>{
          const user = req.body
          const result = await usersCollection.insertOne(user);
          res.json(result)
      })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('shop sdfsdf')
});
app.listen(port, ()=>{
    console.log("listing the port", port)
})