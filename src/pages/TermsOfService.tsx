import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      {/* Main Title */}
      <h1 className="text-3xl font-bold text-custom-red mb-6 text-center">Terms of Service</h1>

      {/* Introductory Paragraph */}
      <p className="mb-4 text-center">
        By using Coptic Scribe (&quot;Service&quot;), you agree to comply with and be bound by these Terms.
        Please review the following terms carefully. If you do not agree, do not use this site or service.
      </p>

      {/* Horizontal Divider */}
      <hr className="border-custom-red mb-6" />

      {/* Section: Use of the Service */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-custom-red mb-2">Use of the Service</h2>
        <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account.</p>
        <p><strong>Prohibited Activities:</strong> Do not use the Service for illegal or unauthorized purposes.</p>
      </section>

      {/* Section: User Content */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-custom-red mb-2">User Content</h2>
        <p><strong>Ownership:</strong> You retain ownership of content you submit but grant us permission to use it.</p>
        <p><strong>Responsibility:</strong> You are solely responsible for your submitted content.</p>
      </section>

      {/* Section: Modification of Terms */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-custom-red mb-2">Modification of Terms</h2>
        <p>We may modify these Terms at any time. Continued use implies acceptance.</p>
      </section>

      {/* Section: Termination */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-custom-red mb-2">Termination</h2>
        <p>We may terminate access for violating Terms or harmful conduct, without notice.</p>
      </section>
    </div>
  );
};

export default TermsOfService;
