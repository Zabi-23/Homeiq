//src/pages/About.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 text-slate-700">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-5 right-5 text-xs font-semibold px-2 py-1 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition"
      >
        {i18n.language === 'sv' ? 'EN' : 'SV'}
      </button>

      {/* Title (same style as Home) */}
      <h1 className="text-5xl font-extrabold text-slate-700 leading-tight mb-8">
      About <span className="text-slate-500">HomeIQ</span>
      </h1>

      

      {/* Subheading (styled to match home hero) */}
      <p className="text-xl font-medium text-slate-600 mb-8 italic border-l-4 border-slate-700 pl-4">
        {t('aboutHeading')}
      </p>

      {/* Body Text */}
      <div className="space-y-6 text-base sm:text-lg leading-relaxed max-w-3xl">
        <p>{t('aboutP1')}</p>
        <p>{t('aboutP2')}</p>
        <p>{t('aboutP3')}</p>
      </div>
    </div>
  );
};

export default About;

