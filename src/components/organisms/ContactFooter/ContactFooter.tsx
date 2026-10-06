import React from 'react';
import { siteMeta } from '../../../data/site';
import { useLocale } from '../../../hooks/useLocale';
import { Button } from '../../atoms/Button/Button';
import './ContactFooter.css';

export interface ContactFooterProps {
  className?: string;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  className = '',
}) => {
  const { t } = useLocale();

  const developerWaUrl =
    'https://wa.me/6282298503412?text=' +
    encodeURIComponent(
      'Halo, saya lihat portfolio Afrizal Pramudyan. Saya tertarik bikin profile / portfolio / personal branding website.'
    );

  return (
    <footer
      id="contact"
      className={`contact-footer ${className}`.trim()}
      aria-labelledby="contact-heading"
    >
      {/* 1. Primary CTA Section: Afrizal's Contact */}
      <div className="contact-main-block">
        <div className="contact-container">
          <div className="contact-eyebrow-row">
            <span className="contact-index">07 / CONTACT</span>
            <span className="contact-subhead">{t.contact.subheadline}</span>
          </div>

          <div className="contact-headline-row">
            <h2 id="contact-heading" className="contact-headline">
              {t.contact.headline}
            </h2>
            <p className="contact-lead">{t.contact.lead}</p>
          </div>

          <div className="contact-actions-row">
            <div className="contact-cta-action">
              <Button
                variant="primary"
                size="lg"
                isMagnetic={true}
                onClick={() => {
                  // Direct to email or notice
                  const emailNotice = document.getElementById('contact-notice');
                  if (emailNotice) {
                    emailNotice.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label={t.reel.startProject}
              >
                {t.reel.startProject} ↗
              </Button>
            </div>

            {/* Channels & Safe Placeholders */}
            <div id="contact-notice" className="contact-channels-group">
              <div className="contact-channel-item">
                <span className="channel-label">{t.contact.emailLabel}</span>
                <span className="channel-val-placeholder" title={t.contact.placeholderNote}>
                  {siteMeta.email}
                </span>
              </div>

              <div className="contact-channel-item">
                <span className="channel-label">{t.contact.socialsLabel}</span>
                <div className="channel-socials-list">
                  {siteMeta.socials.map((social) => (
                    <span
                      key={social.label}
                      className="channel-val-placeholder"
                      title={t.contact.placeholderNote}
                    >
                      [{social.label.toUpperCase()}]
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Colophon & Creator Attribution + Sales CTA */}
      <div className="contact-bottom-block">
        <div className="contact-container bottom-container">
          {/* Subtle Developer Sales CTA */}
          <aside className="developer-sales-box" aria-label="Website design & development service">
            <div className="sales-text-group">
              <span className="sales-title">{t.contact.salesPitch}</span>
              <span className="sales-desc">{t.contact.salesSub}</span>
            </div>
            <a
              href={developerWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sales-link"
              data-cursor="external"
            >
              {t.contact.salesCta}
            </a>
          </aside>

          {/* Canonical Attribution & Colophon */}
          <div className="footer-colophon-row">
            <div className="attribution-line">
              <span className="attribution-muted">{t.contact.attributionPrefix} </span>
              <a
                href="https://github.com/parikesitad-pm"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link"
                data-cursor="external"
              >
                parikesitad-pm
              </a>
              <span className="attribution-muted"> {t.contact.attributionSuffix}</span>
            </div>

            {/* Copyright Line */}
            <div className="footer-aux-group">
              <span className="copyright-line">{t.contact.rights}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

