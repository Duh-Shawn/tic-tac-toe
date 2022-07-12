/*
* De'Shawn Maynard
* Tic Tac Toe JS project for practicing OOP using factory functions and the module pattern
* June / July 2022
*/


//factory function to create player objects
const player = (name, marker) => {
    const assignedMarker = marker;
    const placeMarker = (row, col) => {
        gameBoard.markBox(row, col, assignedMarker);
    };

    const getName = () => name;
    const getMarker = () => assignedMarker;

    return { placeMarker, getName, getMarker };
};

//game board object using module pattern
const gameBoard = (() => {
    
    let boardArray = [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"] 
    ];

    const isFull = () =>{
        let arrayIsFull = true;
        //convert our 2d game board into a string seperated by commas
        const boardArrayString = boardArray.toString();
        //convert the string seperated by commas into a 1d array for looping  
        //and assigning to value to box position on the display
        const stringArray = boardArrayString.split(',');
        for (let i = 0; i < stringArray.length; i++){
            if (stringArray[i] === "-"){
                arrayIsFull = false;
            }  
        }
        return arrayIsFull;     
    };
    const getBoardArray = () => boardArray;
    const markBox = (row, col, marker) => boardArray[row][col] = marker;
    const displayOnScreen = () => {
        //convert our 2d game board into a string seperated by commas
        const boardArrayString = boardArray.toString();
        //convert the string seperated by commas into a 1d array for looping  
        //and assigning to value to box position on the display
        const stringArray = boardArrayString.split(',');
        let boxList = document.querySelectorAll('.board-box');
        for (let i = 0; i < stringArray.length; i++){
            boxList[i].textContent = stringArray[i];
        }      
    };
    const resetArray = () => {
        boardArray = [
            ["-", "-", "-"],
            ["-", "-", "-"],
            ["-", "-", "-"]
        ];
    };

    return { markBox, displayOnScreen, getBoardArray, resetArray, isFull};
})();

//game controller to handle flow of game using module pattern
const gameController = (() => {

    let playerOne;
    const opponent = player ("Opponent", "O");
    let playerTurn = 1;

    
    //
    //
    //event listeners
    //
    //
    const startButton = document.querySelector(".welcome-pop-up button");
    startButton.addEventListener('click', () => {
        let playerName = document.querySelector(".welcome-pop-up input").value;
        if (playerName === ""){
            playerName = "Guest";
        }
        playerOne = player (playerName, "X");
        showGame();
        gameBoard.displayOnScreen(); //display starting board
        hideWelcomePopUp();
    });

    const playAgainButton = document.querySelector(".victory-pop-up button");
    playAgainButton.addEventListener('click', () => {
        gameBoard.resetArray();
        hideVictoryPopUp();
        gameBoard.displayOnScreen();
    });

    const displayBlocks = document.querySelectorAll(".board-box");
    displayBlocks.forEach(block => {
        block.addEventListener('click', () => {
            //cannot select a spot on the board that has already been marked
            
            if (block.textContent !== "X" && block.textContent !== "O"){
                //do logic here;
                let rowClass = block.classList[1];
                let colClass = block.classList[2];
                let row, col;

                //transform className to true array row pos value
                switch(rowClass) {
                    case "row-1":
                        row = 0;
                        break;
                    case "row-2":
                        row = 1;
                        break;
                    case "row-3":
                        row = 2;
                        break;
                }
                //transform className to true array col pos value
                switch(colClass) {
                    case "col-1":
                        col = 0;
                        break;
                    case "col-2":
                        col = 1;
                        break;
                    case "col-3":
                        col = 2;
                        break;
                }
                
                playTurn(row, col, block);
                
                gameBoard.displayOnScreen();
                //check for a tie
                if(gameBoard.isFull()){
                    document.querySelector(".victory-pop-up h1").textContent = "IT'S A TIE";
                    showVictoryPopUp();
                }
                //check for a winner
                let winningPlayer = checkForWinner(block, row, col);
                //winner found
                if (winningPlayer !== undefined){
                    document.querySelector(".victory-pop-up h1").textContent = `${winningPlayer.getName()} WINS!!!!`;
                    showVictoryPopUp();
                }
                
                
                
            }
            else{
                alert("Spot is already selected. Please choose a different spot");
            }
        });
    });

    //
    //
    // helper functions
    //
    //

    const showGame = () => {
        document.querySelector(".wrapper").style.display = "flex";
        document.getElementById("player-one-marker").textContent = playerOne.getMarker();
        document.getElementById("player-name").textContent = playerOne.getName().toUpperCase();

    };

    const hideGame = () => {
        document.querySelector(".wrapper").style.display = "none";
    };

    const showWelcomePopUp = () => {
        document.querySelector(".welcome-pop-up").style.display = "block";
    };

    const hideWelcomePopUp = () => {
        document.querySelector(".welcome-pop-up").style.display = "none";
    };

    const showVictoryPopUp = () => {
        document.querySelector(".victory-pop-up").style.display = "flex";
    };

    const hideVictoryPopUp = () => {
        document.querySelector(".victory-pop-up").style.display = "none";
    };

    const playTurn = (row, col) => {
        if (playerTurn === 1){
            playerOne.placeMarker(row, col);
            playerTurn = 2;
        }
        else {
            opponent.placeMarker(row, col);
            playerTurn = 1;
        } 
    };

    const checkForWinner = (block, row, col) => {

        const blockVal = block.textContent;
        const boardArrayCopy = gameBoard.getBoardArray();

        let rowsMatch = true;
        
        //check for 3 in a row
        for (let i = 0; i < 3; i++){
            if (boardArrayCopy[row][i] !== blockVal){
                rowsMatch = false;
                break; 
            }
        }
        if (rowsMatch){
            console.log("victory by rows");
            if (blockVal === playerOne.getMarker()){
                return playerOne;
            }
            else{
                return opponent;
            }
        }

        let colsMatch = true;

        //check for 3 in a column
        for (let i = 0; i < 3; i++){
            if (boardArrayCopy[i][col] !== blockVal){
                colsMatch = false;
                break;
            }
        }
        if (colsMatch){
            console.log("victory by cols");
            if (blockVal === playerOne.getMarker()){
                return playerOne;
            }
            else{
                return opponent;
            }
        }

        //check for 3 in a diagnol
        if (boardArrayCopy[0][0] !== "-" && boardArrayCopy[1][1] !== "-" && boardArrayCopy[2][2]  !== "-"){
            if (boardArrayCopy[0][0] === boardArrayCopy[1][1] && boardArrayCopy[1][1]  === boardArrayCopy[2][2]){
                console.log("victory by top left diag");
                if (blockVal === playerOne.getMarker()){
                    return playerOne;
                }
                else{
                    return opponent;
                }
            }
        }
        else if (boardArrayCopy[2][0] !== "-" && boardArrayCopy[1][1] !== "-" && boardArrayCopy[0][2]  !== "-"){
            if (boardArrayCopy[2][0] === boardArrayCopy[1][1] && boardArrayCopy[1][1]  === boardArrayCopy[0][2]){
                console.log("victory by top right diag");
                if (blockVal === playerOne.getMarker()){
                    return playerOne;
                }
                else{
                    return opponent;
                }
            }
        }   
    };

})();