let createNote = document.querySelector("#createNote");
let noteModal = document.querySelector("#noteModal");
let closeModal = document.querySelector("#closeModal");
let cancelNote = document.querySelector("#cancelNote");

createNote.addEventListener("click", function () {
    noteModal.classList.add("active");
});

closeModal.addEventListener("click", function () {
    noteModal.classList.remove("active");
    editingNote = null;
});

cancelNote.addEventListener("click", function () {
    noteModal.classList.remove("active");
    editingNote = null;
});


let saveNote = document.querySelector("#saveNote")
let title = document.querySelector("#noteTitle")
let content = document.querySelector("#noteContent")
let notesContainer = document.querySelector(".notes-container")
let editingNote;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function renderNotes(){
    notes.forEach(function(note){
        let article = document.createElement("article")
        article.classList.add("note-card")

        article.dataset.id = note.id

        let noteContent = document.createElement("div")
        noteContent.classList.add("note-content")
        
        let noteTitle = document.createElement("h2")
        noteTitle.classList.add("noteTitle")
        noteTitle.textContent = note.title;
        
        let noteDescription = document.createElement("p")
        noteDescription.classList.add("noteDescription")
        noteDescription.textContent = note.content;
        
        let noteDate = document.createElement("span")
        noteDate.classList.add("note-date")
        noteDate.textContent = note.data;
        
        let noteActions = document.createElement("div")
        noteActions.classList.add("note-actions")
        
        
        
        let editBtn = document.createElement("button")
        editBtn.classList.add("edit-btn")
        editBtn.textContent = "Edit";
        
        editBtn.addEventListener("click", function () {
            title.value = noteTitle.textContent;
            content.value = noteDescription.textContent;
            noteModal.classList.add("active");

            editingNote = article;
            
        });

        
        let deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-btn")
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function(){
            article.remove();
            notes = notes.filter(function(noteItem){
                return noteItem.id !== note.id;
            })

            localStorage.setItem("notes", JSON.stringify(notes))
        })

        article.appendChild(noteContent)

        noteContent.appendChild(noteTitle)
        noteContent.appendChild(noteDescription)
        noteContent.appendChild(noteDate)

        noteActions.appendChild(editBtn)
        noteActions.appendChild(deleteBtn)

        article.appendChild(noteActions)
        notesContainer.appendChild(article);


        
    

    })
}

renderNotes();
saveNote.addEventListener("click", function(){
    if (editingNote){
        editingNote.querySelector(".noteTitle").textContent = title.value;
        editingNote.querySelector(".noteDescription").textContent = content.value
        
        let noteId = Number(editingNote.dataset.id)
        let note = notes.find(function(note){
            return note.id === noteId;
        })
        
        if (note){
            note.title = title.value;
            note.content = content.value;
        }
        
        localStorage.setItem("notes", JSON.stringify(notes));
        editingNote = null;
        noteModal.classList.remove("active");
        
    }
    else{
        const today = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        let newNote = {
            id: Date.now(),
            title: title.value,
            content: content.value,
            date: formattedDate
        };

        let article = document.createElement("article")
        article.classList.add("note-card")

        let noteContent = document.createElement("div")
        noteContent.classList.add("note-content")
        
        let noteTitle = document.createElement("h2")
        noteTitle.classList.add("noteTitle")
        noteTitle.textContent = title.value;
        
        let noteDescription = document.createElement("p")
        noteDescription.classList.add("noteDescription")
        noteDescription.textContent = content.value;
        
        let noteDate = document.createElement("span")
        noteDate.classList.add("note-date")
        noteDate.textContent = formattedDate;
        
        let noteActions = document.createElement("div")
        noteActions.classList.add("note-actions")
        
        
        
        let editBtn = document.createElement("button")
        editBtn.classList.add("edit-btn")
        editBtn.textContent = "Edit";
        
        editBtn.addEventListener("click", function () {
            title.value = noteTitle.textContent;
            content.value = noteDescription.textContent;
            noteModal.classList.add("active");

            editingNote = article;
            
            
        });

        
        let deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-btn")
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function(){
            article.remove()
            notes = notes.filter(function(noteItem){
                return noteItem.id !== newNote.id
                localStorage.setItem("notes", JSON.stringify(notes));
            })
        })

        article.appendChild(noteContent)

        noteContent.appendChild(noteTitle)
        noteContent.appendChild(noteDescription)
        noteContent.appendChild(noteDate)

        noteActions.appendChild(editBtn)
        noteActions.appendChild(deleteBtn)

        article.appendChild(noteActions)
        notesContainer.appendChild(article);

        noteModal.classList.remove("active");


        title.value = "";
        content.value = "";

        editingNote = null;
        
        notes.push(newNote)
        localStorage.setItem("notes", JSON.stringify(notes))

    }
})



