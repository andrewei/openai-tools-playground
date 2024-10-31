//Create a function to get date
export const writeNote = async ({note}: {note: string}) => {
    const fs = require('fs');
    const date = new Date();
    const noteObj = {
        note,
        date
    }
    let notes = [];
    if(fs.existsSync('note.json')) {
        notes = JSON.parse(fs.readFileSync('note.json', 'utf8'));
    }
    notes.push(noteObj);
    fs.writeFileSync('note.json', JSON.stringify(notes));

    return "Note written successfully";

}

export const writeNoteDescription = {
  type: "function", function: {
      name: "write_note",
    description: "Write a note to a file. this can be an idea, a reminder, or something. ",
    parameters: {
      type: "object", properties: {
        note: {
          type: "string",
          description: "The note to write"
        },
      },
      required: ["note"],
      additionalProperties: false,
    },
  },
}
