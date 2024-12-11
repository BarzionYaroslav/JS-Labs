let noiseStep;
let progress;

let isReady;
let sample;
let fft;
let rot;

let output = [];
let startX;
let startY;
let spectrumWidth;

let sldVol;
let sldSpd;

let BG;
let border;
let songs = [];
let choice;
let orb;

function soundInit()
{
	isReady = true;
}

function preload() {
	soundFormats('mp3', 'wav');
	isReady = false;
	
    songs = [{aud: loadSound('assets/songs/aud01.mp3'), name: "01. Pure Land Mandala"},
             {aud: loadSound('assets/songs/aud02.mp3'), name: "02. Hakurei ~ Eastern Wind"},
             {aud: loadSound('assets/songs/aud03.mp3'), name: "03. She's in a temper!!"},
             {aud: loadSound('assets/songs/aud04.mp3'), name: "04. End of Daylight"},
             {aud: loadSound('assets/songs/aud05.mp3'), name: "05. Power of Darkness"},
             {aud: loadSound('assets/songs/aud06.mp3'), name: "06. World of Empty Dreams"},
             {aud: loadSound('assets/songs/aud07.mp3'), name: "07. Bet on Death"},
             {aud: loadSound('assets/songs/aud08.mp3'), name: "08. Himorogi, Burn in Violet"},
             {aud: loadSound('assets/songs/aud09.mp3'), name: "09. Love-coloured Magic"},
             {aud: loadSound('assets/songs/aud10.mp3'), name: "10. A Phantom's Boisterous Dance"},
             {aud: loadSound('assets/songs/aud11.mp3'), name: "11. Complete Darkness"},
             {aud: loadSound('assets/songs/aud12.mp3'), name: "12. Extra Love"},
             {aud: loadSound('assets/songs/aud13.mp3'), name: "13. The Tank Girl's Dream"},
             {aud: loadSound('assets/songs/aud14.mp3'), name: "14. Forest of Tono"},
             {aud: loadSound('assets/songs/aud15.mp3'), name: "15. Legendary Wonderland"},
             {aud: loadSound('assets/songs/aud16.mp3'), name: "16. Hakurei Shrine Grounds"},
             {aud: loadSound('assets/songs/aud17.mp3'), name: "17. Sunfall"},
             {aud: loadSound('assets/songs/aud18.mp3'), name: "18. Sealed Demon's Finale"},
            ]
    choice = -4
	sample = -4
    border = loadImage('assets/border.png')
    orb = loadImage('assets/yinyang.png')
    BG = loadImage('assets/Background.png',soundInit)
	noiseStep = 0.01;
	progress = 0;
	rot = 0;
}

function setup()
{
    angleMode(DEGREES)
	createCanvas(640, 400);
	stroke(255);
	noFill();

	textAlign(LEFT);
	textSize(16);
	fft = new p5.FFT();
    
    startX = width-394 + 8;
    startY = height-32;
    spectrumWidth = 378;
    
    sldVol = createSlider(0, 1, 0.75, 0.05)
    sldVol.size(256)
    sldVol.position(width-354,height-84-8)
    
    sldSpd = createSlider(0, 2, 1, 0.25)
    sldSpd.size(256)
    sldSpd.position(width-354,height-104-8)
    
}

function draw()
{
	fft.analyze();
    
    background(64,0,64);

    image(BG, 0, 0)
    image(border, width-394, height-64)
    
    stroke(255,0,255)
    text('Volume',width-354+256,height-84)
    text('Speed',width-354+256,height-104)
    
    for (let i = 0; i < songs.length; i++)
        {
            if (i==choice)
                stroke(255,255,0)
            else
                stroke(255)
            text(songs[i].name, 6, 75+18*i)
        }
    
	let bass = fft.getEnergy("bass");
    push()
    translate(width-197,height-236)
    rotate(rot)
    image(orb, -(70.5+bass/10), -(70.5+bass/10),141+bass/4,141+bass/4)
    pop()
    
    push()
    
    if(frameCount % 2 == 0) 
            addWave();
    stroke(0, 150, 0);
    strokeWeight(3)
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
    pop()
    if (sample!=-4)
    {
        sample.setVolume(sldVol.value())
        sample.rate(sldSpd.value())
        if (sample.isPlaying())
            rot+=(1+bass/100)*sldSpd.value()
    }

}

function mousePressed(){
    for (let i = 0; i < songs.length; i++)
        {
            if (mouseY>=77+18*(i-1) && mouseY<=74+18*i && mouseX<256)
                {
                    choice = i
                    if (sample!=-4)
                        sample.stop()
                    sample=songs[choice].aud
                }
            if (sample!=-4)
                {
                    if (!sample.isPlaying())
                        sample.loop();
                }
        }
}

function addWave(){
    let tmp = fft.waveform();
    let small_scale = 32, bigScale = 48;
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