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

Math.arrayRandom = function(list)
{
    if(list.constructor === Array)
    {
        if(list.length > 0)
        {
            return list[Math.round(Math.random() * (list.length -1))];
        }else { return false; }
    }else
    {
        return false;
    }
};

function Vector(x, y)
{
    var _x = x;
    var _y = y;
    
    Object.defineProperty(this, "x", {
        get: function() { return _x; },
        set: function(value) { if($.isNumeric(value)) _x = value; parseInt(_x); }
    });
    
    Object.defineProperty(this, "y", {
        get: function() { return _y; },
        set: function(value) { if($.isNumeric(value)) _y = value; parseInt(_y); }
    });
    
    Vector.prototype.add = function(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
    };
    
    Vector.prototype.subtract = function(vector)
    {
        this.x -= vector.x;
        this.y -= vector.y;
    };
    
    Vector.prototype.multiply = function(v2)
    {
        return new Vector(this.x * v2.x, this.y * v2.y);
    };
    
    Vector.prototype.multiplyByNumber = function(value)
    {
        return new Vector(this.x * value, this.y * value);
    };

    Vector.prototype.isZero = function()
    {
        return (this.x === 0 && this.y === 0);
    };

    Vector.prototype.getMagnitude = function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    
    Vector.prototype.getNormalized = function()
    {
        var _x = this.x;
        var _y = this.y;
        
        var length = this.getMagnitude();
        if(length === 0)
        {
            _x = 1;
            return new Vector(_x, _y);
        }
        _x /= length;
        _y /= length;
        
        return new Vector(_x, _y);
    };
    
    Vector.prototype.dotProduct = function(v2)
    {
        return this.x * v2.x + this.y * v2.y;
    };
    
    Vector.prototype.perpendicular = function()
    {
        return new Vector(-this.y, this.x);
    };
    
    Vector.prototype.connection = function(v2)
    {
        return new Vector(v2.x - this.x, v2.y - this.y);
    };
    
    Vector.prototype.distanceToPoint = function(v2)
    {
        return Math.sqrt(Math.pow(v2.x - this.x, 2) + Math.pow(v2.y - this.y, 2));
    };

    Vector.prototype.getAngle = function()
    {
        return Math.atan2(this.y, this.x);
    };

    Vector.prototype.fromAngle = function(angle, magnitude)
    {
        return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    };
}

function LineSegment(startPoint, endPoint)
{
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    
    LineSegment.prototype.directionVector = function()
    {
        return this.startPoint.connection(this.endPoint);
    };
    
    LineSegment.prototype.placeVector = function()
    {
        return this.startPoint;
    };
    
    LineSegment.prototype.normalVector = function()
    {
        return this.directionVector().perpendicular().getNormalized();
    };
    
    LineSegment.prototype.equationConstant = function()
    {
        return this.placeVector().dotProduct(this.normalVector());
    };
    
    LineSegment.prototype.intersectionParameter = function(l2)
    {
        return (l2.equationConstant() - (this.placeVector().dotProduct(l2.normalVector()))) / 
                this.directionVector().dotProduct(l2.normalVector());
    };
    
    LineSegment.prototype.intersection = function(l2)
    {
        if(this.intersectionParameter(l2) >= 0 && this.intersectionParameter(l2) <= 1)
        {
            if(l2.intersectionParameter(this) >= 0 && l2.intersectionParameter(this) <= 1)
            {
                return true;
            }
        }
        return false;
    };
}
