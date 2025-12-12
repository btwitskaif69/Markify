import React from 'react';
import logo from '@/assets/logo-light.svg';

const LoadingSpinner = ({ size = "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className={`${size} bg-primary rounded-full flex items-center justify-center animate-spin`}>
                <img
                    src={logo}
                    alt="Loading..."
                    className="w-2/3 h-2/3"
                />
            </div>
        </div>
    );
};

export default LoadingSpinner;

