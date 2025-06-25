import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Cloud, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  TrendingUp,
  Filter,
  Calendar,
  Thermometer,
  Car,
  Download,
  Search
} from 'lucide-react';

// Mock data - in a real app, this would come from the Kaggle dataset
const mockAccidentData = [
  { id: 1, severity: 3, weather: 'Clear', road: 'Dry', hour: 8, day: 'Monday', lat: 40.7128, lng: -74.0060, factors: ['Speed', 'Traffic'] },
  { id: 2, severity: 2, weather: 'Rain', road: 'Wet', hour: 17, day: 'Friday', lat: 40.7589, lng: -73.9851, factors: ['Weather', 'Visibility'] },
  { id: 3, severity: 4, weather: 'Snow', road: 'Icy', hour: 22, day: 'Saturday', lat: 40.7282, lng: -73.7949, factors: ['Weather', 'Road Condition'] },
  { id: 4, severity: 1, weather: 'Fog', road: 'Dry', hour: 6, day: 'Tuesday', lat: 40.6782, lng: -73.9442, factors: ['Visibility'] },
  { id: 5, severity: 3, weather: 'Clear', road: 'Dry', hour: 12, day: 'Wednesday', lat: 40.7505, lng: -73.9934, factors: ['Traffic', 'Speed'] },
  // Add more mock data for better visualization
  ...Array.from({ length: 50 }, (_, i) => ({
    id: i + 6,
    severity: Math.ceil(Math.random() * 4),
    weather: ['Clear', 'Rain', 'Snow', 'Fog', 'Cloudy'][Math.floor(Math.random() * 5)],
    road: ['Dry', 'Wet', 'Icy', 'Snow-covered'][Math.floor(Math.random() * 4)],
    hour: Math.floor(Math.random() * 24),
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 7)],
    lat: 40.7128 + (Math.random() - 0.5) * 0.2,
    lng: -74.0060 + (Math.random() - 0.5) * 0.2,
    factors: [['Speed', 'Traffic'], ['Weather', 'Visibility'], ['Road Condition', 'Traffic'], ['Visibility'], ['Speed']][Math.floor(Math.random() * 5)]
  }))
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {change >= 0 ? '+' : ''}{change}% from last month
        </p>
      </div>
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </div>
);

const HourlyChart = ({ data }: any) => {
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => ({
      hour,
      count: data.filter((d: any) => d.hour === hour).length,
      severity: data.filter((d: any) => d.hour === hour).reduce((sum: number, d: any) => sum + d.severity, 0) / (data.filter((d: any) => d.hour === hour).length || 1)
    }));
  }, [data]);

  const maxCount = Math.max(...hourlyData.map(d => d.count));

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Accidents by Hour of Day</h3>
      <div className="flex items-end justify-between h-64 space-x-1">
        {hourlyData.map(({ hour, count, severity }) => (
          <div key={hour} className="flex flex-col items-center flex-1">
            <div
              className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 ${
                severity > 3 ? 'bg-red-500' : severity > 2 ? 'bg-orange-500' : severity > 1 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ height: `${(count / maxCount) * 100}%` }}
              title={`${hour}:00 - ${count} accidents (Avg severity: ${severity.toFixed(1)})`}
            />
            <span className="text-xs text-gray-600 mt-2">{hour}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4 text-xs">
        <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2"></div>Low Severity</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>Moderate</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>High</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-2"></div>Critical</div>
      </div>
    </div>
  );
};

const WeatherAnalysis = ({ data }: any) => {
  const weatherData = useMemo(() => {
    const weatherTypes = ['Clear', 'Rain', 'Snow', 'Fog', 'Cloudy'];
    return weatherTypes.map(weather => {
      const accidents = data.filter((d: any) => d.weather === weather);
      return {
        weather,
        count: accidents.length,
        avgSeverity: accidents.reduce((sum: number, d: any) => sum + d.severity, 0) / (accidents.length || 1)
      };
    });
  }, [data]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Weather Conditions Impact</h3>
      <div className="space-y-4">
        {weatherData.map(({ weather, count, avgSeverity }) => (
          <div key={weather} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                weather === 'Clear' ? 'bg-yellow-100 text-yellow-600' :
                weather === 'Rain' ? 'bg-blue-100 text-blue-600' :
                weather === 'Snow' ? 'bg-indigo-100 text-indigo-600' :
                weather === 'Fog' ? 'bg-gray-100 text-gray-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{weather}</p>
                <p className="text-sm text-gray-600">{count} accidents</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                avgSeverity > 3 ? 'text-red-600' : avgSeverity > 2 ? 'text-orange-600' : avgSeverity > 1 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {avgSeverity.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">Avg Severity</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HotspotMap = ({ data }: any) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Accident Hotspots</h3>
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden">
        {/* Simulated map background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-green-200 via-blue-200 to-purple-200"></div>
        </div>
        
        {/* Accident points */}
        {data.slice(0, 20).map((accident: any, index: number) => (
          <div
            key={accident.id}
            className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2 animate-pulse ${
              accident.severity > 3 ? 'bg-red-500' : 
              accident.severity > 2 ? 'bg-orange-500' : 
              accident.severity > 1 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{
              left: `${20 + (index % 8) * 10}%`,
              top: `${20 + Math.floor(index / 8) * 15}%`
            }}
            title={`Severity: ${accident.severity}, Weather: ${accident.weather}`}
          />
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <p className="font-medium mb-2">Severity Levels</p>
          <div className="space-y-1">
            <div className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Minor</div>
            <div className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>Moderate</div>
            <div className="flex items-center"><div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>Serious</div>
            <div className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>Fatal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContributingFactors = ({ data }: any) => {
  const factorData = useMemo(() => {
    const allFactors = data.flatMap((d: any) => d.factors);
    const factorCounts = allFactors.reduce((acc: any, factor: string) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(factorCounts)
      .map(([factor, count]: [string, any]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Contributing Factors</h3>
      <div className="space-y-3">
        {factorData.map(({ factor, count }, index) => (
          <div key={factor} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className="font-medium text-gray-900">{factor}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${(count / factorData[0].count) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 min-w-[2rem]">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('last-month');

  const filteredData = useMemo(() => {
    let filtered = mockAccidentData;
    
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'severe') {
        filtered = filtered.filter(d => d.severity >= 3);
      } else if (selectedFilter === 'weather') {
        filtered = filtered.filter(d => d.weather !== 'Clear');
      } else if (selectedFilter === 'road') {
        filtered = filtered.filter(d => d.road !== 'Dry');
      }
    }
    
    return filtered;
  }, [selectedFilter]);

  const totalAccidents = filteredData.length;
  const avgSeverity = filteredData.reduce((sum, d) => sum + d.severity, 0) / totalAccidents;
  const weatherRelated = filteredData.filter(d => d.weather !== 'Clear').length;
  const roadRelated = filteredData.filter(d => d.road !== 'Dry').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Traffic Accident Analytics</h1>
                <p className="text-gray-600">Comprehensive analysis of accident patterns and contributing factors</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search locations..." 
                  className="outline-none text-sm"
                />
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4 mt-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Accidents</option>
              <option value="severe">Severe Only</option>
              <option value="weather">Weather Related</option>
              <option value="road">Road Condition Related</option>
            </select>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Accidents"
            value={totalAccidents.toLocaleString()}
            change={-12}
            icon={Car}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Average Severity"
            value={avgSeverity.toFixed(1)}
            change={-8}
            icon={AlertTriangle}
            color="bg-gradient-to-r from-orange-500 to-red-500"
          />
          <StatCard
            title="Weather Related"
            value={`${Math.round((weatherRelated / totalAccidents) * 100)}%`}
            change={5}
            icon={Cloud}
            color="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
          <StatCard
            title="Road Conditions"
            value={`${Math.round((roadRelated / totalAccidents) * 100)}%`}
            change={-3}
            icon={MapPin}
            color="bg-gradient-to-r from-green-500 to-teal-500"
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <HourlyChart data={filteredData} />
          <WeatherAnalysis data={filteredData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HotspotMap data={filteredData} />
          <ContributingFactors data={filteredData} />
        </div>

        {/* Insights Panel */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Clock className="w-8 h-8 mb-2" />
              <h4 className="font-semibold mb-2">Peak Hours</h4>
              <p className="text-sm opacity-90">Most accidents occur during rush hours (7-9 AM, 5-7 PM) with severity increasing during evening commutes.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Thermometer className="w-8 h-8 mb-2" />
              <h4 className="font-semibold mb-2">Weather Impact</h4>
              <p className="text-sm opacity-90">Adverse weather conditions increase accident severity by 40% compared to clear conditions.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <MapPin className="w-8 h-8 mb-2" />
              <h4 className="font-semibold mb-2">Hotspot Concentration</h4>
              <p className="text-sm opacity-90">65% of severe accidents occur in just 20% of locations, indicating clear hotspot patterns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;