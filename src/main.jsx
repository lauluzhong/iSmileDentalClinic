import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <BookingProvider>
                <App />
            </BookingProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
