import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageButton = () => {
  const { isEnglish, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
        backdropFilter: 'blur(10px)',
        minWidth: '45px',
        height: '35px'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        e.target.style.boxShadow = 'none';
      }}
      title={isEnglish ? 'Türkçe\'ye geç' : 'Switch to English'}
    >
      {isEnglish ? 'EN' : 'TR'}
    </button>
  );
};

export default LanguageButton; 