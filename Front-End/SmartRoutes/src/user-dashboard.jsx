import React, { useState, useRef } from 'react';
import { UserIcon, CalendarIcon, MapPinIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { LuSquarePen } from "react-icons/lu";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'khanyo.railo03@gmail.com',
    password: '',
    newPassword: '',
    language: 'en',
    profilePicture: null,
    icon: '👤'
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsEditModalOpen(false);
  };

  const selectIcon = (icon) => {
    setFormData(prev => ({ ...prev, icon, profilePicture: null }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300">
        <h3 className="text-xl font-bold text-gray-800">User Dashboard</h3>
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          {formData.profilePicture ? (
            <img 
              src={formData.profilePicture} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="relative bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start">
            <div className="mr-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">{formData.icon}</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900">{formData.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Beginner
                </span>
              </div>

              <div className="space-y-1 text-gray-600">
                <p className="text-sm">{formData.email}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
                    <span>Joined 6/23/2025</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
                    <span>Johannesburg, South Africa</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <LuSquarePen className="w-4 h-4 mr-2 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={() => setIsEditModalOpen(false)}
            ></div>
            
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto p-4 flex-1">
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
                      {formData.profilePicture ? (
                        <img 
                          src={formData.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">{formData.icon}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100"
                    >
                      Upload Photo
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleCurrentPasswordVisibility}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-500"
                    >
                      {showCurrentPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-500"
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {!formData.profilePicture && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">User Icon</label>
                      <div className="flex space-x-2">
                        {['👤', '👨', '👩', '🧑'].map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => selectIcon(icon)}
                            className={`w-10 h-10 flex items-center justify-center border rounded-full text-xl transition-colors ${
                              formData.icon === icon ? 'bg-orange-100 border-orange-500' : 'hover:bg-gray-100'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    >
                      <option value="en">English</option>
                      <option value="af">Afrikaans</option>
                      <option value="zu">Zulu</option>
                    </select>
                  </div>
                </div>
              </form>

              <div className="flex justify-end space-x-3 p-4 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-profile-form"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}