import React from 'react';
import Style from './Style';

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      width: '100%'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderLeftColor: '#0070f3',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <Style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</Style>
    </div>
  );
};

export default Loader;