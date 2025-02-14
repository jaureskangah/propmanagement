
export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly to us, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Name and contact information</li>
          <li>Property management details</li>
          <li>Payment information</li>
          <li>Communication preferences</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and improve our services</li>
          <li>Process your transactions</li>
          <li>Send you updates and marketing communications</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
        <p className="mb-4">We do not sell your personal information. We may share your information with:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Service providers</li>
          <li>Legal authorities when required</li>
          <li>Business partners with your consent</li>
        </ul>
      </div>
    </div>
  );
}
