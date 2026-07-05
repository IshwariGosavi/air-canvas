# Air Canvas 🎨

Draw in the air using just your index finger and a webcam — no mouse, no touchscreen. Built with real-time hand tracking, this project turns finger movement into an actual drawing canvas.

🔗 **Live Demo:** [air-cnvs.netlify.app](https://air-cnvs.netlify.app/)

>  Allow camera access when prompted, and make sure you're in decent lighting for best hand detection.

## Features

- Real-time hand tracking using your webcam — no external hardware or gloves needed
- Draw by moving your index finger through the air
- **Pinch-to-pause**: bring your thumb and index finger together to lift your "pen" without drawing
- 20-color palette to choose from
- Eraser tool
- Clear canvas button

## Tech Stack

- **Hand tracking**: [MediaPipe Hands](https://developers.google.com/mediapipe) — a pre-trained machine learning model for real-time hand landmark detection
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Rendering**: HTML5 Canvas API
- **Deployment**: Netlify

## How It Works

1. The browser accesses the webcam via the `getUserMedia` API
2. Each video frame is sent to MediaPipe Hands, which detects 21 hand landmark coordinates in real time
3. The index fingertip's position is tracked frame-by-frame, and consecutive positions are connected with lines to create the drawing effect
4. The distance between the thumb tip and index fingertip is calculated to detect a pinch gesture, which pauses drawing
5. Two separate canvases are used — one for the permanent drawing (never cleared) and one for a live cursor indicator (cleared and redrawn every frame) — to avoid the cursor dot leaving a smeared trail

## Running Locally

1. Clone this repo
2. Open `index.html` using a local server (e.g., VS Code's Live Server extension) — webcam access requires the page to be served over `http://`, not opened directly as a file
3. Allow camera access when prompted

## Future Improvements

- Adjustable brush size
- Save/download drawings as an image
- User accounts to save drawings to a personal gallery (with a backend + database)
- Support for additional gestures (e.g., two-finger gesture for a different tool)
