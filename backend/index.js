const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { connection, collectionName } = require("./db/config");

const app = express();
const PORT = 5000;

// ================= Middleware =================
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// ================= Test Route =================
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// ================= Register API =================
app.post("/register", async (req, res) => {
  const userData = req.body;

  if (!userData.email || !userData.password) {
    return res.send({ success: false, msg: "Invalid data" });
  }

  const db = await connection();
  const collection = db.collection("register");

  const result = await collection.insertOne(userData);

  jwt.sign(userData, "Google", { expiresIn: "5d" }, (err, token) => {
    res.cookie("token", token, { httpOnly: true });
    res.send({
      success: true,
      msg: "Register done",
      token,
    });
  });
});

// ================= Login API =================
app.post("/login", async (req, res) => {
  const userData = req.body;

  const db = await connection();
  const collection = db.collection("register");

  const result = await collection.findOne({
    email: userData.email,
    password: userData.password,
  });

  if (!result) {
    return res.send({ success: false, msg: "User not found" });
  }

  jwt.sign(userData, "Google", { expiresIn: "5d" }, (err, token) => {
    res.cookie("token", token, { httpOnly: true });
    res.send({
      success: true,
      msg: "Login done",
      token,
    });
  });
});

// ================= JWT Middleware =================
function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({
      success: false,
      msg: "Token missing",
    });
  }

  jwt.verify(token, "Google", (error, decoded) => {
    if (error) {
      return res.status(403).send({
        success: false,
        msg: "Invalid token",
      });
    }

    req.user = decoded; // future use
    next();
  });
}

// ================= Add Task =================
app.post("/add-task", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.insertOne(req.body);

  res.send({
    success: true,
    message: "New Task Added Successfully",
    result,
  });
});

// ================= Get Tasks =================
app.get("/tasks", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.find().toArray();

  res.send({
    success: true,
    message: "Task List Fetch Successfully",
    result,
  });
});

// ================= Delete One Task =================
app.delete("/task/:id", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.send({
    success: result.deletedCount > 0,
    message:
      result.deletedCount > 0 ? "Task deleted" : "Task not found",
  });
});

// ================= Delete All Tasks =================
app.delete("/tasks", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.deleteMany({});

  res.send({
    success: true,
    message: `${result.deletedCount} task(s) deleted`,
  });
});

// ================= Complete Task =================
app.patch("/task/:id/complete", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { completed: true } }
  );

  res.send({
    success: result.modifiedCount === 1,
    message: "Task marked as completed",
  });
});

// ================= Update Task =================
app.patch("/task/:id", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const { title, description } = req.body;

  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { title, description } }
  );

  res.send({
    success: result.modifiedCount === 1,
    message: "Task updated successfully",
  });
});




// =========== Profile API =======

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection("register");

    const user = await collection.findOne(
      { email: req.user.email },
      { projection: { password: 0 } } // password hide
    );

    res.send({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
});


//===== Update Profile =========

app.patch("/profile", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection("register");

  const { email, password } = req.body;

  await collection.updateOne(
    { email: req.user.email },
    { $set: { email, password } }
  );

  res.send({ success: true, message: "Profile updated" });
});



// ================= Start Server =================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
