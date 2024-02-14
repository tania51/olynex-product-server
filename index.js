const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const port = process.env.PORT || 5001;

// parser
const corsOption = {
  origin: ['http://localhost:5173'],
  credentials: true
}

app.use(cors(corsOption))
app.use(express.json())


const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db('olynexProduct').collection('user')
    const productCollection = client.db('olynexProduct').collection('all-product')
    const reviewCollection = client.db('olynexProduct').collection('review-task')

    // user api
    app.post('/user', async (req, res) => {
      const query = req.body;
      const result = await userCollection.insertOne(query);
      res.send(result)
    })

    // get all user
    app.get('/all-user', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    // add task
    app.post('/add-product', async (req, res) => {
      const query = req.body;
      const result = await productCollection.insertOne(query);
      res.send(result)
    })

    // get all task
    app.get('/all-task', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result)
    })

    // get review task
    app.get('/all-review-task', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result)
    })

    // review task from employee to boss
    app.post('/review-task', async (req, res) => {
      const query = req.body;
      const result = await reviewCollection.insertOne(query);
      res.send(result)
    })


    // extend day from employee to distributor patch
    app.patch('/extend-day-task/:id', async (req, res) => {
      const { extendDay, extededByDistributor, newRemainingDays } = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }

      const updateDoc = {
        $set: {
          extendDay: extendDay,
          extededByDistributor: extededByDistributor,
          newRemainingDays: newRemainingDays
        }
      }

      const result = await productCollection.updateOne(filter, updateDoc)
      res.send(result)
    })


    // revision added using from boss dashboard patch
    app.patch('/review-task/:id', async (req, res) => {
      const { reviewToBoss, revisionNoteFromBoss, acceptByBoss, sendToMockupFromBoss, acceptByBossMockUpTask, sendToBossFromSEO, sendToSEOFromBoss, readyToUpload } = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }

      const updateDoc = {
        $set: {
          reviewToBoss: reviewToBoss,
          revisionNoteFromBoss: revisionNoteFromBoss,
          acceptByBoss: acceptByBoss,
          sendToMockupFromBoss: sendToMockupFromBoss,
          acceptByBossMockUpTask: acceptByBossMockUpTask,
          sendToBossFromSEO: sendToBossFromSEO,
          sendToSEOFromBoss: sendToSEOFromBoss,
          readyToUpload: readyToUpload
        }
      }

      const result = await reviewCollection.updateOne(filter, updateDoc)
      res.send(result)
    })




    // revision added using patch
    app.patch('/review-task-from-distributor/:id', async (req, res) => {
      const { reviewToEmployee } = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }

      const updateDoc = {
        $set: {
          reviewToEmployee: reviewToEmployee
        }
      }

      const result = await productCollection.updateOne(filter, updateDoc)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Welcome To Olynex Server')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})