const express = require("express");
const { connection, collectionName } = require("./db/config");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// ======= Add Task API =========

app.post("/add-task",async(req,resp)=>{
       const db = await connection();
       const collection = db.collection(collectionName);
       const result = await collection.insertOne(req.body);
       if(result){
        resp.send({message:'New Task Added Sucessfully',success:true,result})
       }else{
        resp.send({message:'NoTask Added',success:false})
       }
})

// Example API
app.get("/api/user", (req, res) => {
  res.json({
    name: "Pankaj",
    role: "Developer",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
