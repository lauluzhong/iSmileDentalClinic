import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [prefillData, setPrefillData] = useState({ experience: '' });

    const openBooking = (initialExperience = '') => {
        setPrefillData({ experience: initialExperience });
        setIsBookingOpen(true);
    };
    
    const closeBooking = () => {
        setIsBookingOpen(false);
        // Optional: clear prefill data on close or keep it. 
        // Typically clearing it or resetting it when opening is better.
        // We reset it on open, so this is fine.
    };

    return (
        <BookingContext.Provider value={{ isBookingOpen, prefillData, openBooking, closeBooking }}>
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
