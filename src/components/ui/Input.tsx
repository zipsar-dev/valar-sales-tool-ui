import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const inputClasses = clsx(
    'block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm placeholder-neutral-500 shadow-sm transition-colors',
    'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
    'dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400',
    'dark:focus:border-primary-400 dark:focus:ring-primary-400',
    'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 dark:disabled:bg-neutral-800',
    {
      'border-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-600': error,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
    },
    className
  );

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400 dark:text-neutral-500">
            {leftIcon}
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400 dark:text-neutral-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {helper}
        </p>
      )}
    </div>
  );
};

export default Input;