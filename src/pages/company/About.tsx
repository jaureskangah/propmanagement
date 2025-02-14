
export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">About PropManagement</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-6">
          PropManagement is dedicated to simplifying property management for landlords and property managers.
          Our platform streamlines the entire property management process, from tenant screening to maintenance requests.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Our Mission</h2>
        <p className="mb-6">
          To provide innovative solutions that make property management more efficient, transparent, and profitable
          for property owners while ensuring a better experience for tenants.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Our Values</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="font-semibold mr-2">Innovation:</span>
            <span>Continuously improving our platform with cutting-edge technology.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">Integrity:</span>
            <span>Operating with transparency and honesty in all our dealings.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">Customer Focus:</span>
            <span>Putting our users' needs first in everything we do.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
