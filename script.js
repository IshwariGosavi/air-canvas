const video = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const canvasCtx = canvasElement.getContext('2d');
const cursorCanvas = document.getElementById('cursorCanvas');
const cursorCtx = cursorCanvas.getContext('2d');

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

let prevX = null;
let prevY = null;
let currentColor = '#4DB8FF';
let isErasing = false;

hands.onResults((results) => {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const indexFingertip = landmarks[8];
    const thumbTip = landmarks[4];

    const x = indexFingertip.x * canvasElement.width;
    const y = indexFingertip.y * canvasElement.height;

    const thumbX = thumbTip.x * canvasElement.width;
    const thumbY = thumbTip.y * canvasElement.height;
    const distance = Math.sqrt((x - thumbX) ** 2 + (y - thumbY) ** 2);

    const isPinching = distance < 40;

    if (!isPinching) {
      if (prevX !== null && prevY !== null) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(prevX, prevY);
        canvasCtx.lineTo(x, y);

        if (isErasing) {
          canvasCtx.globalCompositeOperation = 'destination-out';
          canvasCtx.lineWidth = 30;
        } else {
          canvasCtx.globalCompositeOperation = 'source-over';
          canvasCtx.strokeStyle = currentColor;
          canvasCtx.lineWidth = 4;
        }
        canvasCtx.lineCap = 'round';
        canvasCtx.stroke();
      }
      prevX = x;
      prevY = y;

      cursorCtx.beginPath();
      cursorCtx.arc(x, y, 8, 0, 2 * Math.PI);
      cursorCtx.fillStyle = isErasing ? 'white' : currentColor;
      cursorCtx.fill();
    } else {
      prevX = null;
      prevY = null;

      cursorCtx.beginPath();
      cursorCtx.arc(x, y, 8, 0, 2 * Math.PI);
      cursorCtx.fillStyle = 'orange';
      cursorCtx.fill();
    }
  } else {
    prevX = null;
    prevY = null;
  }
});

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480
    });

    camera.start();
  })
  .catch((err) => {
    console.error('Webcam access error:', err);
    alert('Could not access webcam. Please allow camera permission and refresh.');
  });

const swatches = document.querySelectorAll('.swatch');
swatches.forEach((swatch) => {
  swatch.addEventListener('click', () => {
    currentColor = swatch.getAttribute('data-color');
    isErasing = false;
    eraserBtn.classList.remove('active');

    swatches.forEach((s) => s.classList.remove('active'));
    swatch.classList.add('active');
  });
});

const eraserBtn = document.getElementById('eraserBtn');
eraserBtn.addEventListener('click', () => {
  isErasing = !isErasing;
  eraserBtn.classList.toggle('active', isErasing);
});

const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', () => {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
});