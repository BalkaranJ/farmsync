export default function LoadingSpinner({ size = 'medium', color = 'primary' }) {
    let sizeClasses = 'h-8 w-8';
    let colorClasses = 'text-primary';
    
    switch (size) {
      case 'small':
        sizeClasses = 'h-5 w-5';
        break;
      case 'large':
        sizeClasses = 'h-12 w-12';
        break;
      default:
        sizeClasses = 'h-8 w-8';
    }
    
    switch (color) {
      case 'white':
        colorClasses = 'text-white';
        break;
      case 'gray':
        colorClasses = 'text-gray-500';
        break;
      default:
        colorClasses = 'text-primary';
    }
    
    return (
      <div className="flex flex-col items-center justify-center">
        <svg 
          className={`animate-spin ${sizeClasses} ${colorClasses}`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="mt-2 text-gray-600">Loading data...</p>
      </div>
    );
  }