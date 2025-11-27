import { useState } from 'react'
import axios from 'axios'
import React from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [midiUrl, setMidiUrl] = useState(null)
  const [error, setError] = useState(null)
  const [audioPreview, setAudioPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setAudioPreview(URL.createObjectURL(selectedFile))
      setMidiUrl(null)
      setError(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setAudioPreview(URL.createObjectURL(droppedFile))
      setMidiUrl(null)
      setError(null)
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setMidiUrl(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('https://audiotomidi-server.onrender.com/api/v1/transcribe', formData, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      setMidiUrl(url)
    } catch (err) {
      console.error(err)
      const errorMessage = err.response?.data?.detail || 'An error occurred during conversion. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          MP3 to MIDI Converter
        </h1>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${file ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500'
            }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".mp3,.wav,.flac,.m4a"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="text-gray-300">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>Click or drag audio file here</p>
              <p className="text-xs mt-2 text-gray-500">MP3, WAV, FLAC, M4A</p>
            </div>
          )}
        </div>

        {audioPreview && (
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <audio controls src={audioPreview} className="w-full" />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-lg transition-all ${!file || loading
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </span>
          ) : (
            'Convert to MIDI'
          )}
        </button>

        {midiUrl && (
          <div className="mt-6 p-4 bg-green-900/30 border border-green-500/30 rounded-lg text-center animate-fade-in">
            <p className="text-green-400 font-medium mb-3">Conversion Complete!</p>
            <a
              href={midiUrl}
              download={`${file.name.split('.')[0]}.mid`}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download MIDI
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
