require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
    res.send("server is running!")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b2jcn5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("✅ You successfully connected to MongoDB!");

    const productCollection = client.db('productsDB').collection('products')

    app.get('/products', async (req, res)=>{
        const result = await productCollection.find().toArray()
        res.send(result)
    })

    app.get('/products/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}

      const result = await productCollection.findOne(query)
      res.send(result)
    })

    app.get('/highlights', async(req, res)=>{
      const result = await productCollection.find().limit(4).toArray();
      res.send(result)
    })

    app.post('/add-product', async(req, res)=>{
        const data = req.body;
         const result = await productCollection.insertOne(data);
         res.status(201).send(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})

