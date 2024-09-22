let vid; // Переменная где будет находится аудио-дорожка
let isInitialised; // Состояние, которое обозначает инициализированы ли значения или нет
let isLoadedV = false;
let isLoadedA = false;
let amplitude;
let amplitudes = [];
let pause;
let aud;

let fft;

function preload()
{
    vid = createVideo('assets/FruitofLowQuality.mp4', () =>{
        console.log("video is loaded!");
        isLoadedV = true;
    });
    aud = loadSound('assets/FruitofLowQuality.mp4', () =>{
        console.log("audio is loaded!");
        isLoadedA = true;
    });
    isInitialised = false; 
    vid.volume(0);
    vid.hide()
    outputVolume(0.2)
    pause = true
}


function setup()
{
    createCanvas(1200, 900);
    textAlign(CENTER); // Центрируем следующий текст по центру
    textSize(32);
    
    amplitude = new p5.Amplitude();
    
    for (let i = 0; i < 512; i++)
        amplitudes.push(0);
    
    fft = new p5.FFT();
}

function draw()
{
    background(0);
    fill(255);
    
    if (isInitialised && pause)
        text("Press any key for play sound", width/2, height/2);
    else if (!pause)
    {
        image(vid, 0, 0, width, height)
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text(level, width/2, 40);
        
        let freqs = fft.analyze();
        
        stroke(0, 150, 0);
        strokeWeight(4)
        for(let i = 0; i < freqs.length; i+=5)
            line(6 + i * 1200/freqs.length, height, 6 + i * 1200/freqs.length, height - ((freqs[i]+freqs[i+1]+freqs[i+2]+freqs[i+3]+freqs[i+4])/5) * 3);
        
       
        noStroke();
        
    
        
    }
        
}

function keyPressed()
{
    if (!isInitialised)
    {
        isInitialised = true;
        
        
        let r = map(mouseX, 0, width, 0.5, 4.0);
        if (isLoadedA && isLoadedV)
            {
            vid.loop(0, 1);
            aud.loop(0, 1)
            pause=false
            }
    }
    else
    {
        if (key == ' ')
        {
            if (pause)   
            {
                vid.play() 
                aud.play()
                pause=false
            }
            else                    
            {
                vid.pause();
                aud.pause();
                pause=true
            }
        }
    }
}