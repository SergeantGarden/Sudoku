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

function ReadFile(filePath)
{
    var rawFile = new XMLHttpRequest();
    var returnText = {};
    rawFile.open("GET", filePath, false);
    rawFile.onloadend = function()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = new Array();
                allText = rawFile.responseText.split(/[,]/);
                for(var i = 0; i < allText.length; i++)
                {
                    if(allText[i].length > 1)
                    {
                        allText[i] = allText[i].substring(allText[i].length -1,allText[i].length);
                    }
                }
                returnText = allText;
            }
        }
    };
    rawFile.send(null);
    
    return returnText;
}

