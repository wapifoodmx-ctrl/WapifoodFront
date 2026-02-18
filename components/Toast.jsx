import { useState, useEffect } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoWarning, IoInformationCircle, IoClose } from 'react-icons/io5';

let toastQueue = [];
let listeners = [];

export const toast = {
  success: (message, duration = 4000) => {
    showToast({ type: 'success', message, duration });
  },
  error: (message, duration = 5000) => {
    showToast({ type: 'error', message, duration });
  },
  warning: (message, duration = 5000) => {
    showToast({ type: 'warning', message, duration });
  },
  info: (message, duration = 4000) => {
    showToast({ type: 'info', message, duration });
  },
};

const showToast = (toastData) => {
  const id = Date.now();
  const newToast = { ...toastData, id };
  toastQueue.push(newToast);
  listeners.forEach(listener => listener([...toastQueue]));
  
  // Auto-remove después del tiempo especificado
  setTimeout(() => {
    removeToast(id);
  }, toastData.duration || 4000);
};

const removeToast = (id) => {
  toastQueue = toastQueue.filter(t => t.id !== id);
  listeners.forEach(listener => listener([...toastQueue]));
};

const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <IoCloseCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <IoWarning className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <IoInformationCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <IoInformationCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${getStyles(toast.type)}
            border-2 rounded-lg shadow-lg p-4 min-w-[300px] max-w-md
            animate-slide-in-right pointer-events-auto
            transform transition-all duration-300 ease-out
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              type="button"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
