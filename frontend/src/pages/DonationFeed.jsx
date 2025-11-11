import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import DonationCard from '../components/DonationCard';

function DonationFeed() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get('/donations/pending');
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleAccept = async (donationId) => {
    try {
      await api.put(`/donations/${donationId}/accept`);
      // Remove the accepted donation from the list
      setDonations(prev => prev.filter(d => d._id !== donationId));
      // Redirect to tracking page
      navigate('/tracking', { replace: true });
    } catch (error) {
      console.error('Error accepting donation:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#4a3f35]">Available Donations</h2>
      {donations.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No pending donations available.</p>
      ) : (
        donations.map((donation) => (
          <DonationCard
            key={donation._id}
            donation={donation}
            showAction={true}
            actionLabel="Accept Donation"
            onAction={() => handleAccept(donation._id)}
          />
        ))
      )}
    </div>
  );
}

export default DonationFeed;
