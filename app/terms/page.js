export const metadata = {
  title: 'Terms of Service',
  description: 'Engineering Tutorials terms of service — rules for using our platform.',
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem', paddingBottom: '0.4rem', borderBottom: '2px solid #f0fdf4' }}>{title}</h2>
    <div style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem' }}>Terms of Service</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Last updated: January 1, 2025</p>
        <p style={{ color: '#6b7280', lineHeight: 1.8 }}>
          By accessing or using Engineering Tutorials, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
        </p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>By creating an account or using any feature of Engineering Tutorials, you agree to these terms. If you do not agree, you must not use the service.</p>
      </Section>

      <Section title="2. Use of the Platform">
        <p>You agree to use Engineering Tutorials only for lawful purposes. You must not:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <li>Attempt to gain unauthorised access to any part of the platform</li>
          <li>Upload malicious code, viruses, or harmful content</li>
          <li>Scrape or copy tutorial content for commercial redistribution without permission</li>
          <li>Impersonate other users, authors, or administrators</li>
          <li>Violate any applicable local, national, or international law</li>
          <li>Harass, abuse, or harm other users</li>
        </ul>
      </Section>

      <Section title="3. Accounts">
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate information during registration, including a valid email address. Accounts are non-transferable.</p>
      </Section>

      <Section title="4. Content & Intellectual Property">
        <p>All tutorial content, branding, and site design are the intellectual property of Engineering Tutorials or its respective authors. You may not reproduce, distribute, or create derivative works without express written permission.</p>
        <p style={{ marginTop: '0.75rem' }}>Authors who submit content to Engineering Tutorials grant us a non-exclusive, royalty-free licence to publish and display that content on the platform.</p>
      </Section>

      <Section title="5. Author Submissions">
        <p>Authors agree that submitted tutorials are original work, do not infringe third-party rights, and meet our editorial standards. All submissions are subject to admin review and may be rejected or removed without notice.</p>
      </Section>

      <Section title="6. Advertisements">
        <p>Engineering Tutorials displays advertisements via Google AdSense. These ads help us keep the platform free. We have no control over the content of third-party advertisements and are not responsible for their accuracy or policies.</p>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <p>Engineering Tutorials is provided "as is" without warranties of any kind. We do not guarantee that the platform will be error-free, uninterrupted, or that tutorial content is free from inaccuracies. Engineering knowledge should always be verified with qualified professionals before application.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>To the fullest extent permitted by law, Engineering Tutorials shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform or reliance on its content.</p>
      </Section>

      <Section title="9. Termination">
        <p>We reserve the right to suspend or terminate your account at any time for violation of these terms. You may delete your account at any time via your profile settings.</p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>We may revise these terms at any time. Continued use of the platform after changes constitutes acceptance. Significant changes will be communicated via email to registered users.</p>
      </Section>

      <Section title="11. Governing Law">
        <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of Nigerian courts.</p>
      </Section>

      <Section title="12. Contact">
        <p>Questions about these terms? Contact us at <a href="mailto:legal@engineeringtutorials.com" style={{ color: '#16a34a' }}>legal@engineeringtutorials.com</a> or via our <a href="/contact" style={{ color: '#16a34a' }}>Contact page</a>.</p>
      </Section>
    </div>
  );
}
