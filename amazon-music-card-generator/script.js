let generatorBtn = document.querySelector(".generator-btn");
let popupOverlay = document.querySelector(".popup-overlay");

generatorBtn.addEventListener("click", function () {
    popupOverlay.style.visibility = "visible";
    popupOverlay.style.display = "flex";
});


let closeBtn = document.querySelector(".close-btn");


let songName = document.querySelector("#song");
let songArtist = document.querySelector("#artist");
let songImage = document.querySelector("#image");
let songLyric = document.querySelector("#lyrics");
let musicForm = document.querySelector("#music-form")




closeBtn.addEventListener("click", function () {
    popupOverlay.style.display = "none";
});

let lyrics = document.querySelector(".lyrics p");
let songDetails = document.querySelector(".song-details");
let songInfo = document.querySelector(".song-info");

let img = document.querySelector(".album-art");
let title = document.querySelector(".song-title");
let artist = document.querySelector(".artist");
let input = document.querySelectorAll("input")
let measurer = document.querySelector(".lyrics-measurer");

let downloadBtn = document.querySelector(".download-btn");
let musicCard = document.querySelector(".music-card");
downloadBtn.addEventListener("click", async function(){
    await document.fonts.ready;
    html2canvas(musicCard).then(function(canvas){
        let image = canvas.toDataURL("image/png");

        let link = document.createElement("a");

        link.download = "music-card.png";
        link.href = image;

        link.click();
    })
})
musicForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let imageFile = songImage.files[0]
    if(imageFile){
        img.src = URL.createObjectURL(imageFile)
    }
    title.textContent = songName.value;
    artist.textContent = songArtist.value;

    input.forEach(function(element){
        element.value = "";
    })
    popupOverlay.style.display = "none"

     let words = songLyric.value.trim().split(/\s+/);

    if (songLyric.value.trim() === "") {
        lyrics.textContent = "";
        return;
    }

    let lines = [];
    let currentLine = "";

    let maxWidth = document.querySelector(".lyrics").clientWidth;

    words.forEach(function (word) {

        let testLine = currentLine
            ? currentLine + " " + word
            : word;

        measurer.textContent = testLine;

        if (measurer.offsetWidth <= maxWidth) {

            currentLine = testLine;

        } else {    

            lines.push(currentLine);
            currentLine = word;

        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }


    let output = "";

    lines.forEach(function (line, index) {

        output += line;

        if ((index + 1) % 2 === 0 && index !== lines.length - 1) {
            output += "<br><br>";
        } else if (index !== lines.length - 1) {
            output += "<br>";
        }

    });

    lyrics.innerHTML = output;


});

