# MP3 to MIDI Converter - Frontend Client

This is the React frontend for the MP3 to MIDI converter application. It is built with Vite and styled with Tailwind CSS.

## Prerequisites

-   **Node.js** (v14 or higher)
-   **npm** (comes with Node.js)

## Setup

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Client

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open in Browser:**
    The application will be available at `http://localhost:5173`.

## Features

-   **Drag & Drop Upload:** Easily upload MP3, WAV, FLAC, or M4A files.
-   **Audio Preview:** Listen to the uploaded audio file.
-   **Real-time Conversion:** Visual feedback during the conversion process.
-   **MIDI Download:** Download the converted MIDI file immediately.

## Configuration

The application expects the backend server to be running at `http://localhost:8000`.
If you need to change this, update the API URL in `src/App.jsx`.
