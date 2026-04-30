import { UserMenu } from "@/components/auth/UserMenu";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">AI Signal Demo</h1>
          <UserMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AI Signal</h2>
          <p className="text-lg text-gray-600 mb-8">A demonstration of authentication and data management</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🔐 Authentication</h3>
              <p className="text-gray-600">Sign up or log in using credentials or Google OAuth</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🎓 Colleges</h3>
              <p className="text-gray-600">Browse and manage your college preferences</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🤖 Predictor</h3>
              <p className="text-gray-600">Get AI-powered college recommendations</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">❓ Questions</h3>
              <p className="text-gray-600">Ask and answer questions about colleges</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
