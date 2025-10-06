import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import QueenPuzzle from './App.jsx'
import board from './game-1.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueenPuzzle {...board} />
  </StrictMode>,
)
