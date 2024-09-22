// get button
const button = document.querySelector("button");
button.addEventListener("click", function(){
        button.style.background = "blue"
});


const correctDiv = document.querySelector("div");
correctDiv.addEventListener("click", () => {
   correctDiv.style.background = "green"; 
});
correctDiv.addEventListener("mouseout", () => {
    correctDiv.style.background = "blue";
    correctDiv.style.border = "0px solid black";
    correctDiv.style.marginLeft = "80px"
    correctDiv.style.marginTop = "80px"
});
correctDiv.addEventListener("mouseover", () => {
        correctDiv.style.border = "5px solid black";
        correctDiv.style.marginLeft = "75px"
        correctDiv.style.marginTop = "75px"
    });



document.querySelector