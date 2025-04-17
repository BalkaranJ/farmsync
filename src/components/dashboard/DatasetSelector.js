export default function DatasetSelector({ datasets, onToggleDataset }) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Datasets</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select datasets to analyze and compare agricultural environmental impacts
        </p>
        
        <div className="space-y-3">
          {datasets.map((dataset) => (
            <div 
              key={dataset.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                dataset.isSelected
                  ? 'border-primary bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onToggleDataset(dataset.id)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={dataset.isSelected}
                  onChange={() => onToggleDataset(dataset.id)}
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <label 
                  htmlFor={dataset.id} 
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {dataset.name}
                </label>
              </div>
              
              {dataset.isSelected && (
                <div className="mt-2 text-xs text-gray-500">
                  Data source: Agriculture and Environmental Data Repository
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Analysis Options</h3>
          <div className="space-y-2">
            <div className="flex items-center">
            <input
              type="checkbox"
              id="show-correlation"
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              checked={true}
              readOnly
            />
            <label 
              htmlFor="show-correlation" 
              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
            >
              Show data correlations
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="temporal-analysis"
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              checked={false}
              readOnly
            />
            <label 
              htmlFor="temporal-analysis" 
              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
            >
              Include temporal analysis
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="predictive-models"
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              checked={false}
              readOnly
            />
            <label 
              htmlFor="predictive-models" 
              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
            >
              Apply predictive models
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}