import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, MapPinIcon, SunIcon, ArrowRightOnRectangleIcon, FunnelIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Navigation, MapPin } from "lucide-react";
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons (Leaflet issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to auto-center map on user's location
function LocateUser() {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      map.flyTo(e.latlng, 13); // Zoom level 13
    });
  }, [map]);

  return null;
}

export default function SmartRoutesDashboard() {
  const [activeTab, setActiveTab] = useState('map');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);    
  const [incidents, setIncidents] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photoEvidence: e.target.files[0] }));
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentPayload),
      });

      if (!response.ok) throw new Error("Failed to submit incident");
      
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
        setFormData(prev => ({
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
    if (showReportForm) autofillLocation();
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
      setIncidents(data);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation({ lat: -26.2041, lng: 28.0473 });
        }
      );
    }
  }, []);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSeverity = filter === 'all' || incident.severity === filter;
    const matchesType = type === 'all' || incident.type === type;
    const matchesSearch =
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.location.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesType && matchesSearch;
  });

  // Input Address Modal
  const addAddress = () => {
    document.getElementById("addModal");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <AnimatePresence>
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-h-[100vh] overflow-y-auto p-4 bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Report New Incident</h2>
                <button 
                  onClick={() => setShowReportForm(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type *</label>
                  <select
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Brief title of the incident"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="3"
                    placeholder="Detailed description of the incident"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Where did this happen?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level *</label>
                  <select
                    name="severityLevel"
                    value={formData.severityLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo Evidence (Optional)</label>
                  <input
                    type="file"
                    name="photoEvidence"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    accept="image/*"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reporter (Optional)</label>
                  <input
                    type="text"
                    name="reporter"
                    value={formData.reporter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Your name or identifier"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-orange-600 rounded-md flex items-center justify-center mr-3">
            <Navigation className="text-white-600 w-5 h-5" color="#ffffff" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartRoutes</h1>
            <p className="text-sm text-orange-600">South African Road Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon className="h-5 w-5 text-gray-600" />
            {notificationsMock.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationsMock.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-4 mt-40 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 font-semibold text-gray-700 border-b">Notifications</div>
              <ul className="max-h-64 overflow-y-auto">
                {notificationsMock.map((notification) => (
                  <li key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-800">{notification.message}</div>
                    <div className="text-xs text-gray-400">{notification.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="p-2 rounded-full hover:bg-gray-100">
            <SunIcon className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center justify-center text-orange-600 font-normal">
            <Link to="/user-dashboard" className="text-orange-500 hover:underline font-medium">
              User-Dashboard
            </Link>
          </div>

          <button
            onClick={() => setShowReportForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-700"
          >
            + Report Incident
          </button>

          <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
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
        <div className="flex items-center justify-center">
          <p className="text-lg font-medium text-gray-700">
          Welcome back, <span className="font-semibold">"User Name"</span> where to next? 
        </p>
        <div onClick={addAddress} className="flex items-center justify-center px-4 py-2 mx-2 bg-orange-500 text-white border border-transparent rounded-md shadow-md hover:bg-white hover:text-orange-500 hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
            Enter Address
        </div>
        </div>

        <div className="flex justify-center items-center my-4" id='addModal'>
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter your destination address.</h1>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 my-4 bg-white shadow-sm hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300">
                <MapPin className="h-5 w-5 text-gray-400"/>
                <input 
                type="text" 
                name="address"
                placeholder="Destination address..." 
                className="ml-2 w-full outline-none text-sm text-gray-700 bg-transparent" 
                value={formData.username}
                onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <button 
                type="submit"
                className="flex justify-center items-center w-full px-6 py-2 bg-orange-500 text-white border border-transparent rounded-md shadow-md hover:bg-white hover:text-orange-500 hover:border-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.3)] transition duration-300"
              >
                Submit
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

   {/*   <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('map')} 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'map' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'}`}
          >
            Live Map
          </button>
          <button 
            onClick={() => setActiveTab('feed')} 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'feed' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'}`}
          >
            Incident Feed
          </button>
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
              <h2 className="text-lg font-bold text-gray-800 mb-2">Real-time Road Conditions</h2>
              <p className="text-sm text-gray-600 mb-4">
                Interactive map showing current road hazards and disruptions across South Africa
              </p>
              
              {userLocation ? (
                <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>Your Location</Popup>
                    </Marker>
                    <LocateUser />
                  </MapContainer>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Loading map...</p>
                </div>
              )}
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
              <h2 className="text-lg font-bold text-gray-800 mb-4">Incident Feed</h2>
              <div className="flex items-center mb-4">
                <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-md font-medium text-gray-700">Filter Incident</h3>
              </div>
              <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search incidents..."
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full md:w-1/3"
                />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Types</option>
                  <option value="road hazard">Road Hazard</option>
                  <option value="crime">Crime</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="construction">Construction</option>
                </select>
              </div>
              <div className="space-y-4">
                {filteredIncidents.map((incident, index) => (
                  <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-md font-semibold text-gray-800">{incident.title}</h3>
                        <p className="text-sm text-gray-600">{incident.location} • {incident.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        incident.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                        incident.severity === 'high' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{incident.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Reported by {incident.reporter} • {incident.verified ? 'Verified' : 'Unverified'} • ❤️ {incident.likes}
                    </div>
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
    </div>
  );
}