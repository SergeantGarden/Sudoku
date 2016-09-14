/* 
 *  Copyright 2016 Hugo Mater
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

function GameScene(engine)
{
    Scene.call(this);
    
    var size = new Vector(32,32);
    var positionOffset = new Vector(70,25);
    var difficulty = {
                        easy: 0,
                        normal: 1,
                        hard: 2 };
    
    GameScene.prototype.Update = function(input, dt)
    {
        if(input.keyboard.keyPressed(KEY_CODE.SPACE)) console.log(grid.CheckGrid());
        Scene.prototype.Update.call(this, input, dt);
    };
    
    GameScene.prototype.Draw = function(context)
    {
        context.save();
        context.fillStyle = "black";
        context.fillRect(0,0, Engine.currentGame[engine.gameTitle].originalResolution.x, Engine.currentGame[engine.gameTitle].originalResolution.y);
        context.restore();
        
        Scene.prototype.Draw.call(this, context);
    };
    
    GameScene.prototype.CreateSudoku = function(difficulty)
    {
        var grid = new Sudoku(9, size, new Vector(120, 75), this);
        
        return grid;
    };
        
    var grid = this.CreateSudoku();
}

GameScene.prototype = Object.create(Scene.prototype);
