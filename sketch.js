let mic, fft, capture;
let radius = 50; // 초기 원 크기
let centerY;
let waveThreshold = 0.05;

function setup() {
  createCanvas(640, 480);

  // 웹캠 세팅
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  // 마이크 세팅
  mic = new p5.AudioIn();
  mic.start();

  // FFT (파형 분석기)
  fft = new p5.FFT();
  fft.setInput(mic);

  centerY = height - 100; // 원과 파형의 y위치 조정
}

function draw() {
  background(255);

  // 1. 웹캠 영상 (제일 아래)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  pop();

  // 마이크 입력과 파형
  let vol = mic.getLevel();
  let idlePulse = 1.5 * sin(frameCount * 0.1); // 로딩 느낌
  let targetSize = vol > 0.01 ? vol * 500 : 60 + idlePulse;
  let smoothVol = lerp(radius, targetSize, 0.05);
  let volChange = abs(smoothVol - radius);
  let waveform = fft.waveform();

  // 2. 파동 그래프 (중간)
  waveform = fft.waveform(); // 파형 업데이트
  stroke(180);
  strokeWeight(5);
  noFill();
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width); // 너비
    let y = map(waveform[i], -1, 1, -50, 50); // 높이
    vertex(x + 10, y + centerY); // 왼쪽 아래 기준
  }
  endShape();

  // 3. 감정 원 (제일 위)
let minVol = 60;
let midVol = 65;
let maxVol = 80;

let fromColor = color("#D7E9F7"); // 파란색
let midColor  = color("#B150C2"); // 보라색
let toColor   = color("#E63946"); // 빨간색

let t;
let circleColor;

// 파란색은 작은 소리일 때 유지
if (smoothVol < minVol) {
  circleColor = fromColor;
} 
else if (smoothVol < midVol) {
  t = constrain((smoothVol - minVol) / (midVol - minVol), 0, 1);
  circleColor = lerpColor(fromColor, midColor, t);
} else {
  t = constrain((smoothVol - midVol) / (maxVol - midVol), 0, 1);
  circleColor = lerpColor(midColor, toColor, t);
}





  fill(circleColor);
  noStroke();
  ellipse(100, centerY, smoothVol, smoothVol); // 왼쪽 아래

  radius = smoothVol; // 이전 값 저장
}