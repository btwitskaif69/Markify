'use client';
import React, { useState, useMemo } from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';

// Constants
const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!-\/:-@[-`{-~]/, text: 'At least 1 special characters' }
];

const STRENGTH_CONFIG = {
  colors: {
    0: 'bg-border',
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-amber-500',
    4: 'bg-amber-700',
    5: 'bg-emerald-500'
  },

  texts: {
    0: 'Enter a password',
    1: 'Weak password',
    2: 'Medium password!',
    3: 'Strong password!!',
    4: 'Very Strong password!!!'
  }
};

const PasswordInput = ({ value, onChange, id = "password", placeholder = "Password" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const calculateStrength = useMemo(() => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(value || ''),
      text: req.text,
    }));

    return {
      score: requirements.filter((req) => req.met).length,
      requirements,
    };
  }, [value]);

  return (
    <div className='w-full'>
      {/* Label is handled by parent or omitted for flexibility */}
      <div className='relative'>
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={calculateStrength.score < 4}
          aria-describedby='password-strength'
          className='w-full p-2 border rounded-md bg-background outline-none focus:ring-1 focus:ring-ring border-input pr-10'
        />
        <button
          type='button'
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className='absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground outline-none'
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Strength Bars */}
      <div className='flex gap-2 w-full justify-between mt-2 h-1'>
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={`${calculateStrength.score >= level ? STRENGTH_CONFIG.colors[calculateStrength.score] : 'bg-muted'
              } rounded-full w-full transition-colors duration-300`}
          ></span>
        ))}
      </div>

      {/* Strength Text */}
      <p
        id='password-strength'
        className='my-2 text-xs font-medium flex justify-between text-muted-foreground'
      >
        <span>
          {value && value.length > 0 ? STRENGTH_CONFIG.texts[Math.min(calculateStrength.score, 4)] : ""}
        </span>
      </p>

      {/* Requirements List */}
      <ul className='space-y-1' aria-label='Password requirements'>
        {calculateStrength.requirements.map((req, index) => (
          <li key={index} className='flex items-center space-x-2'>
            {req.met ? (
              <Check size={14} className='text-emerald-500' />
            ) : (
              <X size={14} className='text-muted-foreground/80' />
            )}
            <span
              className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'
                }`}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordInput;
