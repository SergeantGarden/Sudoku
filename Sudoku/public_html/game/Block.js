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

function Block(position, tileSize, scene)
{
    GameObject.call(this, position, 0, new Vector(1,1), null, false);
    
    var blockRows = [];
    var offset = { x: tileSize.x * 1.5,
                   y: tileSize.y * 1.5 };
               
    for(var j = 0; j < 9; j++)
    {
        scene.AddGameObject(new Tile(new Vector(-offset.x + position.x + ((j % 3) * tileSize.x) + (j % 3), -offset.y + position.y + Math.floor(j / 3) * (tileSize.y + 1)), tileSize), "background");
    }
}

Block.prototype = Object.create(GameObject.prototype);