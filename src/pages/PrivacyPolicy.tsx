import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center text-gray-800">

      {/* Main Title */}
      <h1 className="text-3xl font-bold mb-4 text-custom-red">Privacy Policy</h1>

      {/* Introduction paragraph */}
      <p className="mb-8">
        This Privacy Policy outlines how we collect, use, and protect your personal information.
      </p>

      {/* Section: Information We Collect */}
      <section className="mb-8 text-left">
        <h2 className="text-xl font-semibold text-custom-red border-b border-custom-red pb-1 mb-3">Information We Collect</h2>

        <p className="mb-3">
          <span className="font-semibold">Personal Information:</span><br />
          When you sign up for an account, we collect your email address to manage your account and communicate with you, especially for password reset requests.
        </p>

        <p className="mb-3">
          <span className="font-semibold">Non-Personal Information:</span><br />
          We collect non-personal information such as your browser type, operating system, and the pages you visit on our site. This information is stored in browser storage for features like Dark Mode.
        </p>
      </section>

      {/* Section: How We Use Your Information */}
      <section className="mb-8 text-left">
        <h2 className="text-xl font-semibold text-custom-red border-b border-custom-red pb-1 mb-3">How We Use Your Information</h2>

        <p className="mb-3">
          <span className="font-semibold">To Provide and Improve Our Service:</span><br />
          We use your information to provide, maintain, and improve our Service.
        </p>

        <p className="mb-3">
          <span className="font-semibold">To Communicate with You:</span><br />
          We use your email address to send you information and updates related to your account, such as password reset instructions.
        </p>

        <p className="mb-3">
          <span className="font-semibold">To Ensure Security:</span><br />
          Passwords are encrypted to ensure they are stored securely.
        </p>
      </section>

      {/* Section: Sharing of Information */}
      <section className="mb-8 text-left">
        <h2 className="text-xl font-semibold text-custom-red border-b border-custom-red pb-1 mb-3">Sharing of Information</h2>

        <p>
          We do not share your personal information with third parties, except as necessary to comply with legal requirements, protect our rights, or as part of a merger, acquisition, or sale of our assets.
        </p>
      </section>

      {/* Section: Data Security */}
      <section className="mb-8 text-left">
        <h2 className="text-xl font-semibold text-custom-red border-b border-custom-red pb-1 mb-3">Data Security</h2>

        <p>
          We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.
        </p>
      </section>

      {/* Section: Changes to This Privacy Policy */}
      <section className="mb-8 text-left">
        <h2 className="text-xl font-semibold text-custom-red border-b border-custom-red pb-1 mb-3">Changes to This Privacy Policy</h2>

        <p>
          We may update this Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </section>

      {/* Section: Contact Us */}
      <section className="text-left">
        <h2 className="text-xl font-semibold text-custom-red border-b border-custom-red pb-1 mb-3">Contact Us</h2>

        <p>
          If you have any questions about these Terms or the Privacy Policy, please contact us at <br />
          <span className="font-semibold">rafic.george.haddad@gmail.com</span>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
