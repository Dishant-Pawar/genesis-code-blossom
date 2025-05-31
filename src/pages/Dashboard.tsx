
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              ▣
            </div>
            <h1 className="text-5xl font-light text-gray-900 mb-2">
              Open E-Label
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Open-source solution for electronic labels.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Administration Dashboard
            </h2>
            <Link
              to="/login"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Access Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
