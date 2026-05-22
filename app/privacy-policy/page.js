export const metadata = {
  title: 'Privacy Policy',
  description: 'Engineering Tutorials privacy policy — how we collect, use, and protect your data.',
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem', paddingBottom: '0.4rem', borderBottom: '2px solid #f0fdf4' }}>{title}</h2>
    <div style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>{children}</div>
  </div>
);

export default function PrivacyPolicyPage() {
  const updated = 'January 1, 2025';
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Last updated: {updated}</p>
        <p style={{ color: '#6b7280', lineHeight: 1.8 }}>
          Engineering Tutorials ("we", "us", or "our") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding that data.
        </p>
      </div>

      <Section title="1. Information We Collect">
        <p><strong>Account information:</strong> When you register, we collect your name, email address, and course of interest. Passwords are stored as secure one-way hashes.</p>
        <p style={{ marginTop: '0.75rem' }}><strong>Usage data:</strong> We automatically collect information about how you interact with our site — pages visited, tutorials read, quiz results, and login times — to provide progress tracking features.</p>
        <p style={{ marginTop: '0.75rem' }}><strong>Cookies:</strong> We use cookies and similar technologies for authentication, preferences, and analytics. See our <a href="/cookie-policy" style={{ color: '#16a34a' }}>Cookie Policy</a> for details.</p>
        <p style={{ marginTop: '0.75rem' }}><strong>Communications:</strong> If you contact us or subscribe to our newsletter, we store your email and any information you provide.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <li>Provide and maintain our educational services</li>
          <li>Track your learning progress and quiz results</li>
          <li>Send verification emails and important account notifications</li>
          <li>Send newsletters (only with your explicit consent)</li>
          <li>Improve our platform through aggregated analytics</li>
          <li>Comply with legal obligations</li>
          <li>Display relevant advertisements via Google AdSense</li>
        </ul>
      </Section>

      <Section title="3. Google AdSense & Third-Party Advertising">
        <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our site and other sites on the internet. You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>Google Ads Settings</a>.</p>
        <p style={{ marginTop: '0.75rem' }}>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet. Users may opt out of personalised advertising by visiting <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>About Ads</a>.</p>
      </Section>

      <Section title="4. Google Analytics">
        <p>We use Google Analytics to understand how visitors use our site. This service collects anonymised data about your browser, operating system, and pages visited. Google Analytics data is processed by Google LLC under their own privacy policy. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>Google Analytics Opt-out Browser Add-on</a>.</p>
      </Section>

      <Section title="5. Data Sharing">
        <p>We do not sell your personal information. We may share data with:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <li><strong>Cloudinary</strong> — for storing images and media you upload</li>
          <li><strong>Google LLC</strong> — for analytics and advertising services</li>
          <li><strong>Email service providers</strong> — to send transactional and newsletter emails</li>
          <li><strong>Law enforcement</strong> — when required by applicable law</li>
        </ul>
      </Section>

      <Section title="6. Data Retention">
        <p>We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us. Anonymised analytics data may be retained indefinitely.</p>
      </Section>

      <Section title="7. Your Rights (GDPR / NDPR)">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion ("right to be forgotten")</li>
          <li>Object to or restrict processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time (e.g., newsletter unsubscribe)</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>To exercise any of these rights, contact us at <a href="mailto:privacy@engineeringtutorials.com" style={{ color: '#16a34a' }}>privacy@engineeringtutorials.com</a>.</p>
      </Section>

      <Section title="8. Security">
        <p>We implement industry-standard security measures including HTTPS encryption, hashed passwords, and HTTP security headers. No system is 100% secure; if you discover a vulnerability, please contact us responsibly.</p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>Our services are not directed to children under 13. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, please contact us immediately.</p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify registered users by email and update the "last updated" date above. Continued use of the site after changes constitutes acceptance.</p>
      </Section>

      <Section title="11. Contact">
        <p>For privacy-related enquiries, contact us at <a href="mailto:privacy@engineeringtutorials.com" style={{ color: '#16a34a' }}>privacy@engineeringtutorials.com</a> or use our <a href="/contact" style={{ color: '#16a34a' }}>Contact page</a>.</p>
      </Section>
    </div>
  );
}
