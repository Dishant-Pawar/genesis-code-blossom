
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to E-Label
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create and manage electronic wine labels with ease. 
            Comply with EU regulations while providing customers with 
            comprehensive product information through QR codes.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🍷 Product Management
              </h3>
              <p className="text-gray-600">
                Manage your wine products, ingredients, and nutritional information in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📱 QR Code Generation
              </h3>
              <p className="text-gray-600">
                Generate QR codes for your products that link to comprehensive e-labels.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ✅ EU Compliance
              </h3>
              <p className="text-gray-600">
                Meet EU electronic wine labeling requirements with built-in compliance features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
