const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

//MongoDb connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xpqzom0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbConnect = async () => {
  try {
    const eventCollection = client.db("volunteer-club").collection("events");
    const projectCollection = client.db("volunteer-club").collection("projects");
    const volunteerCollection = client.db("volunteer-club").collection("volunteers");
    const Subscriptions = client.db("volunteer-club").collection("subscriptions");

    app.get("/events", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const cursor = eventCollection.find({});
      const count = await eventCollection.estimatedDocumentCount({});
      const events = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send({ count, events });
    });

    app.get("/projects", async (req, res) => {
      const cursor = projectCollection.find({});
      const projects = await cursor.toArray();
      res.send(projects);
    });

    app.get("/volunteers", async (req, res) => {
      const cursor = volunteerCollection.find({});
      const volunteers = await cursor.toArray();
      res.send(volunteers);
    });

    app.get("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const event = await eventCollection.findOne(query);
      res.send(event);
    });

    app.delete("/subscribe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Subscriptions.deleteOne(query);
      res.send(result);
    });

    app.post("/subscribe", async (req, res) => {
      const event = req.body;
      const result = await Subscriptions.insertOne(event);
      res.send(result);
    });

    app.get("/subscribe", async (req, res) => {
      let query = {};

      if (req.params.email) {
        query = {
          email: req.params.email,
        };
      }
      const cursor = Subscriptions.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
};
dbConnect().catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.send("Volunteer club server is running");
});

app.listen(port, () => {
  console.log(`Server is listening on port:${port}`);
});
