import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import { HelmetProvider } from 'react-helmet-async'

const container = document.getElementById('root')

const tree = (
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <BookingProvider>
                    <App />
                </BookingProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)

// The homepage ships pre-rendered markup inside #root (see
// scripts/prerender-home.js), so it hydrates: React adopts the DOM that is
// already painted instead of rebuilding it, and nothing on screen changes.
// Every other route is served the empty shell and mounts the normal way.
if (container.firstChild) {
    ReactDOM.hydrateRoot(container, tree)
} else {
    ReactDOM.createRoot(container).render(tree)
}
