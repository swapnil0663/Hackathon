import React from 'react';
import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'white',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: 'white',
          },
          style: {
            border: '1px solid #10b981',
            background: '#f0fdf4',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
          style: {
            border: '1px solid #ef4444',
            background: '#fef2f2',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: 'white',
          },
          style: {
            border: '1px solid #3b82f6',
            background: '#eff6ff',
          },
        },
      }}
    />
  );
};

export default Toast;