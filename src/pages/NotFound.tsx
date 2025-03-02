import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-darker flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary mb-8">
          <BrainCircuit size={32} className="text-white" />
        </div>
        <h2 className="text-center text-4xl font-extrabold text-white mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-center text-lg text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-white/10 text-base font-medium rounded-md text-gray-300 hover:bg-dark-lighter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 