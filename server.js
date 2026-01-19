
const express = require('express');
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const path = require('path');
require("dotenv").config(); // load .env file
const app=express();
//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public')); 
const mongoUri = process.env.MONGODB_URI;
    mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

  
//express app

//for live base change mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const quizSchema = new mongoose.Schema({
  name: String, 
  profession: String,
    q1: String, 
    q2: String,
    q3: String,         
    q4: String,
    q5: String, 
    q6: String,
    q7: String,
    q8: String,
    q9: String,
    q10: String,
    score: Number,
});
//model
const Quiz = mongoose.model("Quiz", quizSchema);        
const correctAnswers = {
  q1: "3 minutes",
  q2: "Nowhere",
  q3: "Merge Sort",
  q4: "Uranus",
  q5: "21",
  q6: "Mount Everest",
  q7: "Echo",
  q8: "0",
  q9: "a secret",
  q10: "Tomorrow",
};
app.post('/start-quiz', (req, res) => {
  const name = req.body.name;
  const profession = req.body.profession;
  if(!profession || profession.trim() === "") {
    return res.status(400).send("Invalid profession. Please enter your profession.");
  }
  res.redirect(`/quiz.html?name=${encodeURIComponent(name)}&profession=${encodeURIComponent(profession)}`);
});
app.post("/submit-quiz", async (req, res) => {
  try {
    let score = 0;

    // Calculate score for all questions
    for (let key in correctAnswers) {
      if (req.body[key] && req.body[key].toLowerCase() === correctAnswers[key].toLowerCase()) {
        score++;
      }
    }

    // Save to DB
    const newQuiz = new Quiz({
      name: req.body.name,
      class: req.body.class,
      q1: req.body.q1,
      q2: req.body.q2,
      q3: req.body.q3,
      q4: req.body.q4,
      q5: req.body.q5,
      q6: req.body.q6,
      q7: req.body.q7,
      q8: req.body.q8,
      q9: req.body.q9,
      q10: req.body.q10,
      score: score,
    });

    await newQuiz.save();

    res.redirect(`/result.html?name=${encodeURIComponent(req.body.name)}&profession=${encodeURIComponent(req.body.profession)}&score=${score}`);
  } catch (err) {
    
    console.error(err);
    res.status(500).send("Error submitting quiz.");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//mongodb+srv://kratisrivastava640_db_user:<db_password>@cluster0.hzdtbtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://kratisrivastava640_db_user:<db_password>@cluster0.hzdtbtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
