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

var COLLISION_TYPE =
{
    RECTANGLE: 0,
    CIRCLE: 1
};

function Collision(type, player, properties)
{
    this.player = player;
    this.type = type;
    if(type === COLLISION_TYPE.CIRCLE)
    {
        if(properties.hasOwnProperty("radius"))
        {
            var _radius = parseInt(properties.radius);
            Object.defineProperty(this, "radius", {
                get: function() { return _radius; }
            });
        }else
        {
            console.log("Incorrect collision properties");
            return false;
        }
    }else if (type === COLLISION_TYPE.RECTANGLE)
    {
        if(properties.hasOwnProperty("size"))
        {
            var _size = new Vector(properties.size.x, properties.size.y);
            Object.defineProperty(this, "size", {
                get: function() { return _size; }
            });
            
            Object.defineProperty(this, "min", {
                get: function() { return new Vector(this.player.position.x - (this.size.x / 2), this.player.position.y - (this.size.y / 2)); }
            });
            
            Object.defineProperty(this, "max", {
                get: function() { return new Vector(this.player.position.x + (this.size.x / 2), this.player.position.y + (this.size.y / 2)); }
            });
            
            Object.defineProperty(this, "centerCornerLength", {
                get: function() { return Math.sqrt(Math.pow(this.size.x / 2, 2) + Math.pow(this.size.y / 2, 2)); }
            });
        }else
        {
            console.log("Incorrect collision properties");
            return false;
        }
    }
};

Collision.CheckRectangleCircle = function(r, c)
{
    if(r.centerCornerLength + c.radius > r.player.position.distanceToPoint(c.player.position))
    {
        
    }
    return [false, "none", "none"];
};

Collision.CheckCircles = function(c1, c2)
{
    if(c1.radius + c2.radius > c1.player.position.distanceToPoint(c2.player.position))
    {
        return [true, "none", "none"];
    }
    return [false, "none", "none"];
};

Collision.CheckCirclePoint = function(c, v)
{
    if(c.radius > c.player.position.distanceToPoint(v))
    {
        return [true, "none", "none"];
    }
    return [false, "none", "none"];
};

Collision.CheckRectangles = function(r1, r2)
{
    if(r1.centerCornerLength + r2.centerCornerLength > r1.player.position.distanceToPoint(r2.player.position))
    {
        var yHit = r1.max.y > r2.min.y && r1.min.y < r2.max.y;
        var xHit = r1.max.x > r2.min.x && r1.min.x < r2.max.x;
        if(yHit && xHit)
        {
            var line1 = new LineSegment(new Vector(r1.player.position.x, r1.player.position.y), new Vector(r2.player.position.x, r2.player.position.y));
            var line2 = new LineSegment(new Vector(r1.max.x, r1.min.y), new Vector(r1.max.x, r1.max.y));

            if(line1.intersection(line2))
            {
                return [true, "right", "left"];
                //RIGHT
            }

            line2 = new LineSegment(new Vector(r1.min.x, r1.max.y), new Vector(r1.min.x, r1.min.y));
            if(line1.intersection(line2))
            {
                return [true, "left", "right"];
                //LEFT
            }

            line2 = new LineSegment(new Vector(r1.min.x, r1.min.y), new Vector(r1.max.x, r1.min.y));
            if(line1.intersection(line2))
            {
                return [true, "top", "bottom"];
                //TOP
            }

            line2 = new LineSegment(new Vector(r1.min.x, r1.max.y), new Vector(r1.max.x, r1.max.y));
            if(line1.intersection(line2))
            {
                return [true, "bottom", "top"];
                //BOTTOM
            }
            if(r1.player.position.distanceToPoint(r2.player.position) < r1.size.x + r2.size.x)
            {
                return [true, "unkown", "unkown"];
            }
        }
    }
    return [false, "none", "none"];
};

Collision.CheckRectanglePoint = function(r1, v)
{
    if(r1.centerCornerLength > r1.player.position.distanceToPoint(v))
    {
        if(r1.min.x <= v.x && r1.max.x >= v.x)
        {
            if(r1.min.y <= v.y && r1.max.y >= v.y)
            {
                return [true, "none", "none"];
            }
        }
    }
    return [false, "none", "none"];
};