//factory function to create player objects
const player = (name, marker) => {
    const assignedMarker = marker;
    const placeMarker = (row, col) => {
        gameBoard.markBox(row, col, assignedMarker);
    };

    return { placeMarker };
};

//game board object using module pattern
const gameBoard = (() => {
    
    const boardArray = [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"] 
        // ["X", "X", "O"],
        // ["X", "X", "O"],
        // ["O", "O", "X"] 
    ];

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
    }

    return { markBox, displayOnScreen, getBoardArray };
})();

//display controller to handle flow of game using module pattern
const displayController = (() => {
    gameBoard.displayOnScreen(); //display starting board
    const dee = player ("d", "X");
    const opponent = player ("opp", "O");
    let playerTurn = 1;

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
            return true;
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
            return true;
        }

        //check for 3 in the diagnols
        if (boardArrayCopy[0][0] !== "-" && boardArrayCopy[1][1] !== "-" && boardArrayCopy[2][2]  !== "-"){
            if (boardArrayCopy[0][0] === boardArrayCopy[1][1] && boardArrayCopy[1][1]  === boardArrayCopy[2][2]){
                console.log("victory by top left diag");
                return true;
            }
        }
        else if (boardArrayCopy[2][0] !== "-" && boardArrayCopy[1][1] !== "-" && boardArrayCopy[0][2]  !== "-"){
            if (boardArrayCopy[2][0] === boardArrayCopy[1][1] && boardArrayCopy[1][1]  === boardArrayCopy[0][2]){
                console.log("victory by top right diag");
                return true;
            }
        }   
    };

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

                if (playerTurn === 1){
                    dee.placeMarker(row, col);
                    gameBoard.displayOnScreen();
                    checkForWinner(block, row, col);
                    playerTurn = 2;
                    
                }
                else {
                    opponent.placeMarker(row, col);
                    gameBoard.displayOnScreen();
                    checkForWinner(block, row, col);
                    playerTurn = 1;
                }  
            }
            else{
                // alert("Spot is already selected. Please choose a different spot");
            }
        });
    });
})();