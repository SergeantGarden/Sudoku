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

function Sprite(sprite, size, alpha)
{
    var _private = {};
    _private._sprite = sprite;
    _private._size = size || new Vector(sprite.width, sprite.height);
    _private._alpha = alpha || 1;
    
    Object.defineProperty(this, "size", {
        get: function() { return _private._size; },
        set: function(value) { if(value.hasOwnProperty("x") && value.hasOwnProperty("y")) _private._size = value; }
    });
    
    Object.defineProperty(this, "alpha", {
        get: function() { return _private._alpha; },
        set: function(value) { if( $.isNumeric(value) && value <= 1 && value >= 0) _private._alpha = value; }
    });
    
    Object.defineProperty(this, "private", {
        get: function() { return _private; }
    });
    
    Sprite.prototype.Update = function(dt) { };
    
    Sprite.prototype.Draw = function(ctx, position, rotation, scale)
    {
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(rotation * (Math.PI/180));
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.private._sprite, -(this.size.x * scale.x) / 2, -(this.size.y * scale.y) / 2, (this.size.x * scale.x), (this.size.y * scale.y));
        ctx.restore();
    };
};