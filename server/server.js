// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import dependencies
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");
const Note = require("./models/note");

// Create an express app
const app = express();

// Configure express app
app.use(express.json());
app.use(cors());

// Connect to database
connectToDb();

// Routing
app.get("/", (req, res) => {
  res.json({ hello: "worldj" });
});

// API to display all the notes
app.get("/notes", async (req, res) => {
  // Find the notes
  const notes = await Note.find();

  // Respond with them
  res.json({ notes: notes });
});

// API to fetch a single note using the id
app.get("/notes/:id", async (req, res) => {
  // Get the id off the url
  const noteId = req.params.id;

  // Find the note using that id
  const note = await Note.findById(noteId);

  // Respond with the note
  res.json({ note: note });
});

// API to create a note
app.post("/notes", async (req, res) => {
  // Get the sent in data off request body
  const title = req.body.title;
  const body = req.body.body;

  // Create a note with it
  const note = await Note.create({
    title: title,
    body: body,
  });

  // respond with the new note
  res.json({ note: note });
});

// API to update a note using id
app.put("/notes/:id", async (req, res) => {
  // Get the id off the url
  const noteId = req.params.id;

  // Get the data off the request body
  const title = req.body.title;
  const body = req.body.body;

  // Find and update the record
  await Note.findByIdAndUpdate(noteId, {
    title: title,
    body: body,
  });

  //   Find updated note
  const note = await Note.findById(noteId);

  // Respond with it
  res.json({ note: note });
});

// API to delete a note using id
app.delete("/notes/:id", async (req, res) => {
  // get id off url
  const noteId = req.params.id;

  // Delete the record
  await Note.deleteOne({ _id: noteId });

  // Respond
  res.json({ success: "Record deleted" });
});

// Start our server
app.listen(process.env.PORT);
