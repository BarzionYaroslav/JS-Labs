let vid;
let isInitialised;
let isLoadedV = false;
let isLoadedA = false;
let pause;
let aud;

let output = [];
let startX;
let startY;
let spectrumWidth;

let fft;

function preload()
{
    vid = createVideo('assets/video.mp4', () =>{
        console.log("video is loaded!");
        isLoadedV = true;
    });
    aud = loadSound('assets/video.mp4', () =>{
        console.log("audio is loaded!");
        isLoadedA = true;
    });
    isInitialised = false; 
    vid.volume(0);
    vid.hide()
    outputVolume(0.6)
    pause = true
}


function setup()
{
    createCanvas(640, 360);
    startX = 0;
    startY = height-height/10;
    spectrumWidth = width;
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
        
        stroke(0, 150, 0);
        strokeWeight(4)
        if(frameCount % 2 == 0) 
            addWave();
    
        for (let i = 0; i < output.length; i++)
        {
            let tmp = output;
            noFill();
            beginShape();
            for(let j = 0; j < tmp.length; j++)
            {
                vertex(tmp[j].x, tmp[j].y);
            }
            endShape();
        }
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

function addWave(){
    let tmp = fft.waveform();
    let small_scale = 40, bigScale = 40;
    let wape_output = [];
    let x, y;
    for(let i = 0; i < tmp.length; i++)
    {
        if (i % 20 == 0)
        {
            x = map(i, 0, 1024, startX, startX + spectrumWidth);
            y = map(tmp[i], -1, 1, -bigScale, bigScale);
            if(i < 1024 * 1/4 || i > 1024 * 3/4)
                y = map(tmp[i], -1, 1, -small_scale, small_scale);
            else
                y = map(tmp[i], -1, 1, -bigScale, bigScale);
            wape_output.push({x: x, y: startY + y});
        }
    }
    output=wape_output;
}