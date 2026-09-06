let form = document.querySelector("form")
let image = document.querySelector("#image")
let userName = document.querySelector("#name")
let occupation = document.querySelector("#occupation")
let description = document.querySelector("#description")
let cardContainer = document.querySelector(".card-container")
const userManager = {
    users: [],
    init: function(){
        form.addEventListener("submit", this.submitForm.bind(this))
    },
    submitForm: function(e){
        e.preventDefault();
        this.addUser();
    },
    addUser: function(){
        this.users.push({
            image: image.value,
            username: userName.value,
            occupation: occupation.value,
            description: description.value
        })

        form.reset();
        this.renderUi();
    },
    renderUi: function(){
        cardContainer.innerHTML = "";
        this.users.forEach((user, index)=>{
            let card = document.createElement("div");
            card.className = "user-card"

            let img = document.createElement("img")
            img.id = "cardImage"
            img.setAttribute("src", `${user.image}`)
            let h2 = document.createElement("h2")
            h2.id = "cardName"
            h2.textContent = user.username;
            let h4 = document.createElement("h4")
            h4.id = "cardOccupation"
            h4.textContent = user.occupation;
            let p = document.createElement("p")
            p.id = "cardDescription"
            p.textContent = user.description;

            let deleteBtn = document.createElement("button")
            deleteBtn.textContent = "Remove";
            deleteBtn.addEventListener("click", () =>{
                this.removeUser(index);
        })
        
        
        cardContainer.appendChild(card)
        card.appendChild(img)
        card.appendChild(h2)
        card.appendChild(h4)
        card.appendChild(p)
        card.appendChild(deleteBtn)
        })
    },
    removeUser: function(index){
        this.users.splice(index, 1)
    }
};

userManager.init()

