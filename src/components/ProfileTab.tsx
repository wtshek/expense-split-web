export default function ProfileTab() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6 text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JD</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
          <p className="text-gray-500">john.doe@email.com</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-gray-900 mb-3">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700">Edit Profile</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700">Notification Settings</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700">Privacy Settings</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-gray-900 mb-3">Groups</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-700">Roommates</span>
                <span className="text-sm text-gray-500">4 members</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-700">Weekend Trip</span>
                <span className="text-sm text-gray-500">6 members</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-gray-900 mb-3">Support</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700">Help Center</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700">Contact Support</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-red-600">
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}