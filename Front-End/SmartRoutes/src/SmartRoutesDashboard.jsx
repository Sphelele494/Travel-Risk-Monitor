import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Navigation, SunMoon, LogOut, Funnel, X, TriangleAlert  } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ApiClient } from './lib/api-client';

export default function SmartRoutesDashboard() {
  const [activeTab, setActiveTab] = useState('map');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);    
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: '',
    title: '',
    description: '',
    location: '',
    severityLevel: 'medium',
    photoEvidence: null,
    reporter: ''
  });

  const notificationsMock = [
    { id: 1, message: "New road hazard reported in Randburg", time: "2m ago" },
    { id: 2, message: "Construction on N1 resolved", time: "1h ago" },
    { id: 3, message: "Power outage affecting traffic lights", time: "3h ago" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      photoEvidence: e.target.files[0]
    }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/login");
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const incidentPayload = {
    title: formData.title,
    location: formData.location,
    description: formData.description,
    reporter: formData.reporter || "anonymous",
    severity: formData.severityLevel,
    type: formData.incidentType,
    verified: false,
    likes: 0
  };

  try {
    const response = await fetch("http://localhost:8081/api/incidents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidentPayload),
    });

    if (!response.ok) {
      throw new Error("Failed to submit incident");
    }

    setShowReportForm(false);
    setFormData({
      incidentType: '',
      title: '',
      description: '',
      location: '',
      severityLevel: 'medium',
      reporter: '',
      photoEvidence: null,
    });

    alert("Incident reported successfully!");
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Failed to report incident.");
  }
};

const autofillLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setFormData((prev) => ({
        ...prev,
        location: `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`
      }));
    },
    (error) => {
      console.error("Location access denied or failed", error);
    }
  );
};

useEffect(() => {
  if (showReportForm) {
    autofillLocation();
  }
}, [showReportForm]);


  useEffect(() => {
    const getLocationAndFetchIncidents = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        console.log(data);

        const city = data.address.city || data.address.town || data.address.village || 'Johannesburg';

        fetchIncidentsByLocation(city);
      }, (error) => {
        console.error("Geolocation error:", error);
        fetchIncidentsByLocation("Johannesburg");
      });
    };

    getLocationAndFetchIncidents();
  }, []);

  const fetchIncidentsByLocation = async (location) => {
    try {
      const res = await fetch(`http://localhost:8081/api/incidents/by-location?location=${location}`);
      const data = await res.json();
      console.log(data);
      setIncidents(data);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSeverity = filter === 'all' || incident.severity === filter;
    const matchesType = type === 'all' || incident.type === type;
    const matchesSearch =
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.location.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesType && matchesSearch;
  });



  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-4">
      {/* Report Incident Modal */}
      <AnimatePresence>
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-h-[100vh] overflow-y-auto p-4 bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <TriangleAlert color="#ff0000" />
                <h2 className="text-lg font-semibold">Report New Incident</h2>
                <button 
                  onClick={() => setShowReportForm(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Type *
                  </label>
                  <select
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select incident type</option>
                    <option value="road hazard">Road Hazard</option>
                    <option value="crime">Crime</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="construction">Construction</option>
                    <option value="accident">Accident</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Brief title of the incident"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Detailed description of the incident"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Where did this happen?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity Level *
                  </label>
                  <select
                    name="severityLevel"
                    value={formData.severityLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo Evidence (Optional)
                  </label>
                  <input
                    type="file"
                    name="photoEvidence"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    accept="image/*"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporter (Optional)
                  </label>
                  <input
                    type="text"
                    name="reporter"
                    value={formData.reporter}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Your name or identifier"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    <header className="flex items-center justify-between p-4 bg-white shadow rounded-xl mb-6 relative">
      <div className="text-2xl font-bold text-black-600">
        <span className="flex items-center justify-center bg-orange-600 p-2 rounded-md mr-2 w-8 h-8 text-center text-white-600">
          <Navigation className="bg-white-600 text-white-600 w-5 h-5" color="#ffffff" />
        </span>
        SmartRoutes
        <div className="text-sm text-orange-500">South African Road Intelligence</div>
      </div>

      <div className="space-x-2 flex items-center relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 bg-white-500 rounded-full relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell color="#0d0d0d" className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {notificationsMock.length}
            </span>
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="p-4 font-semibold text-gray-700 border-b">Notifications</div>
              <ul className="max-h-64 overflow-y-auto">
                {notificationsMock.map((notification) => (
                  <li key={notification.id} className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">
                    <div className="font-medium">{notification.message}</div>
                    <div className="text-xs text-gray-400">{notification.time}</div>
                  </li>
                ))}
              </ul>
              {notificationsMock.length === 0 && (
                <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
              )}
            </div>
          )}
        </div>

        {/* Dark Mode */}
        <button className="p-2 bg-white-500 rounded-full">
          <SunMoon color="#0d0d0d" className="w-5 h-5" />
        </button>

        {/* Dashboard */}
        <button className="px-4 py-2 bg-white-500 text-orange-600 rounded-xl font-semibold">Dashboard</button>

        {/* Report */}
        <button
          onClick={() => setShowReportForm(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold"
        >
          + Report Incident
        </button>

        {/* Logout */}
        <button onClick={logout} className="p-2 bg-white-500 rounded-full">
          <LogOut color="#0d0d0d" className="w-5 h-5" />
        </button>
      </div>
    </header>

      <div className="text-center mb-6">
        <p className="text-lg font-medium">Welcome back, <span className="font-medium">{ JSON.parse(localStorage.getItem('Data')).fullName}</span> help keep South African roads safe by reporting incidents and staying informed.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-md text-blue-600">Total Reports</p>
          <p className="text-xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-md text-red-600">Critical Alerts</p>
          <p className="text-xl font-bold text-red-600">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-md text-green-600">Verified Reports</p>
          <p className="text-xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-md text-orange-600">Last Hour</p>
          <p className="text-xl font-bold text-orange-600">0</p>
        </div>
      </div>

   {/*   <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('map')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'map' ? 'bg-gray-50' : 'text-gray-500'}`}>Live Map</button>
          <button onClick={() => setActiveTab('feed')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'feed' ? 'bg-gray-50' : 'text-gray-500'}`}>Incident Feed</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h2 className="text-lg font-bold mb-2">Real-time Road Conditions</h2>
              <p className="text-sm text-gray-600 mb-4">Interactive map showing current road hazards and disruptions across South Africa</p>
              <div className="w-full h-64 bg-green-50 border rounded-xl flex items-center justify-center">
                <span className="text-yellow-500 text-4xl">⚡</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h2 className="text-lg font-bold mb-4">Incident Feed</h2>
              <div className="flex px-0">
                <Funnel color="#0d0d0d" />
                <h3 className="flex px-2 text-lg font mb-4">Filter Incident </h3>
              </div>
              <div className="mb-4 flex flex-col md:flex-row gap-2 md:items-center md:gap-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search incidents..."
                  className="p-2 rounded-lg border border-gray-300 w-full md:w-1/3"
                />
                <label className="text-sm font-medium">Severity</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 rounded-lg border border-gray-300">
                  <option value="all"> All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>

                <label className="text-sm font-medium">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 rounded-lg border border-gray-300">
                  <option value="all">All Types</option>
                  <option value="road hazard">Road Hazard</option>
                  <option value="crime">Crime</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="construction">Construction</option>
                </select>
              </div>
              <div className="space-y-4">
                {filteredIncidents.map((incident, index) => (
                  <div key={index} className="bg-orange-50 p-4 rounded-xl shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-md font-semibold text-blue-900">{incident.title}</h3>
                        <p className="text-sm text-gray-600">{incident.location} • {incident.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${incident.severity === 'critical' ? 'bg-red-200 text-red-800' : incident.severity === 'high' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>{incident.severity.toUpperCase()}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{incident.description}</p>
                    <div className="mt-2 text-xs text-gray-500">Reported by {incident.reporter} • {incident.verified ? 'Verified' : 'Unverified'} • ❤️ {incident.likes}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>*/}

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">Select an incident marker on the map to view details</div>
        <div className="text-sm text-gray-600">Recent Reports</div>
      </div>
    </div>
  );
}