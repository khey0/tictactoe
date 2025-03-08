let game_end_message = document.getElementById("game_end_message");
let game_end_menu = document.getElementById("game_end_menu");
let start_menu = document.getElementById("start_menu");
let game = document.getElementById("game")
let difficulty_menu = document.getElementById("difficulty_menu")
let current_difficulty = null;
// Event Listners
document.getElementById("easy_button").addEventListener("click", function() {
    gameStart("easy");
});
document.getElementById("impossible_button").addEventListener("click", function() {
    gameStart("impossible");
});
document.getElementById("play_again_button").addEventListener("click", function() {
    gameStart(current_difficulty);
});
//
function gameStart(difficulty){
    current_difficulty = difficulty;
    let game_array = [
        0,0,0,
        0,0,0,
        0,0,0
    ];
    /* 0 - empty, 1 - player, 2 - computer */
    let player_turn = 0; // this player starts first //
    /* -1 - game ends, 0 - player, 1 - Computer */
    let starting_player = "player";
    game_end_menu.style.display = "none";
    game_end_message.style.display = "none";
    start_menu.style.display = "none";  
    game.style.display = "grid";
    difficulty_menu.style.display = "none";

    clearGrid();

    document.querySelectorAll(".space").forEach(space => {
        space.addEventListener("click", function () {
            //console.log("Clicked space ID:", this.id); // Prints the ID of the clicked cell
            if (this.innerHTML === "" && player_turn == 0) { // Check if cell is empty
                player_turn = 1; // change player turn
                game_array[Number(this.id)] = 1; // updates game_array
                let img = document.createElement("img"); // creates the img element
                //console.log("updated array of index " + this.id + " to 1")
                if (starting_player == "player"){
                    img.src = "./images/X.png"; // Replace with actual image URLs
                }else{
                    img.src = "./images/O.png";
                }
                img.style.width = "100%";
                img.style.aspectRatio = "1/1";
                this.appendChild(img);
                checkWinCondition(game_array);
                computerChoose(difficulty);
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
            //console.log("Checking win condition...");
            if (array[a] == 1 && array[a] === array[b] && array[a] === array[c]) {
                game_end_message.innerHTML = "You win!";
                game_end_menu.style.display = "flex";
                game_end_message.style.display = "block";
                player_turn = -1;
                return true;  // Winning condition met
            }
            if (array[a] == 2 && array[a] === array[b] && array[a] === array[c]) {
                game_end_message.innerHTML = "You lose!";
                game_end_menu.style.display = "flex";
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
        game_end_menu.style.display = "flex";
        game_end_message.style.display = "block";
        player_turn = -1;
        return true;
    }
    
    
    function computerChoose(difficulty){
        let img = document.createElement("img"); // creates the img element
        if (player_turn === 1){
            switch(difficulty){
                case "easy":
                    let randomNum = Math.floor(Math.random() * 9); // Generates a random integer between 0 and 8
                    //console.log(randomNum);
                
                    while (game_array[randomNum] != 0){ // if spot taken, increment 1
                        if (randomNum == 8){
                            randomNum = 0;
                        }else{randomNum += 1;}
                    }
                
                    game_array[randomNum] = 2; // updates game_array
                    //console.log("updated array of index " + randomNum + " to 2");
                
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
                    break;
                case "impossible":
                    let moves = new Array(9).fill(-Infinity); // worse case evaluation of the move
                    let move_arrays = new Array(9).fill(0);
                    outer_loop:
                    for (let i = 0; i < 9; i++) { // scan through each possible computer move at index i
                        copy = game_array.slice();
                        if (copy[i] == 0){ // if move is possible, create array with that move implemented
                            copy[i] = 2;
                            console.log("looking at move ", i, " array: ", copy);
                            for (let j = 0; j < move_arrays.length; j++) { // check if that move has already been evaluated before
                                if (move_arrays[i] != 0){break;}
                                for (let k = 0; k < 4; k++){
                                    if (Array.isArray(move_arrays[j]) && copy.every((val, index) => val === move_arrays[j][index])){
                                        moves[i] = moves[j]; // copy the evaluation
                                        console.log("similar move at index ",j," outcome of moves is", moves);
                                        continue outer_loop; // already evaluated, head to next move
                                    } else { // rotate the array
                                        console.log("rotating array");
                                        copy = rotateArray(copy);
                                    }
                                }
                                // evaluate the array after checking all rotations
                                move_arrays[i] = copy.slice();
                                let old_eval = -Infinity;
                                for (let l = 0; l <9; l++){ // checks possible player moves at index l
                                    if (copy[l] == 0){
                                        copy[l] = 1;
                                        console.log("evaluating the array: ", copy);
                                        let eval = evaluateBoardState2(copy); 
                                        console.log("eval for move ", l, " is ", eval);
                                        if (old_eval == -Infinity){old_eval = eval;}
                                        else if (eval < old_eval){old_eval = eval;}
                                        copy[l] = 0;
                                    }
                                }
                                moves[i] = old_eval; // finally input the evaluation for move at index i
                                console.log("evaluation complete, outcome of moves[] is: ", moves);
                            }
                        } else {
                            console.log("move invalid")
                            continue;
                        } // if move not possible, head to next move
                    }

                    let maxValue = moves.reduce((maxVal, currentVal, currentIdx, array) => {
                        return currentVal > maxVal ? currentVal : maxVal; // changes maxIdx for next iteration
                      }, -Infinity);
                    
                    possibleIndexes = [];
                    moves.forEach((currentVal, currentIdx) => {
                        if (currentVal === maxValue) {
                          possibleIndexes.push(currentIdx);
                        }
                    });
                    console.log("possible moves are", possibleIndexes);

                    let randomInd = Math.floor(Math.random() * possibleIndexes.length); // Generates a random index position
                    game_array[possibleIndexes[randomInd]] = 2; // updates game_array
                    console.log("choosing " + possibleIndexes[randomInd]);
                
                    if (starting_player == "player"){
                        img.src = "./images/O.png"; // Replace with actual image URLs
                    } else {
                        img.src = "./images/X.png";
                    }
                
                    document.querySelectorAll(".space").forEach(space => {
                        if (space.id == String(possibleIndexes[randomInd])){
                            img.style.width = "100%";
                            img.style.aspectRatio = "1/1";
                            space.appendChild(img);
                        }
                    }); 
                default:
            }
            
            player_turn = 0;
            checkWinCondition(game_array);
        }
    }

    function evaluateBoardState2(array){ // returns a number that shows how favourable the state is for computer
        let P1 = 0, P2 = 0, P3 = 0, C1 = 0, C2 = 0, C3 = 0;
        let ones = 0, twos = 0;

        for (let i = 0; i<3; i++){ // checking first row
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }// then update
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}

        ones = 0; twos = 0;
        for (let i = 3; i<6; i++){ // checking second row
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}

        ones = 0; twos = 0;
        for (let i = 6; i<9; i++){ // checking third row
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}

        ones = 0; twos = 0;
        for (let i = 0; i<9; i+=3){ // checking first column
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}

        ones = 0; twos = 0;
        for (let i = 1; i<9; i+=3){ // checking second column
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}

        ones = 0; twos = 0;
        for (let i = 2; i<9; i+=3){ // checking third column
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}

        ones = 0; twos = 0;
        for (let i = 0; i<9; i+=4){ // checking diagonal row
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}

        ones = 0; twos = 0;
        for (let i = 2; i<8; i+=2){ // checking diagonal row
            if (array[i] == 1){ones += 1;}
            if (array[i] == 2){twos += 1;}
        }
        if (ones == 1 && twos == 0){P1 += 1;}
        if (ones == 2 && twos == 0){P2 += 1;}
        if (ones == 3 && twos == 0){P3 += 1;}
        if (ones == 0 && twos == 1){C1 += 1;}
        if (ones == 0 && twos == 2){C2 += 1;}
        if (ones == 0 && twos == 3){C3 += 1;}
        console.log("P1,P2,P3,C1,C2,C3: ",P1,P2,P3,C1,C2,C3)
        return (3*C2+C1+10*C3 - 3*P2-P1-10*P3);
    }

    function rotateArray(array){ // rotates a 3x3 array clockwise once
        temp = array[0]
        array[0] = array[6];
        array[6] = array[8];
        array[8] = array[2];
        array[2] = temp;
        temp = array[1];
        array[1] = array[3];
        array[3] = array[7];
        array[7] = array[5];
        array[5] = temp;
        return array;
    }
    function clearGrid(){
        document.querySelectorAll(".space").forEach(space => {
            space.innerHTML = "";
        });
    }
    
}

function returnToStartMenu(){
    game_end_menu.style.display = "none";
    game_end_message.style.display = "none";
    game.style.display = "none";
    difficulty_menu.style.display = "none";
    start_menu.style.display = "block";
}

function chooseDifficulty(){ //shows difficulty menu
    game_end_menu.style.display = "none";
    game_end_message.style.display = "none";
    game.style.display = "none";
    start_menu.style.display = "none";
    difficulty_menu.style.display = "flex";
}