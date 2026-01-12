import PageMeta from "../components/PageMeta.jsx";

export default function CookiesPage() {
  return (
    <>
      <PageMeta
        title="Cookie Policy - PricePulseAI"
        description="Learn about how PricePulseAI uses cookies and how you can manage your cookie preferences."
      />
      <div className="min-h-screen bg-white dark:bg-slate-950 px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Cookie Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 sm:space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0 mb-3 sm:mb-4">
                1. What Are Cookies?
              </h2>
              <p>
                Cookies are small files of letters and numbers that we store on
                your browser or the hard drive of your device. Cookies contain
                information that is transferred to your device and helps us
                identify and keep you logged in, understand your preferences,
                and improve your experience on PricePulseAI.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                2. Types of Cookies We Use
              </h2>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Essential Cookies:
              </h3>
              <p>
                These cookies are essential for the operation of our website.
                Without these cookies, the Service would not work properly.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Authentication cookies (e.g., session tokens)</li>
                <li>User preference cookies</li>
                <li>Security and fraud prevention cookies</li>
              </ul>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Performance Cookies:
              </h3>
              <p>
                These cookies help us understand how you use our website so we
                can make improvements.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Analytics cookies (track page views and navigation)</li>
                <li>Performance monitoring cookies</li>
                <li>Error tracking cookies</li>
              </ul>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Functional Cookies:
              </h3>
              <p>
                These cookies allow us to remember your choices and provide
                enhanced functionality.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Theme preference cookies (light/dark mode)</li>
                <li>Language preference cookies</li>
                <li>Recent search and wishlist cookies</li>
              </ul>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Marketing Cookies:
              </h3>
              <p>
                These cookies track your behavior to deliver relevant
                advertising and measure campaign effectiveness.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Tracking cookies for retargeting</li>
                <li>Conversion tracking cookies</li>
                <li>Third-party advertising cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                3. Cookie Duration
              </h2>
              <p>
                <strong>Session Cookies:</strong> These are temporary cookies
                that expire when you close your browser.
              </p>
              <p>
                <strong>Persistent Cookies:</strong> These cookies remain on
                your device for a specified period or until you delete them.
                They help us remember your preferences on future visits.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                4. Third-Party Cookies
              </h2>
              <p>
                We use third-party services that may place their own cookies on
                your device:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Google Analytics for usage analytics</li>
                <li>Payment processors for transaction handling</li>
                <li>Social media platforms for integration</li>
                <li>Advertising networks for targeted marketing</li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies, and we recommend
                reviewing them.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                5. How We Use Cookies
              </h2>
              <p>We use cookies to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Remember your login information and authentication details
                </li>
                <li>Understand how you use our website and improve it</li>
                <li>Deliver personalized content and recommendations</li>
                <li>Remember your preferences (theme, language, etc.)</li>
                <li>Protect against fraud and maintain security</li>
                <li>
                  Analyze traffic and measure the effectiveness of marketing
                  campaigns
                </li>
                <li>Display relevant advertisements based on your interests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                6. Managing Your Cookie Preferences
              </h2>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Browser Settings:
              </h3>
              <p>
                You can control and manage cookies through your browser
                settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>View cookies that have been set</li>
                <li>Delete specific cookies or all cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Set preferences for accepting cookies</li>
              </ul>

              <p className="mb-4">
                Instructions for managing cookies in popular browsers:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>Chrome:</strong> Settings → Privacy and security →
                  Cookies and other site data
                </li>
                <li>
                  <strong>Firefox:</strong> Preferences → Privacy & Security →
                  Cookies and Site Data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → Manage
                  Website Data
                </li>
                <li>
                  <strong>Edge:</strong> Settings → Privacy, search, and
                  services → Clear browsing data
                </li>
              </ul>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do Not Track:
              </h3>
              <p>
                Some browsers include a Do Not Track (DNT) feature. Please note
                that our website currently does not respond to DNT signals, as
                there is no industry-wide standard for recognizing such signals.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                7. Impact of Disabling Cookies
              </h2>
              <p>
                If you choose to disable or delete cookies, some parts of our
                website may not function properly, including:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You may not be able to log in to your account</li>
                <li>Your preferences may not be saved</li>
                <li>Some features may be unavailable</li>
                <li>Your shopping experience may be less personalized</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                8. Cookie Consent
              </h2>
              <p>
                When you first visit PricePulseAI, we display a cookie consent
                banner to inform you about our cookie usage. By accepting our
                cookie policy, you consent to our use of cookies as described in
                this document.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                9. Compliance
              </h2>
              <p>
                We comply with cookie regulations including GDPR, CCPA, and
                other applicable data protection laws. We ensure that all
                cookies are used transparently and securely.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                10. Changes to This Cookie Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or applicable laws. We will notify you
                of significant changes by posting the updated policy on our
                website.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                11. Contact Us
              </h2>
              <p>
                If you have questions about our use of cookies or this Cookie
                Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <p>
                  <strong>PricePulseAI</strong>
                  <br />
                  Email: cookies@pricepulseai.com
                  <br />
                  Address:{" "}
                  <a
                    href="http://maps.app.goo.gl/b27iD9QrBRHroW5Z8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ajay Bagh Colony, Musakhedi, Indore, Madhya Pradesh 452001
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
