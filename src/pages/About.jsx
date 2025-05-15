// src/pages/About.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 text-slate-700">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-slate-700 leading-tight mb-8">
          About <span className="text-slate-500">HomeIQ</span>
        </h1>

        {/* Subheading */}
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

      {/* Footer */}
      <footer className="bg-slate-100 text-slate-600 mt-16 py-10 border-t border-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <h2 className="font-semibold text-slate-700 mb-2">{t('footer.contact')}</h2>
            <p>{t('footer.company')}</p>
            <p>{t('footer.address')}</p>
            <p>{t('footer.email')}</p>
            <p>{t('footer.phone')}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-700 mb-2">{t('footer.service')}</h2>
            <p>{t('footer.faq')}</p>
            <p>{t('footer.how')}</p>
            <p>{t('footer.terms')}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-700 mb-2">{t('footer.follow')}</h2>
            <p>{t('footer.facebook')}</p>
            <p>{t('footer.instagram')}</p>
            <p>{t('footer.linkedin')}</p>
          </div>
        </div>
        <div className="text-center text-xs mt-8 text-slate-400">
          © {new Date().getFullYear()} HomeIQ AB. {t('footer.copyright')}
        </div>
      </footer>
    </>
  );
};

export default About;
