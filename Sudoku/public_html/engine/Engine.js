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

Engine.currentGame = {};
Engine.audioVolume = 1;
Engine.engineFolderPath = "engine/";
Engine.selectedGame = "none";

function Engine(resolution, title, canvasParent, folderPath)
{
    Engine.currentGame[title] = { gameAssets: {},
                                  gameAudio: {},
                                  resolution: resolution,
                                  originalResolution: resolution,
                                  currentScene: null,
                                  loadingScene: null};
                              
    if(Engine.selectedGame === "none")
    {
        Engine.selectedGame = title;
    }
    if(folderPath)
    {
        Engine.engineFolderPath = folderPath;
    }

    var engine = {};
    engine.loading = true;
    engine.gameTitle = title;
    engine.scale = { x: 1, y: 1 };
    engine.resizeScale = {x: engine.scale.x, y: engine.scale.y};
    engine.originalScale = {x: engine.scale.x, y: engine.scale.y};
    
    engine.canvas = document.createElement('canvas');
    engine.canvas.oncontextmenu = function() { return false; };
    engine.canvas.onclick = function() 
    {
        Engine.selectedGame = engine.gameTitle;
        engine.unpauseGame();
    };
    
    engine.canvas.id = engine.gameTitle;
    engine.canvas.width = Engine.currentGame[engine.gameTitle].resolution.x;
    engine.canvas.height = Engine.currentGame[engine.gameTitle].resolution.y;
    engine.canvas.style.border = "1px solid";
    
    engine.canvasInitialized = false;
    engine.canvasLocation = canvasParent || 'body';
    engine.oldScene = null;
    engine.maxFrameTime = 100;
    
    engine.scriptsPreloading = 0;
    engine.scriptsLoaded = 0;
    
    engine.assetsPreloading = 0;
    engine.assetsLoaded = 0;
    
    engine.input = null;
    
    $.getScript(Engine.engineFolderPath + "Input.js", function()
    {
        engine.input = new Input(engine, engine.canvas);
    });
    
    scheduleFrame = function(callback) 
    {
        return window.requestAnimationFrame(callback);
    };
    
    cancelFrame = function(loop)
    {
        window.cancelAnimationFrame(loop);
    };
    
    gameLoop = function(engine)
    {
        engine.lastFrame = new Date().getTime();
        engine.loop = true;
        engine.currentFrame = 0;
        
        engine.gameLoopCallback = function()
        {
            var now = new Date().getTime();
            engine.currentFrame++;
            engine.loop = scheduleFrame(engine.gameLoopCallback);
            var dt = now - engine.lastFrame;
            if(dt > engine.maxFrameTime) { dt = engine.maxFrameTime; }
            
            Engine.currentGame[engine.gameTitle].currentScene.Update(engine.input, dt/1000);
            Draw(engine.canvas.getContext('2d'), engine);
            if(engine.input !== null && engine.gameTitle === Engine.selectedGame) 
            {
                if(engine.input.keyboard.keyPressed(KEY_CODE.PLUS)) Engine.SetAudioVolume((Engine.audioVolume + 0.1));
                if(engine.input.keyboard.keyPressed(KEY_CODE.SUBTRACT)) Engine.SetAudioVolume((Engine.audioVolume - 0.1));
                engine.input.Update(engine.input, dt/1000);
            }
            engine.lastFrame = now;
            if(engine.gameTitle !== Engine.selectedGame)
            {
                var context = engine.canvas.getContext('2d');
                context.save();
                context.fillStyle = "rgba(0,0,0,0.6)";
                context.fillRect(0, 0, Engine.currentGame[engine.gameTitle].originalResolution.x, Engine.currentGame[engine.gameTitle].originalResolution.y);
                context.restore();
                engine.pauseGame();
            }
        };
        scheduleFrame(engine.gameLoopCallback);
    };
    
    engine.Start = function(scene)
    {
        if(engine.loading) 
        { 
            console.log("please use the onloaded function to start up");
            return;
        }
        if(scene instanceof Scene)
        {
            Engine.currentGame[engine.gameTitle].currentScene = scene;
            gameLoop(engine);
        }else
        {
            console.log("the scene has to be an instance of Scene");
            return false;
        }
    };
    
    engine.onLoaded = function(callback)
    {
        if(!engine.canvasInitialized)
        {
            engine.canvasInitialized = true;
            if(engine.canvasLocation !== 'body' && document.getElementById(engine.canvasLocation))
            {
                document.getElementById(engine.canvasLocation).appendChild(engine.canvas);
            }else
            {
                (document.getElementsByTagName('body')[0]).appendChild(engine.canvas);
            }
        }
        
        if(engine.input === null || engine.scriptsLoaded < engine.scriptsPreloading || engine.assetsLoaded < engine.assetsPreloading)
        {
            if(Engine.currentGame[engine.gameTitle].loadingScene === null)
            {
                Engine.currentGame[engine.gameTitle].loadingScene = new function()
                {
                    var loadedFiles = 0;
                    var totalFiles = 0;
                    this.Update = function()
                    {
                        totalFiles = engine.scriptsPreloading + engine.assetsPreloading;
                        loadedFiles = engine.scriptsLoaded + engine.assetsLoaded;
                    };
                    
                    this.Draw = function(context)
                    {
                        context.clearRect(0,0, Engine.currentGame[engine.gameTitle].resolution.x * engine.resizeScale.x, Engine.currentGame[engine.gameTitle].resolution.y * engine.resizeScale.y);
                        context.fillStyle = "#000";
                        context.save();
                        context.scale(engine.scale.x * engine.resizeScale.x, engine.scale.y * engine.resizeScale.y);
                                        
                        context.fillStyle = "black";
                        context.fillRect(0, 0, Engine.currentGame[engine.gameTitle].originalResolution.x, Engine.currentGame[engine.gameTitle].originalResolution.y);
                        context.font = "12px Arial";
                        context.fillStyle = "white";
                        context.fillText("Loading files: " + loadedFiles + "/" + totalFiles, (Engine.currentGame[engine.gameTitle].originalResolution.x / 2) - 60, (Engine.currentGame[engine.gameTitle].originalResolution.y / 2));
                        context.fillRect(Engine.currentGame[engine.gameTitle].originalResolution.x / 20, (Engine.currentGame[engine.gameTitle].originalResolution.y / 2) + 20, Engine.currentGame[engine.gameTitle].originalResolution.x - (Engine.currentGame[engine.gameTitle].originalResolution.x / 10), (Engine.currentGame[engine.gameTitle].originalResolution.y / 20));
                        context.fillStyle = "black";
                        context.fillRect(Engine.currentGame[engine.gameTitle].originalResolution.x / 20 + 2, (Engine.currentGame[engine.gameTitle].originalResolution.y / 2) + 22, Engine.currentGame[engine.gameTitle].originalResolution.x - (Engine.currentGame[engine.gameTitle].originalResolution.x / 10) - 5, (Engine.currentGame[engine.gameTitle].originalResolution.y / 20) - 5);
                        context.fillStyle = "white";
                        context.fillRect(Engine.currentGame[engine.gameTitle].originalResolution.x / 20 + 2, (Engine.currentGame[engine.gameTitle].originalResolution.y / 2) + 22, (Engine.currentGame[engine.gameTitle].originalResolution.x - (Engine.currentGame[engine.gameTitle].originalResolution.x / 10) - 5) * (loadedFiles / totalFiles), (Engine.currentGame[engine.gameTitle].originalResolution.y / 20) - 5);

                        context.restore();
                    };
                };
            }
            Engine.currentGame[engine.gameTitle].loadingScene.Update();
            Engine.currentGame[engine.gameTitle].loadingScene.Draw(engine.canvas.getContext('2d'));
            scheduleFrame(engine.onLoaded.bind(this, callback));
            return;
        }
        
        engine.loading = false;
        callback();
    };
    
    function Draw(context, engine)
    {
        context.clearRect(0,0, Engine.currentGame[engine.gameTitle].resolution.x * engine.resizeScale.x, Engine.currentGame[engine.gameTitle].resolution.y * engine.resizeScale.y);
        context.fillStyle = "#000";
        context.save();
        context.scale(engine.scale.x * engine.resizeScale.x, engine.scale.y * engine.resizeScale.y);
        
        Engine.currentGame[engine.gameTitle].currentScene.Draw(engine.canvas.getContext('2d'));
        
        context.restore();
    }
    
    engine.pauseGame = function()
    {
        if(engine.loop)
        {
            cancelFrame(engine.loop);
        }
        engine.loop = null;
    };
    
    engine.unpauseGame = function()
    {
        if(!engine.loop)
        {
            engine.lastFrame = new Date().getTime();
            engine.loop = scheduleFrame(engine.gameLoopCallback);
        }
    };
    
    Engine.isString = function(obj)
    {
        return typeof obj === "string";
    };
    
    Engine.isArray = function(obj)
    {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    
    Engine.isNumber = function(obj)
    {
        return Object.prototype.toString.call(obj) === '[object Number]';
    };
    
    Engine.isFunction = function(obj)
    {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };
    
    Engine.isObject = function(obj)
    {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };
    
    Engine.isUndefined = function(obj)
    {
        return obj === void 0;
    };
    
    Engine.normalizeArg = function(arg)
    {
        if(Engine.isString(arg))
        {
            arg = arg.replace(/\s+/g, '').split(",");
        }
        if(!Engine.isArray(arg))
        {
            arg = [arg];
        }
        return arg;
    };
    
    Engine.SetAudioVolume = function(volume)
    {
        if(!Engine.isNumber(volume))
        {
            volume = 1;
        }else if(volume > 1)
        {
            volume = 1;
        }else if(volume < 0)
        {
            volume = 0;
        }
        Engine.audioVolume = volume;
        
        for(var game in Engine.currentGame)
        {
            for(var audioFile in Engine.currentGame[game].gameAudio)
            {
                var audio = Engine.currentGame[game].gameAudio[audioFile];
                audio.file.volume = audio.volume * Engine.audioVolume;
            }
        }
    };
    
    Engine.PlayAudio = function(gameTitle, audio, volume)
    {
        if(!Engine.isUndefined(Engine.currentGame[gameTitle]))
        {
            if(!Engine.isUndefined(Engine.currentGame[gameTitle].gameAudio[audio]))
            {
                if(!Engine.isNumber(volume))
                {
                    volume = 1;
                }else if(volume > 1)
                {
                    volume = 1;
                }else if(volume < 0)
                {
                    volume = 0;
                }
                var audioFile = Engine.currentGame[gameTitle].gameAudio[audio];
                audioFile.volume = volume;
                audioFile.file.volume = (volume * Engine.audioVolume);
                audioFile.file.play();
            }else
            {
                console.log("No audio found under the name: " + audio);
            }
        }else
        {
            console.log("No game found under the name: " + gameTitle);
        }
    };
    
    Engine.StopAudio = function(gameTitle, audio)
    {
        if(!Engine.isUndefined(Engine.currentGame[gameTitle]))
        {
            if(!Engine.isUndefined(Engine.currentGame[gameTitle].gameAudio[audio]))
            {
                var audioFile = Engine.currentGame[gameTitle].gameAudio[audio];
                audioFile.file.pause();
                audioFile.file.currentTime = 0;
            }else
            {
                console.log("No audio found under the name: " + audio);
            }
        }else
        {
            console.log("No game found under the name: " + gameTitle);
        }
    };
    
    Engine.StopAllGameAudio = function(gameTitle)
    {
        for(var audioFile in Engine.currentGame[gameTitle].gameAudio)
        {
            var audio = Engine.currentGame[gameTitle].gameAudio[audioFile];
            audio.file.pause();
            audio.file.currentTime = 0;
        }
    };
    
    Engine.StopAllAudio = function()
    {
        for(var game in Engine.currentGame)
        {
            for(var audioFile in Engine.currentGame[game].gameAudio)
            {
                var audio = Engine.currentGame[game].gameAudio[audioFile];
                audio.file.pause();
                audio.file.currentTime = 0;
            }
        }
    };
    
    function normalizeAssets(arg)
    {
        var assetArray = {};
        assetArray.images = {};
        assetArray.audio = {};
        arg = Engine.normalizeArg(arg);
        
        for(var i = 0; i < arg.length; i++)
        {
            if(arg[i].indexOf(":") !== -1)
            {
                var subArray = arg[i].split(":");
                switch(subArray[1].split(".")[1])
                {
                    case "png":
                    case "jpeg":
                    case "jpg":
                        if(!Engine.isUndefined(assetArray.images[subArray[0]]))
                        {
                            console.log("Warning: asset with duplicate name," + subArray[0] + " " + subArray[1] + " asset not loaded");
                        }else
                        {
                            assetArray.images[subArray[0]] = subArray[1];
                        }
                        break;
                    case "mp3":
                    case "wav":
                    case "ogg":
                        if(!Engine.isUndefined(assetArray.audio[subArray[0]]))
                        {
                            console.log("Warning: asset with duplicate name," + subArray[0] + " " + subArray[1] + " asset not loaded");
                        }else
                        {
                            assetArray.audio[subArray[0]] = subArray[1];
                        }
                        break;
                }
                
            }else
            {
                console.log("Error: assets are invalid");
                return false;
            }
        }
        
        return assetArray;
    };
    
    engine.Resize = function(newResolution)
    {
        var scale = { x: newResolution.x / Engine.currentGame[engine.gameTitle].resolution.x,
                      y: newResolution.y / Engine.currentGame[engine.gameTitle].resolution.y };
        engine.resizeScale = scale;
        engine.canvas.width = newResolution.x;
        engine.canvas.height = newResolution.y;
        Engine.currentGame[this.gameTitle].resolution = { x: newResolution.x, y: newResolution.y };
    };
    
    engine.ZoomIn = function(scale)
    {
        engine.originalScale = {x: engine.scale.x, y: engine.scale.y};;
        if(scale.hasOwnProperty("x") && scale.hasOwnProperty("y"))
        {
            engine.scale = {x: scale.x, y: scale.y};;
        }else if($.isNumeric(scale))
        {
            engine.scale.x = scale;
            engine.scale.y = scale;
        }
    };
    
    engine.ZoomOut = function()
    {
        engine.scale = {x: engine.originalScale.x, y: engine.originalScale.y };
    };
    
    engine.switchScene = function(scene, keepScene)
    {
        engine.pauseGame();
        if(keepScene)
        {
            engine.oldScene = Engine.currentGame[engine.gameTitle].currentScene;
        }
        Engine.currentGame[engine.gameTitle].currentScene = scene;
        engine.unpauseGame();
    };
    
    engine.switchOldScene = function(keepScene)
    {
        if(engine.oldScene !== null)
        {
            engine.switchScene(engine.oldScene, keepScene);
        }else
        {
            return false;
        }
    };
    
    engine.PreloadScripts = function(scripts)
    {
        scripts  = Engine.normalizeArg(scripts);
        
        if(scripts !== false)
        {
            for(var i = 0; i < scripts.length; i++)
            {
                engine.scriptsPreloading++;
                $.getScript(scripts[i], function()
                {
                    engine.scriptsLoaded++;
                });
            }
        }else
        {
            console.log("Error: loading scripts failed");
            return false;
        }
    };
    
    engine.PreloadAssets = function(assets)
    {
        assets = normalizeAssets(assets);
        
        if(assets !== false)
        {
            for(var key in assets.images)
            {
                Engine.currentGame[engine.gameTitle].gameAssets[key] = loadImage(assets.images[key], key);
            }
            for(var key in assets.audio)
            {
                Engine.currentGame[engine.gameTitle].gameAudio[key] = loadAudio(assets.audio[key], key);
            }
        }else
        {
            console.log("Error: loading assets failed");
            return false;
        }
    };
    
    function loadAudio(soundUrl, key)
    {
        engine.assetsPreloading++;
        var audio = {};
        audio.file = new Audio(soundUrl);
        audio.file.onloadeddata = function()
        {
            engine.assetsLoaded++;
        };
        audio.volume = 1;
        
        return audio;
    }
    
    function loadImage(imageUrl, key)
    {
        engine.assetsPreloading++;
        var image = new Image();
        image.name = image.alt = key;
        image.onload = function()
        {
            engine.assetsLoaded++;
        };
        image.src = imageUrl;
        
        return image;
    }
    engine.PreloadScripts([Engine.engineFolderPath + "ExtendedMath.js", Engine.engineFolderPath + "ClassExtensions.js", Engine.engineFolderPath + "Sprite.js", Engine.engineFolderPath + "Animation.js", Engine.engineFolderPath + "Collision.js", Engine.engineFolderPath + "GameObject.js", Engine.engineFolderPath + "Scene.js", Engine.engineFolderPath + "Particle.js", Engine.engineFolderPath + "Emitter.js", Engine.engineFolderPath + "ReadTextFile.js"]);
    
    return engine;
};