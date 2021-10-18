const url = 'http://localhost:3000/notes'
const form = document.querySelector('#note-form')
const noteList = document.getElementById('note-list')
document.getElementById('root').style.marginLeft = '20px'
document.getElementById('note-text').style.width = '500px'



// Adds event listener to submit button, which will create a note from the
// text field and then reset the form
form.addEventListener('submit', (event) => {
    event.preventDefault()
    const noteText = document.getElementById('note-text').value;
    console.log(noteText)
    createNote(noteText)
    form.reset();
})

// Takes note text as argument, contacts server URL, POSTs it to the JSON
function createNote(noteText) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            created_at: moment().format()
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            renderNoteCard(data)
        })
}

// Creates list items with id's that match the argument note, appends them to
// ul 'note-list' at bottom of the page
function renderNoteCard(note) {
    const li = document.createElement('li')
    // Gives list item an id that matches the note object's id
    li.id = note.id
    li.classList.add(
        // tachon classes for style
        'mw5', 'mw6-ns', 'br3', 'hidden', 'ba', 'b--black-10', 'mv4'
    )
    renderNoteText(li, note)
    noteList.appendChild(li)
}

// Changes the text of the list item to match the body of the note
function renderNoteText(li, note) {
    li.innerHTML = `
    <div>${note.body}</div>
    <br>
    <div class='f7'>Posted at: ${moment(note.created_at).format('LT, MMM DD, YYYY')}</div>
    `
    if (note.hasOwnProperty('updated_at')) {
        li.innerHTML = li.innerHTML + `<div class='f7'>Updated at: ${moment(note.updated_at).format('LT, MMM DD, YYYY')}</div>`
    }
    li.innerHTML = li.innerHTML + `<br><i class="delete-button fas fa-trash-alt" ></i > <i class="edit-button fas fa-edit"></i>`
}


// Fetches data, i.e., notes from JSON, and for each one, renders it
function listNotes() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            for (let note of data) {
                renderNoteCard(note)
            }
        })
}

// Deletes item from JSON and removes the element from the DOM
function deleteNote(note) {
    console.log(url + '/' + `${note.parentElement.id} `)
    fetch(url + '/' + `${note.parentElement.id} `, {
        method: 'DELETE'
    })
        .then(() => note.parentElement.remove())
}

// Edits the body and title of the note with new text and adds the "updated_at" property
function editNote(note) {
    const noteText = document.getElementById('note-text').value
    fetch(url + '/' + `${note.parentElement.id} `, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            created_at: note.created_at,
            updated_at: moment().format()
        })
    })
        .then(response => response.json())
        .then(data => {
            renderNoteText(note.parentElement, data)
        })

}

// Adds event listeners to trash and edit icons to perform delete and edit note functions when clicked
// Edit button only works if the note field has text in it
noteList.addEventListener('click', (event) => {
    const noteText = document.getElementById('note-text').value;
    if (event.target.classList.contains('delete-button')) {
        deleteNote(event.target);
    }
    if (event.target.classList.contains('edit-button') && noteText != '') {
        editNote(event.target);
    }
})

// Puts the ul list items on the bottom of the page
listNotes();