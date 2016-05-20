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

function Animation(sprite, size, alpha)
{
    var _private = {};
    _private._sprite = sprite;
    _private._size = size || new Vector(sprite.width, sprite.height);
    _private._alpha = alpha || 1.0;
    _private._flashAlpha = 0.0;
    _private._originalAlpha = _private._alpha;
    _private._flashing = false;
    _private._flashTimer = 0;
    _private._flashInterval = 0;
    
    _private._tickCount = 0.0001;
    _private._playing = false;
    _private._continuesPlaying = false;
    _private._currentFrame = 0;
    _private._ticksPerSecond = 0;
    
    _private._currentFrameList = [];
    _private._frameIndex = 0;
    _private._animationArray = {};
    
    Object.defineProperty(this, "size", {
        get: function() { return _private._size; },
        set: function(value) { if(value.hasOwnProperty("x") && value.hasOwnProperty("y")) _private._size = value; }
    });
    
    Object.defineProperty(this, "alpha", {
        get: function() { return _private._alpha; },
        set: function(value) { if( $.isNumeric(value) && value <= 1 && value >= 0) _private._alpha = value; }
    });
    
    Object.defineProperty(this, "frameIndex", {
        get: function() { return _private._frameIndex; },
        set: function(value) { if( $.isNumeric(value)) _private._frameIndex = value; }
    });
    
    Object.defineProperty(this, "currentFrame", {
        get: function() { return _private._currentFrame; },
        set: function(value) { if( $.isNumeric(value)) _private._currentFrame = value; }
    });
    
    Object.defineProperty(this, "isPlaying", {
        get: function() { return _private._playing; },
        set: function(value) { console.log("cannot set property isPlaying"); }
    });
    
    Object.defineProperty(this, "isFlashing", {
        get: function() { return _private._flashing; },
        set: function(value) { console.log("cannot set property isPlaying"); }
    });
    
    Object.defineProperty(this, "private", {
        get: function() { return _private; }
    });
    
    Animation.prototype.AddAnimation = function(name, animationFrameIndex)
    {
        this.private._animationArray[name] = animationFrameIndex;
    };
    
    Animation.prototype.Play = function(name, continues, speed)
    {
        if(!this.isPlaying && this.private._animationArray[name] !== undefined)
        {
            this.private._continuesPlaying = continues || false;
            this.private._currentFrameList = this.private._animationArray[name];
            speed = speed || 1;
            this.private._ticksPerSecond = (this.private._currentFrameList.length - 1) / speed;
            this.currentFrame = 0;
            this.frameIndex = this.private._currentFrameList[this.currentFrame];
            this.private._playing = true;
        }
    };
    
    Animation.prototype.Stop = function()
    {
        this.private._playing = false;
    };
    
    StopFlash = function()
    {
        this.private._flashing = false;
        this.alpha = this.private._originalAlpha;
    };
    
    Flashing = function()
    {
        if(this.alpha === this.private._flashAlpha)
        {
            this.alpha = this.private._originalAlpha;
        }else
        {
            this.alpha = this.private._flashAlpha;
        }
    };
    
    Animation.prototype.Flash = function(time, alpha, intervalTime)
    {
        time = time || 1;
        this.private._flashAlpha = alpha || 0.5;
        this.private._flashInterval = intervalTime;
        this.private._flashing = true;
        setTimeout(StopFlash.bind(this), time * 1000);
    };
    
    Animation.prototype.Update = function(dt)
    {
        if(this.isPlaying && this.private._currentFrameList.length !== 0)
        {
            this.frameIndex = this.private._currentFrameList[this.private._currentFrame];
            this.private._tickCount += dt;
            
            if (this.private._tickCount > (1 / this.private._ticksPerSecond))
            {
                this.private._tickCount = 0;
                this.currentFrame++;
                if(this.currentFrame > this.private._currentFrameList.length -1)
                {
                    if(this.private._continuesPlaying)
                    {
                        this.currentFrame = 0;
                    }else
                    {
                        this.private._playing = false;
                    }
                }
            }
        }
        if(this.private._flashing)
        {
            this.private._flashTimer += dt;
            if(this.private._flashTimer >= this.private._flashInterval)
            {
                this.private._flashTimer = 0;
                Flashing.call(this);
            }
        }
    };
    
    Animation.prototype.Draw = function(ctx, position, rotation, scale)
    {
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(rotation * (Math.PI/180));
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(
            this.private._sprite,
            this.frameIndex * this.size.x,
            0,
            this.size.x,
            this.size.y,
            -((this.size.x * scale.x) /2),
            -((this.size.y * scale.y) /2),
            this.size.x * scale.x,
            this.size.y * scale.y);
        ctx.restore();
    };
};