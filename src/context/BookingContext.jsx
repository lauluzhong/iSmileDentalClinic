import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    // The contextual CTA prompt lives at the bottom of the screen on mobile,
    // exactly where the sticky action bar sits, so the bar needs to know.
    const [isPromptOpen, setPromptOpen] = useState(false);
    // Any other page dialog (e.g. the full-review modal on /reviews). The CTA
    // prompt must not fire over it, and should step aside if it is showing.
    const [isDialogOpen, setDialogOpen] = useState(false);
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
        <BookingContext.Provider value={{ isBookingOpen, prefillData, openBooking, closeBooking, isPromptOpen, setPromptOpen, isDialogOpen, setDialogOpen }}>
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
