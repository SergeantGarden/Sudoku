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

function SurowkuNumber(position, number)
{
    GameObject.call(this, position, 0, new Vector(1,1), null, false);
    
    this.number = number;
    
    SurowkuNumber.prototype.Update = function(input, dt)
    {
        
    };
    
    SurowkuNumber.prototype.Draw = function(context)
    {
        context.save();
        context.fillStyle = "black";
        context.font = "12px Arial";
        context.fillText(this.number, this.position.x, this.position.y);
        context.restore();
    };
}

SurowkuNumber.prototype = Object.create(GameObject.prototype);