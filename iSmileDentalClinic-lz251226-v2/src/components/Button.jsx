import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
    const baseClass = 'btn';
    const variantClass = variant === 'outline' ? 'btn-outline' : 'btn-primary';

    return (
        <button className={`${baseClass} ${variantClass} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
