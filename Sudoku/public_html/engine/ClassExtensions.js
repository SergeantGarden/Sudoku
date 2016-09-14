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

if(!Array.prototype.hasOwnProperty('indexOf'))
{
    Object.defineProperty(Array.prototype, 'indexOf', {
        enumerable: false,
        value: function(value, start)
        {
            start = start || 0;
            var l = this.length;
            while(start < l)
            {
                if(this[start] === value) return start;
                ++start;
            }
            return -1;
        }
    });
}

if(!Array.prototype.hasOwnProperty('removeOverlayElements'))
{
    Object.defineProperty(Array.prototype, 'removeOverlayElements', {
        enumerable: false,
        value: function(a2) 
        {
            if(a2.constructor === Array)
            {
                for(var i = 0; i < a2.length; i++)
                {
                    var index = this.indexOf(a2[i]);
                    if(index > -1) this.splice(index, 1);
                }
                return true;
            }
            return false;
        }
    });
}
if(!Array.prototype.hasOwnProperty('removeElement'))
{
    Object.defineProperty(Array.prototype, 'removeElement', {
        enumerable: false,
        value: function(element)
        {
            var index = this.indexOf(element);
            var removedElement = false;
            if(index > -1) 
            {
                removedElement = this[index];
                this.splice(index, 1);
            }
            return removedElement;
        }
    });
}

if(!Array.prototype.hasOwnProperty('print'))
{
    Object.defineProperty(Array.prototype, 'print', {
        enumerable: false,
        value: function()
        {
            for(var element in this)
            {
                console.log(this[element]);
            }
        }
    });
}


