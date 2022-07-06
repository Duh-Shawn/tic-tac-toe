//game board object using module pattern
const gameBoard = (() => {
    const boardArray = [
        ["X", "X", "O"],
        ["X", "O", "X"],
        ["O", "O", "X"] 
    ];

    const getArray = () => boardArray;

    return { getArray };
})();

//display controller to handle flow of game using module pattern
const displayController = (() => {

})();

//factory function to create player objects
const player = (name) => {

};



function displayBoardOnScreen() {
    let boardArray = gameBoard.getArray();
    for (let i = 0; i < boardArray.length; i++){
        for (let j = 0; j < boardArray.length; j++){
            let row = document.querySelectorAll('.board-row')[i];
            //set each p element in row div to corresponding value found in the gameboard array
            row.children[j].textContent = boardArray[i][j];
        }
    }
}