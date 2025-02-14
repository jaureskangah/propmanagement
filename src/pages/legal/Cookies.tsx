
export default function Cookies() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
        <p className="mb-4">
          Cookies are small text files that are placed on your device when you visit our website.
          They help us provide you with a better experience and understand how you use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Types of Cookies We Use</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Essential cookies for basic functionality</li>
          <li>Analytics cookies to improve our service</li>
          <li>Preference cookies to remember your settings</li>
          <li>Marketing cookies for targeted advertising</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Managing Cookies</h2>
        <p className="mb-4">
          You can control and/or delete cookies as you wish. You can delete all cookies that are
          already on your computer and you can set most browsers to prevent them from being placed.
        </p>
      </div>
    </div>
  );
}
