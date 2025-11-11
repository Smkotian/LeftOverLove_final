import React from 'react';
import { Link } from 'react-router-dom';

function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thank You!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The donation has been successfully received.
          </p>
        </div>
        <div className="mt-6">
          <Link
            to="/tracking"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Back to Tracking
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;