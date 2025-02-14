
export default function Careers() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Careers at PropManagement</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-6">
          Join our team and help shape the future of property management. We're always looking for
          talented individuals who share our passion for innovation and excellence.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-6">Open Positions</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Senior Full Stack Developer</h3>
            <p className="text-gray-600 mb-4">Full-time · Remote · Competitive Salary</p>
            <p className="mb-4">
              We're looking for an experienced full-stack developer to help build and maintain
              our core platform features.
            </p>
            <button className="text-[#ea384c] font-semibold hover:text-[#d41f32]">
              Learn More →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">UX/UI Designer</h3>
            <p className="text-gray-600 mb-4">Full-time · Remote · Competitive Salary</p>
            <p className="mb-4">
              Join our design team to create intuitive and beautiful interfaces that delight
              our users.
            </p>
            <button className="text-[#ea384c] font-semibold hover:text-[#d41f32]">
              Learn More →
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center space-x-2">
              <span>✨</span>
              <span>Competitive salary</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>🏥</span>
              <span>Health insurance</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>🏖️</span>
              <span>Unlimited PTO</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>💻</span>
              <span>Remote work</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
