const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

//MongoDb connection
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.get("/events", async (req, res) => {
      const query = {};
      const cursor = eventCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
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
