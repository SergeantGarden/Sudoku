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

var CONTROLLER_BUTTONS = 
{
    XBOX_A: 0,  XBOX_B: 1,
    XBOX_X: 2,  XBOX_Y: 3,
    
    LEFT_BUMPER: 4,     RIGHT_BUMPER: 5,
    LEFT_TRIGGER: 6,    RIGHT_TRIGGER: 7,
    
    SELECT: 8,  BACK: 8,
    START: 9,   FORWARD: 9,
    
    LEFT_STICK: 10, RIGHT_STICK: 11,
    
    DPAD_UP: 12,    DPAD_DOWN: 13,
    DPAD_LEFT: 14,  DPAD_RIGHT: 15
};

var CONTROLLER_STICK =
{
    LEFT_STICK: 0,
    RIGHT_STICK: 2
};

var CONTROLLER_STICK_DIRECTION =
{
    LEFT: 0,    RIGHT: 1,
    UP: 2,      DOWN: 3
};

var KEY_CODE =
{
    BACKSPACE: 8,       TAB: 9,
    ENTER: 13,          SHIFT: 16,
    CTRL: 17,           ALT: 18,
    BREAK: 19,          CAPS: 20,
    ESCAPE: 27,         PAGE_UP: 33,
    PAGE_DOWN: 34,      END: 35,
    HOME: 36,           LEFT: 37,
    UP: 38,             RIGHT: 39,
    DOWN: 40,           INSERT: 45,
    DELETE: 46,         SELECT: 93,
    SPACE: 32,          FSLASH: 191,

    0: 48,      1: 49,
    2: 50,      3: 51,
    4: 52,      5: 53,
    6: 54,      7: 55,
    8: 56,      9: 57,
    a: 65,      b: 66,
    c: 67,      d: 68,
    e: 69,      f: 70,
    g: 71,      h: 72,
    i: 73,      j: 74,
    k: 75,      l: 76,
    m: 77,      n: 78,
    o: 79,      p: 80,
    q: 81,      r: 82,
    s: 83,      t: 84,
    u: 85,      v: 86,
    w: 87,      x: 88,
    y: 89,      z: 90,

    LEFT_WINDOW_KEY: 91,
    RIGHT_WINDOW_KEY: 92,

    NUM_0: 96,      NUM_1: 97,
    NUM_2: 98,      NUM_3: 99,
    NUM_4: 100,     NUM_5: 101,
    NUM_6: 102,     NUM_7: 103,
    NUM_8: 104,     NUM_9: 105,

    MULTIPLY: 106,
    PLUS: 107,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,

    F1: 112,        F2: 113,
    F3: 114,        F4: 115,
    F5: 116,        F6: 117,
    F7: 118,        F8: 119,
    F9: 120,        F10: 121,
    F11: 122,       F12: 123

};

var MOUSE_BUTTON = 
{
    Left: 1,
    Right: 2,
    Middle: 4
};

function Input(engine, gameCanvas)
{
    Input.engine = engine;
    Input.canvas = gameCanvas;
    /* -----------------------Keyboard----------------------------------- */
    Input.keyboard = {};
    
    var keys = [];
    var keyIsPressed = [];

    $(document).keydown(function(e)
    {
        keys[e.keyCode] = true;

        e.preventDefault();
    });

    $(document).keyup(function(e)
    {
        if(keys[e.keyCode])
        {
            keyIsPressed[e.keyCode] = true;
        }
        keys[e.keyCode] = false;
    });
    
    Input.keyboard.keyDown = function(key)
    {
        return keys[key];
    };
    
    Input.keyboard.keyUp = function(key)
    {
        return !keys[key];
    };
    
    Input.keyboard.keyPressed = function(key)
    {
        return keyIsPressed[key];
    };
    
    Input.keyboard.Update = function(dt)
    {
        for(var key in keyIsPressed)
        {
            keyIsPressed[key] = false;
        }
    };
    
    /* ------------------Mouse--------------------------------------------*/
    Input.mouse = {};
    
    var mouseInfo = {};
    
    if(gameCanvas !== undefined)
    {
        $(gameCanvas).mousedown(function(e)
        {
            e.preventDefault();
            
            mouseInfo.mouseDown = true;
            mouseInfo.mouseClicked = false;
            mouseInfo.button = e.buttons;
            mouseInfo.target = e.target;
            mouseInfo.x = e.clientX - gameCanvas.getBoundingClientRect().left;
            mouseInfo.y = e.clientY - gameCanvas.getBoundingClientRect().top;
        });
        
        $(gameCanvas).mouseup(function(e)
        {
            e.preventDefault();
            
            if(mouseInfo.mouseDown) mouseInfo.mouseClicked = true;
            mouseInfo.mouseDown = false;
            mouseInfo.x = e.clientX - gameCanvas.getBoundingClientRect().left;
            mouseInfo.y = e.clientY - gameCanvas.getBoundingClientRect().top;
        });
        
        $(gameCanvas).mousemove(function(e)
        {
            e.preventDefault();
            
            mouseInfo.x = e.clientX - gameCanvas.getBoundingClientRect().left;
            mouseInfo.y = e.clientY - gameCanvas.getBoundingClientRect().top;
        });
    }
    
    Input.mouse.Update = function(dt)
    {
        mouseInfo.mouseClicked = false;
        if(!mouseInfo.mouseDown)
        {
            mouseInfo.button = null;
            mouseInfo.target = null;
        }
    };
    
    Input.mouse.OnMouseClick = function(targetObject, button)
    {
        if(!mouseInfo.mouseClicked) return false;
        if(targetObject !== null && targetObject !== undefined)
        {
            if(targetObject.hasOwnProperty("collision"))
            {
                var mouseVector = new Vector(mouseInfo.x, mouseInfo.y);
                if(Input.engine.scale.x * Input.engine.resizeScale.x !== 1 || Input.engine.scale.y * Input.engine.resizeScale.y !== 1)
                {
                    mouseVector = new Vector(mouseInfo.x / (Input.engine.scale.x * Input.engine.resizeScale.x), mouseInfo.y / (Input.engine.scale.y * Input.engine.resizeScale.y));
                }
                if(targetObject.collision.type === COLLISION_TYPE.CIRCLE)
                {
                    if(!Collision.CheckCirclePoint(targetObject.collision, mouseVector)[0]) return false;
                }else if(targetObject.collision.type === COLLISION_TYPE.RECTANGLE)
                {
                    if(!Collision.CheckRectanglePoint(targetObject.collision, mouseVector)[0]) return false;
                }
            }else
            {
                if(mouseInfo.target !== targetObject) return false;
            }
        }
        if(button !== null && button !== undefined)
        {
            if(mouseInfo.button !== button) return false;
        }
        return true;
    };
    
    Input.mouse.OnMouseDown = function(targetObject, button)
    {
        if(!mouseInfo.mouseDown) return false;
        if(targetObject !== null && targetObject !== undefined)
        {
            if(targetObject.hasOwnProperty("collision"))
            {
                var mouseVector = new Vector(mouseInfo.x, mouseInfo.y);
                if(Input.engine.scale.x * Input.engine.resizeScale.x !== 1 || Input.engine.scale.y * Input.engine.resizeScale.y !== 1)
                {
                    mouseVector = new Vector(mouseInfo.x / (Input.engine.scale.x * Input.engine.resizeScale.x), mouseInfo.y / (Input.engine.scale.y * Input.engine.resizeScale.y));
                }
                if(targetObject.collision.type === COLLISION_TYPE.CIRCLE)
                {
                    if(!Collision.CheckCirclePoint(targetObject.collision, mouseVector)[0]) return false;
                }else if(targetObject.collision.type === COLLISION_TYPE.RECTANGLE)
                {
                    if(!Collision.CheckRectanglePoint(targetObject.collision, mouseVector)[0]) return false;
                }
            }else
            {
                if(mouseInfo.target !== targetObject) return false;
            }
        }
        if(button !== null && button !== undefined)
        {
            if(mouseInfo.button !== button) return false;
        }
        return true;
    };
    
    Input.mouse.GetMousePosition = function()
    {
        return {
            x: mouseInfo.x,
            y: mouseInfo.y
        };
    };
    
    /* ------------------Controllers--------------------------------------*/
    Input.controllers = {};
    
    var gamepads = [];
    var gamepadsUsed = false;
    
    window.addEventListener("gamepadconnected", function(e) {
        gamepads[e.gamepad.index] = e.gamepad;
    });
    window.addEventListener("gamepaddisconnected", function(e) {
        gamepads[e.gamepad.index] = null;
    });
    
    Input.controllers.ButtonPressed = function(gamepadIndex, button)
    {
        gamepadsUsed = true;
        gamepads[gamepadIndex] = navigator.getGamepads()[gamepadIndex];
        if(gamepads[gamepadIndex] === null || gamepads[gamepadIndex] === undefined) return false;
        return gamepads[gamepadIndex].buttons[button].pressed;
    };
    
    Input.controllers.ButtonValue = function(gamepadIndex, button)
    {
        gamepadsUsed = true;
        gamepads[gamepadIndex] = navigator.getGamepads()[gamepadIndex];
        if(gamepads[gamepadIndex] === null || gamepads[gamepadIndex] === undefined) return false;
        return gamepads[gamepadIndex].buttons[button].value;
    };
    
    Input.controllers.StickValue = function(gamepadIndex, stick)
    {
        if(stick !== 0 && stick !== 2) return false;
        
        gamepadsUsed = true;
        gamepads[gamepadIndex] = navigator.getGamepads()[gamepadIndex];
        if(gamepads[gamepadIndex] === null || gamepads[gamepadIndex] === undefined) return false;
        return {
            x: gamepads[gamepadIndex].axes[stick],
            y: gamepads[gamepadIndex].axes[stick + 1]
        };
    };
    
    Input.controllers.StickDirection = function(gamepadIndex, stick, direction, minimalforce)
    {
        if(stick !== 0 && stick !== 2) return false;
        if(direction < 0 && direction > 3) return false;
        
        gamepadsUsed = true;
        gamepads[gamepadIndex] = navigator.getGamepads()[gamepadIndex];
        if(gamepads[gamepadIndex] === null || gamepads[gamepadIndex] === undefined) return false;
        if(minimalforce === null || minimalforce === undefined || minimalforce > 1)
        {
            minimalforce = 1;
        }
        if(minimalforce < 0) minimalforce *= -1;
        
        switch(direction)
        {
            case CONTROLLER_STICK_DIRECTION.LEFT:
                return gamepads[gamepadIndex].axes[stick] <= (minimalforce * -1);
                break;
            case CONTROLLER_STICK_DIRECTION.RIGHT:
                return gamepads[gamepadIndex].axes[stick] >= minimalforce;
                break;
            case CONTROLLER_STICK_DIRECTION.UP:
                return gamepads[gamepadIndex].axes[stick + 1] <= (minimalforce * -1);
                break;
            case CONTROLLER_STICK_DIRECTION.DOWN:
                return gamepads[gamepadIndex].axes[stick + 1] >= minimalforce;
                break;
        }
    };
    
    Input.controllers.GetGamePad = function(gamepadIndex)
    {
        gamepadsUsed = true;
        gamepads[gamepadIndex] = navigator.getGamepads()[gamepadIndex];
        return gamepads[gamepadIndex];
    };
    
    Input.controllers.GetGamePads = function()
    {
        gamepadsUsed = true;
        var gamepadList = navigator.getGamepads();
        for(var i = 0; i < gamepadList.length; i++)
        {
            if(gamepadList[i] !== null && gamepadList[i] !== undefined)
            {
                gamepads[i] = gamepadList[i];
            }
        }
        return gamepads;
    };
    
    Input.Update = function(dt)
    {
        Input.keyboard.Update(dt);
        Input.mouse.Update(dt);
    };
    
    return Input;
};
