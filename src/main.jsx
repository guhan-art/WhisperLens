import React from 'react'
import { createRoot } from 'react-dom/client'
import WhisperLens from './WhisperLens'
import './index.css'

function App(){
  return <WhisperLens />
}

createRoot(document.getElementById('root')).render(<App />)
