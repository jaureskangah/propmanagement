
export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using PropManagement, you agree to be bound by these Terms of Service.
          Please read these terms carefully before using our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
        <p className="mb-4">
          PropManagement grants you a limited, non-exclusive, non-transferable license to use
          our services for your property management needs, subject to these terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Obligations</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate information</li>
          <li>Maintain the security of your account</li>
          <li>Comply with applicable laws</li>
          <li>Respect the rights of others</li>
        </ul>
      </div>
    </div>
  );
}
