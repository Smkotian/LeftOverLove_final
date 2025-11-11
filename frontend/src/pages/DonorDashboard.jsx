import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Only need reverseGeocode here
import { reverseGeocode } from '../lib/map';
import L from 'leaflet';
import DonationCard from '../components/DonationCard';

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DonorDashboard() {
  const [form, setForm] = useState({
    eventName: '',
    foodType: '',
    quantity: '',
    location: '',
    contact: ''
  });
  const [marker, setMarker] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('none');
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [myDonations, setMyDonations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const geodebounceRef = useRef(null);
  const defaultCenter = [20.5937, 78.9629];

  useEffect(() => {
    fetchMyDonations();
  }, []);

  useEffect(() => {
    if (mapRef && marker) {
      try {
        mapRef.setView([marker.lat, marker.lng], 13);
      } catch (e) {
        // ignore
      }
      setSelectedLabel(`${marker.lat.toFixed(3)}, ${marker.lng.toFixed(3)}`);
    }
  }, [marker, mapRef]);

  const fetchMyDonations = async () => {
    try {
      const response = await api.get('/donations/my-donations');
      setMyDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, location: value }));

    if (geodebounceRef.current) clearTimeout(geodebounceRef.current);

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    geodebounceRef.current = setTimeout(async () => {
      setLoadingGeo(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
        const data = await res.json();
        if (data && data.length > 0) {
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        setSuggestions([]);
      }
      setLoadingGeo(false);
    }, 700);
  };

  const handleSuggestionClick = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setMarker({ lat, lng });
    setForm(prev => ({ ...prev, location: suggestion.display_name }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleMapCreated = (mapInstance) => {
    setMapRef(mapInstance);
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setMarker({ lat, lng });
    setShowSuggestions(false);
    setLoadingGeo(true);
    try {
      const addr = await reverseGeocode(lat, lng);
      if (addr) {
        setForm(prev => ({ ...prev, location: addr }));
      }
    } catch (err) {}
    setLoadingGeo(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.eventName || !form.foodType || !form.quantity || !form.location || !form.contact) {
      alert('Please fill all fields');
      return;
    }

    if (!marker || !marker.lat || !marker.lng) {
      alert('Please select a location on the map');
      return;
    }

    const payload = {
      eventName: form.eventName,
      foodType: form.foodType,
      quantity: form.quantity,
      location: form.location,
      contact: form.contact,
      lat: marker.lat,
      lng: marker.lng
    };

    setSubmitting(true);
    try {
      await api.post('/donations', payload);
      alert('Donation posted successfully!');
      setForm({
        eventName: '',
        foodType: '',
        quantity: '',
        location: '',
        contact: ''
      });
      setMarker(null);
      setSelectedLabel('none');
      setSuggestions([]);
      await fetchMyDonations();
    } catch (err) {
      alert('Error posting donation: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '42px' }}>
        <h2>Create Donation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              placeholder="Event Name"
              className="input"
            />
            <input
              type="text"
              name="foodType"
              value={form.foodType}
              onChange={handleChange}
              placeholder="Food Type"
              className="input"
            />
            <input
              type="text"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="input"
            />
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact (phone/email)"
              className="input"
            />
          </div>
          <div className="location-group">
            <label style={{ fontWeight: 600 }}>Location / Address</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleLocationChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Type location or click on map"
              className="input"
            />
            {loadingGeo && <p className="hint">Looking up location...</p>}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestions-item"
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="map-wrapper">
            <label style={{ fontWeight: 600 }}>Pick location on map</label>
            <div className="map-box">
              <MapContainer
                center={marker ? [marker.lat, marker.lng] : defaultCenter}
                zoom={marker ? 13 : 5}
                style={{ height: '100%', width: '100%' }}
                whenCreated={handleMapCreated}
                onClick={handleMapClick}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {marker && (
                  <Marker position={[marker.lat, marker.lng]} icon={icon}>
                    <Popup>
                      Selected: {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            <p className="hint" style={{ marginTop: '8px' }}>Selected: <strong>{selectedLabel}</strong></p>
          </div>
          <button type="submit" disabled={submitting} className="btn submit-btn">
            {submitting ? 'Posting…' : 'Post Donation'}
          </button>
        </form>
      </div>
      <div>
        <h2 style={{ marginBottom: '24px' }}>My Donations</h2>
        {myDonations.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>No donations posted yet.</p>
        ) : (
          myDonations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              showAction={false}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DonorDashboard;
