/*
* De'Shawn Maynard
* Tic Tac Toe JS project for practicing OOP using factory functions and the module pattern
* June / July 2022
*/


//factory function to create player objects
const player = (name, marker) => {

    const playerMarker = marker;
    
    const getName = () => name;

    const getMarker = () => playerMarker;

    const placeMarker = (row, col) => {
        gameBoard.markBox(row, col, playerMarker);
    };

    

    return { getName, getMarker, placeMarker };
};

//game board object using module pattern
const gameBoard = (() => {
    
    let boardArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""] 
    ];

    const getBoardArray = () => boardArray;

    const resetArray = () => {
        boardArray = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    };

    const isFull = () =>{
        let arrayIsFull = true;
        //convert our 2d game board into a string seperated by commas
        const boardArrayString = boardArray.toString();
        //convert the string seperated by commas into a 1d array for looping  
        //and assigning to value to box position on the display
        const stringArray = boardArrayString.split(',');
        for (let i = 0; i < stringArray.length; i++){
            if (stringArray[i] === ""){
                arrayIsFull = false;
            }  
        }
        return arrayIsFull;     
    };
    
    const markBox = (row, col, marker) => boardArray[row][col] = marker;
    
    return { getBoardArray, resetArray, isFull, markBox };
})();

//game controller to handle flow of game using module pattern
const gameController = (() => {
    let gameOver;
    let playerOne;
    const opponent = player ("Opponent", "O");
    let playerTurn = 1;

    const startGame = () => {
        let playerName = document.querySelectorAll(".welcome-pop-up input");
        if (playerName === ""){
            playerName = "Guest";
        }
        playerOne = player (playerName, "X");
        document.getElementById("player-one-marker").textContent = playerOne.getMarker();
        document.getElementById("player-name").textContent = playerOne.getName().toUpperCase();
        displayController.showGame();
        displayController.displayBoardOnScreen();
        displayController.hideWelcomePopUp();
    };

    const selectBoardSpot = (block) => {
        
        if (!gameOver){
            //selected an empty block
            if (block.target.textContent !== "X" && block.target.textContent !== "O"){
                //do logic here;
                let rowClass = block.target.classList[1];
                let colClass = block.target.classList[2];  
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
                playTurn(block, row, col);
            }
        }
    };

    const playTurn = (block, row, col) => {
        if (playerTurn === 1){
            playerOne.placeMarker(row, col);
            if (checkForWinner(playerOne, row, col)){
                playerTurn = 1;
            }
            else{
                playerTurn = 2;
            }  
        }
        else {
            opponent.placeMarker(row, col);
            if (checkForWinner(opponent, row, col)){
                playerTurn = 2;
            }
            else{
                playerTurn = 1;
            }   
        }
        displayController.displayBoardOnScreen();
    };

    const checkForWinner = (player, row, col) => {

        const boardArrayCopy = gameBoard.getBoardArray();
        let rowsMatch = true;
        
        //check for 3 in a row
        for (let i = 0; i < 3; i++){
            if (boardArrayCopy[row][i] !== player.getMarker()){
                rowsMatch = false;
                break; 
            }
        }
        if (rowsMatch){
            console.log("victory by rows");
            document.querySelector(".victory-pop-up h1").textContent = `${player.getName()} WINS!!!!`;
            gameOver = true;
            displayController.showVictoryPopUp();
            return true;
        }

        let colsMatch = true;

        //check for 3 in a column
        for (let i = 0; i < 3; i++){
            if (boardArrayCopy[i][col] !== player.getMarker()){
                colsMatch = false;
                break;
            }
        }
        if (colsMatch){
            console.log("victory by cols");
            document.querySelector(".victory-pop-up h1").textContent = `${player.getName()} WINS!!!!`;
            gameOver = true;
            displayController.showVictoryPopUp();
            return true;
        }

        
        //check for 3 in upper left diagnol
        if (boardArrayCopy[0][0] === player.getMarker() && boardArrayCopy[1][1] === player.getMarker() && boardArrayCopy[2][2]  === player.getMarker()){
            console.log("victory by top left diag");
            document.querySelector(".victory-pop-up h1").textContent = `${player.getName()} WINS!!!!`;
            gameOver = true;
            displayController.showVictoryPopUp();
            return true;
        }

        //check for 3 in upper right diagnol
        else if (boardArrayCopy[2][0] === player.getMarker() && boardArrayCopy[1][1] === player.getMarker() && boardArrayCopy[0][2]  === player.getMarker()){
            console.log("victory by top right diag");
            document.querySelector(".victory-pop-up h1").textContent = `${player.getName()} WINS!!!!`;
            gameOver = true;
            displayController.showVictoryPopUp();
            return true;
        } 

        //check for a tie
        if(gameBoard.isFull()){
            document.querySelector(".victory-pop-up h1").textContent = "IT'S A TIE";
            gameOver = true;
            displayController.showVictoryPopUp();
        }
    }

    const playAgain = () => {
        gameOver = false;
        gameBoard.resetArray();
        displayController.hideVictoryPopUp();
        displayController.displayBoardOnScreen();
    };

    return { startGame, playAgain, selectBoardSpot };

})();



const displayController = (() => {

    const startButton = document.querySelector(".welcome-pop-up button");
    startButton.addEventListener('click', gameController.startGame);

    const playAgainButton = document.querySelector(".victory-pop-up button");
    playAgainButton.addEventListener('click', gameController.playAgain);

    const displayBlocks = document.querySelectorAll(".board-box");
    displayBlocks.forEach(block => {
        block.addEventListener('click', gameController.selectBoardSpot);
    });

    const displayBoardOnScreen = () => {
        //convert our 2d game board into a string seperated by commas
        const boardArrayString = gameBoard.getBoardArray().toString();
        //convert the string seperated by commas into a 1d array for looping  
        //and assigning to value to box position on the display
        const stringArray = boardArrayString.split(',');
        let boxList = document.querySelectorAll('.board-box');
        for (let i = 0; i < stringArray.length; i++){
            boxList[i].textContent = stringArray[i];
        }      
    };

    const showGame = () => {
        document.querySelector(".wrapper").style.display = "flex";
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

    return { displayBoardOnScreen, showGame, hideGame, showWelcomePopUp, hideWelcomePopUp, showVictoryPopUp, hideVictoryPopUp }

})();