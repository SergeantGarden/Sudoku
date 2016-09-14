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

var TILE_STATE = {
    Normal: 0,
    Wrong: 1,
    Correct: 2
};

function Tile(position, size)
{
    var collisionProperties = {};
    collisionProperties.size = { x: size.x, y: size.y };
    GameObject.call(this, position, 0, new Vector(1,1), null, false, new Collision(COLLISION_TYPE.RECTANGLE, this, collisionProperties));
    var _private = {};
    _private.number = 0;
    _private.state = TILE_STATE.Normal;
    _private.tileClicked = false;
    _private._numberSolid = false;
    _private._fontSize = (20/32) * size.x;
    
    Object.defineProperty(this, "private", {
        get: function() { return _private; }
    });
    
    Object.defineProperty(this, "state", {
        get: function() { return this.private.state; },
        set: function(state) 
        { 
            if(this.private._numberSolid) return;
            if(state >= 0 && state <= 2) this.private.state = state;
        }
    });
    
    Object.defineProperty(this, "number", {
        get: function() { return this.private.number; }
    });
    
    var colors = { white: "white",
                   gray: "gray",
                   red: "#FA5858",
                   green: "lightgreen" };
               
    _private._color = colors.white;
    
    this.makeSolid = function()
    {
        this.private._numberSolid = true;
        this.private.state = TILE_STATE.Normal;
        this.private._color = colors.gray;
    };
    
    Tile.prototype.Update = function(input, dt)
    {
        switch(this.private.state)
        {
            case TILE_STATE.Normal:
                this.private._color = colors.white;
                if(this.private._numberHinted || this.private._numberSolid)
                {
                    this.private._color = colors.gray;
                }
                break;
            case TILE_STATE.Wrong:
                this.private._color = colors.red;
                break;
            case TILE_STATE.Correct:
                this.private._color = colors.green;
                break;
        }
        if(input.mouse.OnMouseClick(this, MOUSE_BUTTON.Left) && !this.private._numberSolid)
        {
            this.private.tileClicked = true;
            this.private.number++;
            if(this.private.number > 9) this.private.number = 1;
        }
    };
    
    Tile.prototype.Draw = function(context)
    {
        context.save();
        context.fillStyle = this.private._color;
        context.fillRect(this.position.x - size.x / 2, this.position.y - size.y / 2, size.x, size.y);
        context.font = this.private._fontSize + "px Arial";
        context.fillStyle = "black";
        if(this.private.tileClicked || this.private._numberSolid)
        {
            context.fillText(this.private.number, this.position.x - 5, this.position.y + 5);
        }
        context.restore();
    };
};

Tile.prototype = Object.create(GameObject.prototype);