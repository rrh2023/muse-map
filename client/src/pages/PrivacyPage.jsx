import { Link } from 'react-router-dom';
import './PrivacyPage.css';

const SECTIONS = [
  {
    title: '1. Who we are',
    body: 'Muse Map is a cultural events platform for Jersey City, NJ, operated by JCPO Fest. For questions about this policy, contact us at jcpofest@gmail.com.',
  },
  {
    title: '2. What we collect',
    items: [
      { label: 'Account information', detail: 'Your name and email address when you register.' },
      { label: 'Payment information', detail: 'Processed entirely by Stripe. We never see or store your card details.' },
      { label: 'Event data', detail: 'Events you create, attend, or register for.' },
      { label: 'Usage data', detail: 'Standard server logs including IP address, browser type, and pages visited.' },
    ],
  },
  {
    title: '3. How we use it',
    items: [
      { detail: 'To provide and operate the Muse Map service.' },
      { detail: 'To process subscription payments through Stripe.' },
      { detail: 'To send transactional emails such as account confirmation and password reset.' },
      { detail: 'To display your name on events you organize or attend.' },
    ],
  },
  {
    title: '4. Third-party services',
    body: 'We use the following services to operate the platform. Each has its own privacy policy.',
    items: [
      { label: 'Stripe', detail: 'Payment processing — stripe.com/privacy' },
      { label: 'MongoDB Atlas', detail: 'Database hosting — mongodb.com/legal/privacy-policy' },
      { label: 'Render', detail: 'Server hosting — render.com/privacy' },
      { label: 'Vercel', detail: 'Frontend hosting — vercel.com/legal/privacy-policy' },
    ],
  },
  {
    title: '5. Data sharing',
    body: 'We do not sell, rent, or share your personal data with third parties for marketing purposes. Data is only shared with the service providers listed above as necessary to operate the platform.',
  },
  {
    title: '6. Data retention',
    body: 'We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by emailing jcpofest@gmail.com. Payment records may be retained by Stripe per their own retention policies.',
  },
  {
    title: '7. Security',
    body: 'Passwords are hashed and never stored in plain text. Payment processing is handled entirely by Stripe using industry-standard encryption. We use HTTPS for all data in transit.',
  },
  {
    title: '8. Your rights',
    body: 'You have the right to access, correct, or delete your personal data. To exercise these rights, email jcpofest@gmail.com.',
  },
  {
    title: '9. Children',
    body: 'Muse Map is not directed at children under 13. We do not knowingly collect data from anyone under 13.',
  },
  {
    title: '10. Changes',
    body: 'We may update this policy from time to time. Continued use of the service after changes constitutes acceptance of the updated policy.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="page privacy-page">
      <div className="privacy-inner">
        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Back
        </Link>

        <div className="privacy-header">
          <p className="privacy-eyebrow">Legal</p>
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-updated">Last updated: April 13, 2026</p>
        </div>

        <div className="privacy-body">
          {SECTIONS.map((s) => (
            <section key={s.title} className="privacy-section">
              <h2 className="privacy-section-title">{s.title}</h2>
              {s.body && <p className="privacy-text">{s.body}</p>}
              {s.items && (
                <ul className="privacy-list">
                  {s.items.map((item, i) => (
                    <li key={i}>
                      {item.label && <strong>{item.label} — </strong>}
                      {item.detail}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="privacy-contact">
            <p>Questions? Email us at{' '}
              <a href="mailto:jcpofest@gmail.com">jcpofest@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}