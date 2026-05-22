export const metadata = {
  title: 'Cookie Policy',
  description: 'Engineering Tutorials cookie policy — what cookies we use and why.',
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem', paddingBottom: '0.4rem', borderBottom: '2px solid #f0fdf4' }}>{title}</h2>
    <div style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>{children}</div>
  </div>
);

const CookieTable = ({ rows }) => (
  <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ background: '#16a34a', color: 'white' }}>
          {['Cookie Name', 'Purpose', 'Duration', 'Type'].map(h => (
            <th key={h} style={{ padding: '0.6rem 0.9rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '0.6rem 0.9rem', fontFamily: j === 0 ? 'IBM Plex Mono, monospace' : 'inherit', fontSize: j === 0 ? '0.8rem' : 'inherit', color: '#374151' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function CookiePolicyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem' }}>Cookie Policy</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Last updated: January 1, 2025</p>
        <p style={{ color: '#6b7280', lineHeight: 1.8 }}>
          This Cookie Policy explains what cookies are, which cookies we use on Engineering Tutorials, and how you can manage your cookie preferences.
        </p>
      </div>

      <Section title="1. What Are Cookies?">
        <p>Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you use the site. Some cookies are essential for the site to function; others are optional.</p>
      </Section>

      <Section title="2. Cookies We Use">
        <p><strong>Essential Cookies</strong> — required for the site to function. Cannot be disabled.</p>
        <CookieTable rows={[
          ['auth_token', 'Keeps you logged in', '7 days', 'Essential'],
          ['cookie-consent', 'Stores your cookie preference', '1 year', 'Essential'],
        ]} />

        <p style={{ marginTop: '1.25rem' }}><strong>Analytics Cookies</strong> — help us understand how visitors use the site.</p>
        <CookieTable rows={[
          ['_ga', 'Google Analytics — distinguishes users', '2 years', 'Analytics'],
          ['_ga_*', 'Google Analytics — session persistence', '2 years', 'Analytics'],
          ['_gid', 'Google Analytics — distinguishes users', '24 hours', 'Analytics'],
        ]} />

        <p style={{ marginTop: '1.25rem' }}><strong>Advertising Cookies</strong> — used by Google AdSense to serve relevant ads.</p>
        <CookieTable rows={[
          ['__gads', 'Google Ads — frequency capping', '13 months', 'Advertising'],
          ['IDE', 'Google DoubleClick — ad targeting', '13 months', 'Advertising'],
          ['NID', 'Google — stores preferences for ads', '6 months', 'Advertising'],
        ]} />
      </Section>

      <Section title="3. Third-Party Cookies">
        <p>We use services that may set their own cookies:</p>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <li><strong>Google AdSense</strong> — serves personalised or non-personalised ads. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>Google Privacy Policy</a></li>
          <li><strong>Google Analytics</strong> — site analytics. <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>Opt-out tool</a></li>
          <li><strong>Cloudinary</strong> — media delivery. May set performance cookies.</li>
        </ul>
      </Section>

      <Section title="4. Managing Cookies">
        <p>You can control cookies in several ways:</p>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <li><strong>Cookie banner:</strong> When you first visit, you can accept or decline non-essential cookies using our banner.</li>
          <li><strong>Browser settings:</strong> Most browsers allow you to delete or block cookies. Note that blocking essential cookies may break site functionality.</li>
          <li><strong>Google opt-out:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>Google Ad Settings</a> to control personalised advertising.</li>
          <li><strong>Industry opt-out:</strong> Visit <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>AboutAds.info</a> or <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>YourOnlineChoices</a>.</li>
        </ul>
      </Section>

      <Section title="5. Updates to This Policy">
        <p>We may update this Cookie Policy as we add or change the services we use. Check back periodically or see the "last updated" date at the top.</p>
      </Section>

      <Section title="6. Contact">
        <p>Questions? Contact us at <a href="mailto:privacy@engineeringtutorials.com" style={{ color: '#16a34a' }}>privacy@engineeringtutorials.com</a> or via our <a href="/contact" style={{ color: '#16a34a' }}>Contact page</a>.</p>
      </Section>
    </div>
  );
}
