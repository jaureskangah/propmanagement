
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We're here to help and answer any question you might have
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-[#ea384c]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <p className="text-gray-600 text-center">+1 (555) 781-1872</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-[#ea384c]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-600 text-center">contact@propmanager.com</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-[#ea384c]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Office</h3>
            <p className="text-gray-600 text-center">123 Business Ave, Montreal, QC</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-[#ea384c] hover:bg-[#d41f32] text-white">
            Send us a message
          </Button>
        </div>
      </div>
    </section>
  );
}
