// Importing the required packages 

import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";

// Creating an instrance of express 
const app = express();
app.use(express.json());
app.use(cors());

// configuring the .env file 
dotenv.config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_URL;

// connecting to the mongodb database 
const createConnection = async () => {
    try {
        const client = new MongoClient(MONGO_URL);

        await client.connect();
        console.log("Connection to the mongodb database established successfully");
        app.listen(PORT, () => {
            console.log("Server is live")
        })
        return client
    } catch (error) {
        console.log(error);
    }
}
const client = await createConnection();

// default route for the api 
app.get("/", (req, res) => {
    res.status(200).send("<h1>Server is Live</h1>");
});

// endpoint for createing the students 
app.post("/create_student", async (req, res) => {
    const data = req.body;

    const result = await client
        .db("mentor-student")
        .collection("students")
        .insertOne(data)

    result.acknowledged
        ? res.send({ msg: "Student Created" })
        : res.send({ msg: "Something went wrong while creating Student. Please try again" });
});

// endpoint for getting all the students list 
app.get("/students", async (req, res) => {
    const result = await client
        .db("mentor-student")
        .collection("students")
        .find({})
        .toArray()

    res.send(result);
})

// endpoint for getting the list of unassigned students 
app.get("/unassigned_students", async (req, res) => {
    const result = await client
        .db("mentor-student")
        .collection("students")
        .find({ "mentor_assigned": false })
        .toArray()

    res.send(result);
})
// endpoint for getting teh list of assigned students 
app.get("/assigned_students", async (req, res) => {
    const result = await client
        .db("mentor-student")
        .collection("students")
        .find({ "mentor_assigned": true })
        .toArray()

    res.send(result);
})
// endpoint for creating the mentors 
app.post("/create_mentor", async (req, res) => {
    const data = req.body;

    const result = await client
        .db("mentor-student")
        .collection("mentors")
        .insertOne(data);

    result.acknowledged
        ? res.send({ msg: "Mentor Created" })
        : res.send({ msg: "Something went wrong while creating Mentor. Please try again" })

});

// endpoint for getting mentors list 

app.get("/mentors", async (req, res) => {
    const result = await client
        .db("mentor-student")
        .collection("mentors")
        .find({})
        .toArray()

    res.send(result);

})



