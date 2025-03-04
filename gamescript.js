let game_array = [
    0,0,0,
    0,0,0,
    0,0,0
];
/* 0 - empty, 1 - X, 2 - O */
let player_turn = 0;
/* -1 - game ends, 0 - player, 1 - Computer */
let starting_player = "player";
let game_end_message = document.getElementById("game_end_message");
let game_end_menu = document.getElementById("game_end_menu");
game_end_menu.style.display = "none";
game_end_message.style.display = "none";

document.querySelectorAll(".space").forEach(space => {
    space.addEventListener("click", function () {
        console.log("Clicked space ID:", this.id); // Prints the ID of the clicked cell
        if (this.innerHTML === "" && player_turn == 0) { // Check if cell is empty
            player_turn = 1; // change player turn
            game_array[Number(this.id)] = 1; // updates game_array
            let img = document.createElement("img"); // creates the img element
            console.log("updated array of index " + this.id + " to 1")
            if (starting_player == "player"){
                img.src = "./images/X.png"; // Replace with actual image URLs
            }else{
                img.src = "./images/O.png";
            }
            img.style.width = "100%";
            img.style.aspectRatio = "1/1";
            this.appendChild(img);
            checkWinCondition(game_array);
            checkTurn();
        }
    });
});

function checkWinCondition(array){
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition; // each iteration creates its own scope
        console.log("Checking win condition...");
        if (array[a] == 1 && array[a] === array[b] && array[a] === array[c]) {
            game_end_message.innerHTML = "You win!";
            game_end_menu.style.display = "block";
            game_end_message.style.display = "block";
            player_turn = -1;
            return true;  // Winning condition met
        }
        if (array[a] == 2 && array[a] === array[b] && array[a] === array[c]) {
            game_end_message.innerHTML = "You lose!";
            game_end_menu.style.display = "block";
            game_end_message.style.display = "block";
            player_turn = -1;
            return true;  // Winning condition met
        }
    }
    let isDraw = false;
    for (let space of array){ //after checking wins, check if theres possible moves left
        if (space == 0){
            return false; // if so return out
        }
    }
    // if no spaces left, its a draw
    game_end_message.innerHTML = "It's a draw!";
    game_end_menu.style.display = "block";
    game_end_message.style.display = "block";
    player_turn = -1;
    return true;
}

function checkTurn() {
    if (player_turn === 1) {
        computerChoose();
        player_turn = 0;
        checkWinCondition(game_array);
    }
}

function computerChoose(){
    let randomNum = Math.floor(Math.random() * 9); // Generates a random integer between 0 and 8
    console.log(randomNum);

    while (game_array[randomNum] != 0){ // if spot taken, increment 1
        if (randomNum == 8){
            randomNum = 0;
        }else{randomNum += 1;}
    } // puts image and updates array

    game_array[randomNum] = 2; // updates game_array
    let img = document.createElement("img"); // creates the img element
    console.log("updated array of index " + randomNum + " to 2");

    if (starting_player == "player"){
        img.src = "./images/O.png"; // Replace with actual image URLs
    } else {
        img.src = "./images/X.png";
    }

    document.querySelectorAll(".space").forEach(space => {
        if (space.id == String(randomNum)){
            img.style.width = "100%";
            img.style.aspectRatio = "1/1";
            space.appendChild(img);
        }
    });
}
