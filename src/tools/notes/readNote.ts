//Create a function to get date
export const readNote = async () => {
    const fs = require('fs');
    let notes = [];
    if(fs.existsSync('note.json')) {
        notes = JSON.parse(fs.readFileSync('note.json', 'utf8'));
    }
    //return as string
    return JSON.stringify(notes);
}

export const readNoteDescription = {
  type: "function", function: {
      name: "read_note",
      description: "Read a note from a file. this can be an idea, a reminder, or something. ",
  },
}
