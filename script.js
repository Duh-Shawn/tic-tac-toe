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

    const markBox = (row, col, marker) => boardArray[row][col] = marker;
    const displayOnScreen = () => {
        for (let i = 0; i < boardArray.length; i++){
            for (let j = 0; j < boardArray.length; j++){
                let row = document.querySelectorAll('.board-row')[i];
                //set each p element in row div to corresponding value found in the gameboard array
                row.children[j].textContent = boardArray[i][j];
            }
        }        
    }

    return { markBox, displayOnScreen, boardArray };

})();

//display controller to handle flow of game using module pattern
const displayController = (() => {
    gameBoard.displayOnScreen(); //display starting board
    const dee = player ("d", "X");
    const opponent = player ("opp", "O");
    let playerTurn = 1;

    const displayBlocks = document.querySelectorAll(".board-row .board-box");
    displayBlocks.forEach(block => {
        block.addEventListener('click', () => {
            //cannot select a spot on the board that has already been marked
            if (block.textContent !== "X" && block.textContent !== "O"){
                //do logic here;
                let rowClass = block.parentElement.classList[1];
                let colClass = block.classList[1];
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
                    playerTurn = 2;
                }
                else {
                    opponent.placeMarker(row, col);
                    gameBoard.displayOnScreen();
                    playerTurn = 1;
                }
                
            }
            else{
                // alert("Spot is already selected. Please choose a different spot");
            }



        });
    });

})();