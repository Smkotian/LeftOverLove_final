import React from 'react';

export default function DonationCard({
  donation,
  showAction = false,
  actionLabel = '',
  onAction,
  actionDisabled = false,
  statusRight = true,
  children
}) {
  const statusClass = donation.status === 'received'
    ? 'status-pill status-delivered'
    : donation.status === 'accepted'
    ? 'status-pill status-accepted'
    : 'status-pill';

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{donation.eventName}</div>
        {statusRight && <span className={statusClass}>{donation.status}</span>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', fontSize: 15 }}>
        <span><strong>Food:</strong> {donation.foodType}</span>
        <span><strong>Qty:</strong> {donation.quantity}</span>
        <span><strong>Location:</strong> {donation.location}</span>
        <span><strong>Contact:</strong> {donation.contact}</span>
      </div>
      {children}
      {showAction && (
        <button onClick={onAction} disabled={actionDisabled} className="btn" style={{ marginTop: 12, width: 'fit-content' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
