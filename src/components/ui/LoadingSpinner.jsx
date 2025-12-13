import React from 'react';
import logo from '@/assets/logo-light.svg';

const LoadingSpinner = ({ size = "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" }) => {
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

