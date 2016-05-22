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

function Tile(position, size)
{
    var collisionProperties = {};
    collisionProperties.size = { x: size.x, y: size.y };
    GameObject.call(this, position, 0, new Vector(1,1), null, false, new Collision(COLLISION_TYPE.RECTANGLE, this, collisionProperties));
    
    this.number = 0;
    
    Tile.prototype.Update = function(input, dt)
    {
        if(input.mouse.OnMouseClick(this, MOUSE_BUTTON.Left))
        {
            this.number++;
            if(this.number > 9) this.number = 0;
        }
    };
    
    Tile.prototype.Draw = function(context)
    {
        //border strokerect
        //strokeRect(position.x, position.y, size.x, size.y);
        //strokeStyle "color";
        context.save();
        context.fillStyle = "white";
        context.fillRect(this.position.x - size.x / 2, this.position.y - size.y / 2, size.x, size.y);
        context.font = "20px Arial";
        context.fillStyle = "black";
        context.fillText(this.number, this.position.x, this.position.y);
        context.restore();
    };
};

Tile.prototype = Object.create(GameObject.prototype);