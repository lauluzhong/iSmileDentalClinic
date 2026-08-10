import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    // The contextual CTA prompt lives at the bottom of the screen on mobile,
    // exactly where the sticky action bar sits, so the bar needs to know.
    const [isPromptOpen, setPromptOpen] = useState(false);
    const [prefillData, setPrefillData] = useState({
        experience: '',
        sourceButton: '',
        sourcePage: ''
    });

    const openBooking = (initialExperience = '', sourceButton = '', sourcePage = '') => {
        setPrefillData({ 
            experience: initialExperience,
            sourceButton: sourceButton,
            sourcePage: sourcePage || window.location.pathname
        });
        setIsBookingOpen(true);
    };
    
    const closeBooking = () => {
        setIsBookingOpen(false);
    };

    return (
        <BookingContext.Provider value={{ isBookingOpen, prefillData, openBooking, closeBooking, isPromptOpen, setPromptOpen }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
