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

function Block(tiles, blockSize, gridSize)
{
    this.blockSize = blockSize;
    this.sameNumbersAllowed = true;
    this.availableNumbers = new Array();
    this.tiles = new Array(this.blockSize);
    
    if(Math.sqrt(gridSize) === blockSize)
    {
        this.sameNumbersAllowed = false;
        for(var i = 1; i <= gridSize; ++i)
        {
            this.availableNumbers.push(i);
        }
    }
    
    for(var i = 0; i < this.blockSize; ++i)
    {
        this.tiles[i] = new Array(this.blockSize);
        for(var j = 0; j < this.blockSize; ++j)
        {
            this.tiles[i][j] = tiles[(i * this.blockSize) + j];
        }
    }
    
    Block.prototype.SetBlockState = function(state)
    {
        for(var i = 0; i < this.blockSize; ++i)
        {
            for(var j = 0; j < this.blockSize; ++j)
            {
                this.tiles[i][j].state = state;
            }
        }
    };
    
    Block.prototype.CheckBlock = function()
    {
        if(!this.sameNumbersAllowed)
        {
            var availableNumberCopy = this.availableNumbers.slice();

            for(var i = 0; i < this.blockSize; ++i)
            {
                for(var j = 0; j < this.blockSize; ++j)
                {
                    if(this.tiles[i][j].number === 0) continue;
                    if(!availableNumberCopy.removeElement(this.tiles[i][j].number))
                    {
                        this.SetBlockState(TILE_STATE.Wrong);
                        return false;
                    }
                }
            }
        }
        this.SetBlockState(TILE_STATE.Normal);
        return true;
    };
}