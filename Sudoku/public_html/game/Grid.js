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

function Grid(position, tileSize, scene)
{
    GameObject.call(this, position, 0, new Vector(1,1), null, false);
    
    var gridRows = [];
    var offset = { x: tileSize.x * 2.5,
                   y: tileSize.y * 2.5 };
               
    for(var j = 0; j < 9; j++)
    {
        scene.AddGameObject(new Block(new Vector(-offset.x - 10 + position.x + ((j % 3) * (offset.x + (tileSize.x / 1.4))), -offset.y - 10 + position.y + Math.floor(j / 3) * (offset.y + (tileSize.y / 1.4))), tileSize, scene), "background");
    }
}

Grid.prototype = Object.create(GameObject.prototype);