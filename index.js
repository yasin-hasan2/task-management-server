const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mtnim2c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }); 



async function run(){
    try{
        const taskCollection = client.db("tasksHub").collection("tasks")
        const completeTaskCollection = client.db("tasksHub").collection("completeTasks")
        const commentsCollection = client.db("tasksHub").collection("comments")


        app.post("/tasks", async(req, res) =>{
            const tasks = req.body;
            const result = await taskCollection.insertOne(tasks);
            res.send(result);
        });

        app.post("/completeTasks", async(req, res) =>{
            const completeTask = req.body;
            const result = await completeTaskCollection.insertOne(completeTask);
            res.send(result);
        });

        app.post("/comments", async(req, res) =>{
            const comments = req.body;
            const result = await commentsCollection.insertOne(comments);
            res.send(result);
        });

        app.get("/tasks", async(req, res) =>{
            const email = req.query.email;
            const query = {email};
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        });                                 

        app.get("/completeTasks", async(req, res) =>{
            const email = req.query.email; 
            const query = {email};
            const result = await completeTaskCollection.find(query).toArray()
            res.send(result);
        });

        app.get("/tasks/:id", async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id) }
            const tasks = await taskCollection.findOne(query)
            res.send(tasks);
        });

        app.get("/comments", async(req, res) =>{
            const query = {};
            const comments = await commentsCollection.find(query).toArray();
            res.send(comments);
        })

        app.put("/updateTasks/:id", async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const task = req.body;
            const option = {upsert: true}
            const updatedTask = {
                $set:{
                   title: task.title,
                   details: task.details,
                }
            }
            const result = await taskCollection.updateOne(query, updatedTask, option)
            res.send(result);
        })

        app.delete("/tasks/:id", async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.delete("/completeTasks/:id", async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await completeTaskCollection.deleteOne(query);
            res.send(result);
        }); 


        app.delete("/deleteTask/:id", async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}; 
            const result = await completeTaskCollection.deleteMany(query);
            res.send(result);
        })

        

    }
    finally{

    }
}

run().catch(error => console.error(error))



app.get("/", async(req, res) =>{
    res.send("Tasks web server is running")
});


app.listen(port, () =>{
    console.log(`The server is running on port ${port}`)
})
 