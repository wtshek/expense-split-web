import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './ui/Button';

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onNeedRefresh() {
      setShowPrompt(true);
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowPrompt(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowPrompt(false);
  };

  useEffect(() => {
    if (needRefresh || offlineReady) {
      setShowPrompt(true);
    }
  }, [needRefresh, offlineReady]);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20 shadow-lg max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {needRefresh ? (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔄</span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-800 font-medium text-sm">
              {needRefresh ? 'Update Available' : 'App Ready Offline'}
            </h3>
            <p className="text-gray-600 text-xs mt-1">
              {needRefresh 
                ? 'A new version is available. Reload to update.'
                : 'App is ready to work offline.'
              }
            </p>
          </div>
          
          <div className="flex-shrink-0 space-x-2">
            {needRefresh && (
              <Button
                onClick={handleUpdate}
                className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white"
              >
                Update
              </Button>
            )}
            <button
              onClick={close}
              className="w-6 h-6 bg-gray-200 bg-opacity-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-opacity-70 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}