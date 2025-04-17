import { useState } from 'react';

const regions = [
  'All Canada',
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon'
];

export default function DashboardHeader({ 
  user, 
  selectedRegion,
  onRegionChange,
  compareMode,
  onToggleCompareMode
}) {
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  
  const toggleRegionDropdown = () => {
    setIsRegionDropdownOpen(!isRegionDropdownOpen);
  };
  
  const handleRegionSelect = (region) => {
    onRegionChange(region);
    setIsRegionDropdownOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agricultural Environmental Impact Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Analyze and compare environmental impacts of agricultural activities across datasets
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative">
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={toggleRegionDropdown}
            >
              <span>Region: {selectedRegion}</span>
              <svg
                className={`ml-2 h-5 w-5 transition-transform ${
                  isRegionDropdownOpen ? 'rotate-180' : ''
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isRegionDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => handleRegionSelect(region)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        selectedRegion === region
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCompareMode}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              compareMode
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {compareMode ? 'Disable Comparison' : 'Enable Comparison'}
          </button>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Regions Analyzed</h3>
          <p className="mt-2 text-2xl font-semibold text-blue-900">13</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Farm Areas Covered</h3>
          <p className="mt-2 text-2xl font-semibold text-green-900">159.3M ha</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-amber-800">GHG Emissions Tracked</h3>
          <p className="mt-2 text-2xl font-semibold text-amber-900">73.1 Mt CO₂e</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Drought Impact Score</h3>
          <p className="mt-2 text-2xl font-semibold text-purple-900">4.2 / 10</p>
        </div>
      </div>
    </div>
  );
}