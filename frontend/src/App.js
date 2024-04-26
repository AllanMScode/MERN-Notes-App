import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // State
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });

  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });

  // Use effect
  useEffect(() => {
    fetchNotes();
  }, []);

  // Functions
  const fetchNotes = async () => {
    // Fetch the notes
    const res = await axios.get("http://localhost:8080/notes");

    // Set to state
    console.log(res);
    setNotes(res.data.notes);
    console.log(res);
  };

  const updateCreateFormField = (e) => {
    const { name, value } = e.target;

    setCreateForm({
      ...createForm,
      [name]: value,
    });
    console.log({ name, value });
  };

  const createNote = async (e) => {
    e.preventDefault();

    // Create the note
    const res = await axios.post("http://localhost:8080/notes", createForm);

    // Update state
    setNotes([...notes, res.data.note]);
    // console.log(res);

    // Clear form state
    setCreateForm({ title: "", body: "" });
  };

  const deleteNote = async (_id) => {
    // Delete the note
    const res = await axios.delete(`http://localhost:8080/notes/${_id}`);
    console.log(res);

    // Update state
    const newNotes = [...notes].filter((note) => {
      return note._id !== _id;
    });

    setNotes(newNotes);
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;

    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };

  const toggleUpdate = (note) => {
    // Get the current note values
    // console.log(note);

    // Set state on update form
    setUpdateForm({ title: note.title, body: note.body, _id: note._id });
  };

  const updateNote = async (e) => {
    e.preventDefault();

    const { title, body } = updateForm;

    // Send the update request
    const res = await axios.put(
      `http://localhost:8080/notes/${updateForm._id}`,
      { title, body }
    );

    console.log(res);

    // Update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex((note) => {
      return note._id === updateForm._id;
    });

    newNotes[noteIndex] = res.data.note;

    setNotes(newNotes);

    // Clear update form state
    setUpdateForm({
      _id: null,
      title: "",
      body: "",
    });
  };

  return (
    <div className="App">
      <div>
        <h2>Notes:</h2>
        {notes &&
          notes.map((note) => {
            return (
              <div key={note._id}>
                <h3>{note.title}</h3>
                <button onClick={() => deleteNote(note._id)}>
                  Delete Note
                </button>
                <button onClick={() => toggleUpdate(note)}>Update Note</button>
                <hr />
              </div>
            );
          })}
      </div>

      <br />

      {updateForm._id && (
        <div>
          <h2>Update Note</h2>
          <form onSubmit={updateNote}>
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.title}
              name="title"
              type="text"
            />
            <br />
            <textarea
              onChange={handleUpdateFieldChange}
              value={updateForm.body}
              name="body"
              cols="30"
              rows="5"></textarea>
            <br />
            <button type="submit">Update Note</button>
          </form>
        </div>
      )}

      {!updateForm._id && (
        <div>
          <h2>Create Note</h2>

          <form onSubmit={createNote}>
            <label>Title</label>
            <br />
            <input
              onChange={updateCreateFormField}
              value={createForm.title}
              type="text"
              name="title"
            />
            <br />
            <br />
            <label>Body</label>
            <br />
            <textarea
              onChange={updateCreateFormField}
              value={createForm.body}
              name="body"
              cols="30"
              rows="5"></textarea>
            <br />
            <button type="submit">Create Note</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
