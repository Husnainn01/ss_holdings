import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center items-center">
          <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">SS</div>
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">404 - Page Not Found</h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          The admin page you're looking for doesn't exist or you may not have permission to view it.
        </p>
        <div className="mt-8 space-y-4">
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <div className="block">
            <Link 
              href="/" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Return to Main Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 