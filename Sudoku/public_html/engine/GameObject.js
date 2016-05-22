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

function GameObject(position, rotation, scale, sprite, moveable, collision)
{
    var _position = position || new Vector(0,0);
    var _rotation = rotation || 0;
    var _scale = scale || new Vector(1,1);
    if(typeof(moveable) !== "boolean") moveable = true;
    var _moveable = moveable;
    var _velocity = new Vector(0,0);
    var _active = true;
     
    var _sprite = sprite || null;
    
    var _collision = null;
    var _hasCollision = true;
    var _collisionProperties = {};
    if(collision === undefined || collision === null || !(collision instanceof Collision))
    {
        if(_sprite !== null)
        {
            _collisionProperties.size = {x: _sprite.size.x, y: _sprite.size.y};
        }else
        {
            _hasCollision = false;
            _collisionProperties.size = {x: 0, y: 0};
        }
        _collision = new Collision(COLLISION_TYPE.RECTANGLE, this, _collisionProperties);
    }else
    {
        _collision = collision;
    }
    
    Object.defineProperty(this, "position", {
        get: function() { return _position; },
        set: function(value) { if(value instanceof Vector && value.hasOwnProperty("x") && value.hasOwnProperty("y")) 
                                    _position = value; }
    });
    
    Object.defineProperty(this, "scale", {
        get: function() { return _scale; },
        set: function(value) { if(value instanceof Vector && value.hasOwnProperty("x") && value.hasOwnProperty("y")) 
                                    _scale = value; }
    });
    
    Object.defineProperty(this, "rotation", {
        get: function() { return _rotation; },
        set: function(value) { if(Number.isInteger(value)) _rotation = value;}
    });
    
    Object.defineProperty(this, "moveable", {
        get: function() { return _moveable; },
        set: function(value) { if(typeof(value) === "boolean") _moveable = value; }
    });
    
    Object.defineProperty(this, "velocity", {
        get: function() { return _velocity; },
        set: function(value) { if(value instanceof Vector && value.hasOwnProperty("x") && value.hasOwnProperty("y") && _moveable) _velocity = value;
                                if(Number.isInteger(value) && _moveable) _velocity.x = value, _velocity.y = value; }
    });
    
    Object.defineProperty(this, "active", {
        get: function() { return _active; },
        set: function(value) { if(typeof(value) === "boolean") _active = value; }
    });
    
    Object.defineProperty(this, "hasCollision", {
        get: function() { return _hasCollision; },
        set: function(value) { if(typeof(value) === "boolean") _hasCollision = value; }
    });
    
    Object.defineProperty(this, "collision", {
        get: function() { return _collision; },
        set: function(value) { _collision = value; }
    });
    
    Object.defineProperty(this, "sprite", {
        get: function() { return _sprite; }
    });
    
    GameObject.prototype.Update = function(input, dt)
    {
        this.position.add(this.velocity.multiplyByNumber(dt));
        if(sprite !== null) this.sprite.Update(dt);
    };
    
    GameObject.prototype.Draw = function(context)
    {
        if(sprite !== null) this.sprite.Draw(context, this.position, this.rotation, this.scale);
    };
    
    GameObject.prototype.HandleCollision = function(cO, collisionSide)
    {
        
    };
};