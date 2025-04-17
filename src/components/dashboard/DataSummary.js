export default function DataSummary({ data, className = '' }) {
    if (!data) {
      return null;
    }
    
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Summary</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Key Findings</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {data.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Environmental Impact</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${data.environmentalImpactScore * 10}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              Score: <span className="font-semibold">{data.environmentalImpactScore}/10</span>
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Data Quality</h3>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  className={`w-4 h-4 ${star <= data.dataQualityScore ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {data.dataQualityScore}/5
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Last Updated</h3>
            <p className="text-sm text-gray-700">{data.lastUpdated}</p>
          </div>
        </div>
      </div>
    );
  }