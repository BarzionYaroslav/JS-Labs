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

let sldCube;
let sldVol;
let sldSpd;
let sldLine;

let cubeTxt;
let volTxt;
let spdTxt;
let lineTxt;

let marisa;

function soundInit()
{
	isReady = true;
}

function preload() {
	soundFormats('mp3', 'wav');
	isReady = false;
	
	sample = loadSound('assets/audio.mp3', soundInit);
    marisa = loadImage('assets/th02Marisa.png')
	sample.setVolume(0.75);
	noiseStep = 0.01;
	progress = 0;
	rot = 0;
}

function setup()
{
	createCanvas(1024, 1024);
	stroke(255);
	noFill();

	textAlign(CENTER);
	textSize(32);
	fft = new p5.FFT();
    
    startX = 0;
    startY = height-height/10;
    spectrumWidth = width;
    
    sldVol = createSlider(0, 1, 0.75, 0.05)
    sldVol.size(256)
    sldVol.position(width+10,10)
    volTxt = createDiv('Volume')
    volTxt.position(width+280,10)
    
    sldSpd = createSlider(0, 2, 1, 0.25)
    sldSpd.size(256)
    sldSpd.position(width+10,30)
    spdTxt = createDiv('Speed')
    spdTxt.position(width+280,30)
    
    sldCube = createSlider(100, 200, 150, 5)
    sldCube.size(256)
    sldCube.position(width+10,50)
    cubeTxt = createDiv('Square Movement')
    cubeTxt.position(width+280,50)
    
    sldLine = createSlider(100, 800, 300, 10)
    sldLine.size(256)
    sldLine.position(width+10,70)
    lineTxt = createDiv('Line Movement')
    lineTxt.position(width+280,70)
    
}

function noiseLine(energy)
{
	push();
	translate(width/2, height/2);
	noFill();
	stroke(0, 255, 100);
	strokeWeight(4);
	beginShape();
	for(let i = 0; i < 100; i++)
	{
		let x = map(noise(i * noiseStep + progress), 0, 1, -sldLine.value(), sldLine.value());
		let y = map(noise(i * noiseStep + progress + 200), 0, 1, -sldLine.value(), sldLine.value());

		vertex(x, y);
	}
	endShape();

	if (energy > 20)
		progress += 0.05;
	pop();
}

function rotatingBlocks(energy)
{
	if (energy > sldCube.value())
		rot += 0.01;

	let tmp = map(energy, 0, 255, 20, 100);

	push();
	rectMode(CENTER);
	translate(width/2, height/2);
	rotate(rot);
	fill(255, 100, 0);

	let incr = width / 6;

	for(let i = 0; i < 7; i++)
		image(marisa, i * incr - width/2 - tmp, -tmp, tmp*2, tmp*2);

	pop();
}

function draw()
{
	fft.analyze();
    
    background(0);

	let bass = fft.getEnergy("bass");
	let treble = fft.getEnergy("treble");
    
    rotatingBlocks(bass);
	noiseLine(treble);
    push()
    
    if(frameCount % 2 == 0) 
            addWave();
    stroke(0, 150, 0);
    strokeWeight(4)
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
    sample.setVolume(sldVol.value())
    sample.rate(sldSpd.value())

}

function mousePressed(){
    if (!sample.isPlaying())
        sample.loop();
}

function addWave(){
    let tmp = fft.waveform();
    let small_scale = 120, bigScale = 120;
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