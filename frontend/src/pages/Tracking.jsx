import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DonationCard from '../components/DonationCard';

// Fix for marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function Tracking() {
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user
  const defaultPosition = [20.5937, 78.9629];

  useEffect(() => {
    fetchAcceptedDonations();
  }, []);

  const fetchAcceptedDonations = async () => {
    try {
      const response = await api.get('/donations/accepted');
      setAcceptedDonations(response.data);
    } catch (error) {
      console.error('Error fetching accepted donations:', error);
    }
  };

  const handleReceived = async (donationId) => {
    try {
      await api.put(`/donations/${donationId}/received`);
      navigate('/thank-you', { replace: true });
    } catch (error) {
      console.error('Error marking donation as received:', error);
    }
  };

  const isNGO = user?.role === 'ngo';

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="container">
      <div className="tracking-grid">
        <div className="map-box" style={{ height: '500px' }}>
          <MapContainer
            center={defaultPosition}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {acceptedDonations.map((donation) => (
              donation.lat && donation.lng ? (
                <Marker
                  key={donation._id}
                  position={[parseFloat(donation.lat), parseFloat(donation.lng)]}
                  icon={icon}
                >
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{donation.foodType}</h3>
                      <p style={{ margin: '2px 0' }}>Quantity: {donation.quantity}</p>
                      <p style={{ margin: '2px 0' }}>Location: {donation.location}</p>
                      {isNGO && (
                        <button
                          onClick={() => handleReceived(donation._id)}
                          className="btn btn-accent"
                          style={{ width: '100%', marginTop: 8 }}
                        >
                          Mark as Received
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
        <div>
          <h2 style={{ marginBottom: 24 }}>Accepted Donations</h2>
          {acceptedDonations.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>No accepted donations to display.</p>
          ) : (
            acceptedDonations.map((donation) => (
              <DonationCard
                key={donation._id}
                donation={donation}
                showAction={isNGO && donation.status !== 'received'}
                actionLabel="Mark as Received"
                onAction={() => handleReceived(donation._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Tracking;
