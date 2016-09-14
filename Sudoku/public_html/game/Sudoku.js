/* 
 * Copyright 2016 Hugo Mater.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var CHANGE_TILES_STATE = {
    ROW: 0,
    COLUMN: 1
};

function Sudoku(gridSize, tileSize, position, scene)
{
    this.gridSize = gridSize;
    this.tileSize = tileSize;
    this.position = position;
    this.blocks = [];
    this.tiles = new Array(this.gridSize);
    this.availableNumbers = [];
    
    var offset = { x: tileSize.x * 1.5,
                   y: tileSize.y * 1.5 };
    
    for(var i = 0; i < this.gridSize; ++i)
    {
        this.availableNumbers.push(i + 1);
        this.tiles[i] = new Array(this.gridSize);
        for(var j = 0; j < this.gridSize; ++j)
        {
            this.tiles[i][j] = new Tile(new Vector(-offset.x + this.position.x + ((j % this.gridSize) * this.tileSize.x) + (j % this.gridSize), -offset.y + this.position.y + i * (this.tileSize.y + 1)), this.tileSize, 0);
            scene.AddGameObject(this.tiles[i][j], "background");
        }
    }
    
    Sudoku.prototype.CheckGrid = function()
    {
        var blocksCorrect = false;
        var rowsAndColumnsCorrect = false;
        for(var i = 0; i < this.blocks.length; ++i)
        {
            if(this.blocks[i].CheckBlock()) blocksCorrect = true;
        }
        rowsAndColumnsCorrect = this.CheckRowsAndColumns();
        if(blocksCorrect && rowsAndColumnsCorrect)
        {
            for(var i = 0; i < this.gridSize; ++i)
            {
                this.ChangeTilesState(TILE_STATE.Correct, CHANGE_TILES_STATE.ROW, i);
            }
        }
        return blocksCorrect && rowsAndColumnsCorrect;
    };
    
    Sudoku.prototype.CheckRowsAndColumns = function()
    {
        var rowsIncorrect = [];
        var columnsIncorrect = [];
        for(var i = 0; i < this.gridSize; ++i)
        {
            this.ChangeTilesState(TILE_STATE.Normal, CHANGE_TILES_STATE.ROW, i);
            
            var numbersRowCopy = this.availableNumbers.slice();
            var numbersColumnCopy = this.availableNumbers.slice();
            for(var j = 0; j < this.gridSize; ++j)
            {
                if(!numbersRowCopy.removeElement(this.tiles[i][j].number)) rowsIncorrect.push(i);
                if(!numbersColumnCopy.removeElement(this.tiles[j][i].number)) columnsIncorrect.push(i);
            }
        }
        if(rowsIncorrect.length <= 0 && columnsIncorrect.length <= 0) return true;
        if(rowsIncorrect.length > 0)
        {
            for(var i = 0; i < rowsIncorrect.length; ++i)
            {
                this.ChangeTilesState(TILE_STATE.Wrong, CHANGE_TILES_STATE.ROW, rowsIncorrect[i]);
            }
        }
        if(columnsIncorrect.length > 0)
        {
            for(var i = 0; i < columnsIncorrect.length; ++i)
            {
                this.ChangeTilesState(TILE_STATE.Wrong, CHANGE_TILES_STATE.COLUMN, columnsIncorrect[i]);
            }
        }
        return false;
    };
    
    Sudoku.prototype.ChangeTilesState = function(state, columnOrRow, index)
    {
        for(var i = 0; i < this.gridSize; ++i)
        {
            if(columnOrRow === CHANGE_TILES_STATE.COLUMN)
            {
                this.tiles[i][index].state = state;
            }else if(columnOrRow === CHANGE_TILES_STATE.ROW)
            {
                this.tiles[index][i].state = state;
            }
        }
    };
    
    Sudoku.prototype.CreateBlocks = function()
    {
        var miniBlockSize = 3;
        var maxiBlockSize = 5;
        var amountOfBlocks = -1;
        var blocksPerRow = 0;
        var attemptSize = miniBlockSize;
        if(this.gridSize <= 3) this.gridSize = 3, amountOfBlocks = 1, blocksPerRow = 1;
        if(this.gridSize >= 9) this.gridSize = 9, amountOfBlocks = 9, blocksPerRow = 3;
        if(this.gridSize === 4) amountOfBlocks = 4, blocksPerRow = 2, attemptSize = 2;
        
        if(amountOfBlocks === -1)
        {
            while(amountOfBlocks === -1)
            {
                if(((this.gridSize/attemptSize) % 1) === 0)
                {
                    blocksPerRow = (this.gridSize/attemptSize);
                    amountOfBlocks = Math.pow(blocksPerRow, 2);
                    continue;
                }
                attemptSize++;
                if(attemptSize > maxiBlockSize)
                {
                    amountOfBlocks = -2;
                }
            }
            if(amountOfBlocks === -2) console.log(" FAILURE ");
        }
        
        for(var i = 0; i < amountOfBlocks; ++i)
        {
            var tilesInBlock = [];
            for(var j = 0; j < attemptSize; ++j)
            {
                for(var k = 0; k < attemptSize; ++k)
                {
                    tilesInBlock[(j * attemptSize) + k] = this.tiles[j + Math.floor(i/blocksPerRow) * attemptSize][k + ((i % blocksPerRow) * attemptSize)];
                }
            }
            this.blocks.push(new Block(tilesInBlock, attemptSize, this.gridSize));
        }
    };
    
    this.CreateBlocks();
}
