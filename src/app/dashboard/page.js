'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DatasetSelector from '../../components/dashboard/DatasetSelector';
import MapVisualization from '../../components/dashboard/MapVisualization';
import EmissionsChart from '../../components/dashboard/EmissionsChart';
import DroughtImpactChart from '../../components/dashboard/DroughtImpactChart';
import AgricultureProfileChart from '../../components/dashboard/AgricultureProfileChart';
import CorrelationMatrix from '../../components/dashboard/CorrelationMatrix';
import DataSummary from '../../components/dashboard/DataSummary';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const datasets = [
  { id: 'drought', name: 'Canadian Drought Outlook', isSelected: true },
  { id: 'emissions', name: 'Greenhouse Gas Emissions by Municipality', isSelected: true },
  { id: 'agriculture', name: 'Census of Agriculture Profile', isSelected: true },
  { id: 'soil', name: 'Soil Correlation Areas', isSelected: false },
  { id: 'headtax', name: 'Head Tax Permit Zone', isSelected: false },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All Canada');
  const [selectedDatasets, setSelectedDatasets] = useState(datasets);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // For demo purposes, we'll decode the token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.id,
        email: payload.email,
        userType: payload.userType
      });
      setLoading(false);
    } catch (error) {
      console.error('Token error:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Fetch analysis data based on selected datasets and region
    const fetchAnalysisData = async () => {
      if (loading) return;
      
      const activeDatasets = selectedDatasets
        .filter(dataset => dataset.isSelected)
        .map(dataset => dataset.id);
      
      if (activeDatasets.length === 0) {
        setAnalysisResult(null);
        return;
      }
      
      setLoading(true);
      
      try {
        const response = await fetch('/api/analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            datasets: activeDatasets,
            region: selectedRegion
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch analysis data');
        }
        
        const data = await response.json();
        setAnalysisResult(data);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysisData();
  }, [selectedDatasets, selectedRegion, loading]);
  
  const handleDatasetToggle = (datasetId) => {
    setSelectedDatasets(prevDatasets => 
      prevDatasets.map(dataset => 
        dataset.id === datasetId 
          ? { ...dataset, isSelected: !dataset.isSelected } 
          : dataset
      )
    );
  };
  
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };
  
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="px-4 py-6">
        <DashboardHeader 
          user={user} 
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          compareMode={compareMode}
          onToggleCompareMode={toggleCompareMode}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-1">
            <DatasetSelector 
              datasets={selectedDatasets}
              onToggleDataset={handleDatasetToggle}
            />
            
            {analysisResult && (
              <DataSummary 
                data={analysisResult.summary}
                className="mt-6"
              />
            )}
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            {analysisResult ? (
              <>
                <MapVisualization 
                  data={analysisResult.geographicData}
                  selectedRegion={selectedRegion}
                  selectedDatasets={selectedDatasets.filter(d => d.isSelected)}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDatasets.find(d => d.id === 'emissions' && d.isSelected) && (
                    <EmissionsChart 
                      data={analysisResult.emissionsData}
                      compareMode={compareMode}
                    />
                  )}
                  
                  {selectedDatasets.find(d => d.id === 'drought' && d.isSelected) && (
                    <DroughtImpactChart 
                      data={analysisResult.droughtData}
                      compareMode={compareMode}
                    />
                  )}
                </div>
                
                {selectedDatasets.find(d => d.id === 'agriculture' && d.isSelected) && (
                  <AgricultureProfileChart 
                    data={analysisResult.agricultureData}
                    compareMode={compareMode}
                  />
                )}
                
                {selectedDatasets.filter(d => d.isSelected).length > 1 && (
                  <CorrelationMatrix 
                    data={analysisResult.correlationData}
                    datasets={selectedDatasets.filter(d => d.isSelected)}
                  />
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data to Display</h3>
                <p className="text-gray-600">
                  Please select at least one dataset from the selector on the left to view analysis results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}