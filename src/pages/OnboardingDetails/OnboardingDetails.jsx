import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { auth } from '../../services/firebase';
import useHaptic from '../../hooks/useHaptic';
import './OnboardingDetails.css';

const OnboardingDetails = () => {
  const navigate = useNavigate();
  const { lightTap, mediumTap, heavyTap } = useHaptic();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
  });
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUseLocation = () => {
    lightTap();
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocationLoading(true);
    toast.loading('Detecting location...', { id: 'location-toast' });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Simple reverse geocoding via OpenStreetMap 
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
            toast.success('Location found!', { id: 'location-toast' });
          } else {
            setAddress(`${latitude}, ${longitude}`);
            toast.success('Coordinates saved!', { id: 'location-toast' });
          }
        } catch (error) {
          setAddress(`${pos.coords.latitude}, ${pos.coords.longitude}`);
          toast.success('Coordinates saved!', { id: 'location-toast' });
        } finally {
          setIsLocationLoading(false);
        }
      },
      (err) => {
        toast.error('Failed to get location. Please allow permissions.', { id: 'location-toast' });
        setIsLocationLoading(false);
      }
    );
  };

  const handleSubmit = async () => {
    mediumTap();
    
    // Validation
    if (!form.fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    
    // Basic phone validation for at least 10 digits
    const cleanedPhone = form.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      toast.error('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    if (!address) {
      toast.error('Please set your delivery address.');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Authentication error. Please log in again.');
      navigate('/onboarding');
      return;
    }

    setIsLoading(true);

    try {
      const idToken = await currentUser.getIdToken(true);
      
      await axios.patch(`${API_BASE_URL}/services/apexrest/customer/profile`, {
        idToken,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: address
      });

      heavyTap();
      toast.success('Profile created successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Profile update failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to sync profile. Try again.';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Server error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="obd-page">
      {/* Background decoration */}
      <div className="obd-bg-icon">
        <span className="material-symbols-outlined">restaurant</span>
      </div>

      <div className="obd-content">
        <div className="obd-header">
          <div className="obd-icon-badge">
            <span className="material-symbols-outlined">restaurant_menu</span>
          </div>
          <h1 className="obd-title">
            Welcome to the <span className="obd-primary-text">Premium</span> Experience
          </h1>
          <p className="obd-subtitle">
            Join our exclusive community for seamless dining and lightning-fast delivery.
          </p>
        </div>

        <div className="obd-section">
          <label className="obd-label">Set Delivery Address</label>
          <button 
            className="obd-location-btn" 
            onClick={handleUseLocation}
            disabled={isLocationLoading}
          >
            <div className="obd-location-btn-left">
              <div className="obd-location-icon-wrapper">
                <span className="material-symbols-outlined">
                  {isLocationLoading ? 'hourglass_empty' : 'my_location'}
                </span>
              </div>
              <div className="obd-location-text">
                <p className="obd-location-title">
                  {address ? 'Location Set' : 'Use Current Location'}
                </p>
                <p className="obd-location-sub">
                  {address ? (address.length > 35 ? address.substring(0, 35) + '...' : address) : 'Fastest way to get started'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined obd-chevron">chevron_right</span>
          </button>
        </div>

        <div className="obd-form-group">
          <div className="obd-input-wrapper">
            <label className="obd-label">Full Name</label>
            <div className="obd-input-box">
              <span className="material-symbols-outlined obd-input-icon">person</span>
              <input
                className="obd-input"
                name="fullName"
                placeholder="John Doe"
                type="text"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="obd-input-wrapper">
            <label className="obd-label">Phone Number</label>
            <div className="obd-input-box">
              <span className="material-symbols-outlined obd-input-icon">call</span>
              <input
                className="obd-input"
                name="phone"
                placeholder="+1 (555) 000-0000"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="obd-spacer"></div>

        <div className="obd-footer">
          <button 
            className="obd-submit-btn" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Start Exploring'}
            {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
          
          <p className="obd-legal-text">
            By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDetails;
