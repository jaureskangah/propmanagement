import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Simplify Your Management?
        </h2>
        <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of property owners who trust our solution
        </p>
        <Button asChild size="lg" className="group bg-white hover:bg-white/90 text-red-600 border border-red-100">
          <Link to="/signup">
            Try For Free
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}