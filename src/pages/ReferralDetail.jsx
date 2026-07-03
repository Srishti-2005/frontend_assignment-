import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';

const ReferralDetail = () => {
  const { id } = useParams();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get('jwt_token');
        const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // 404 response or non-success
        if (response.status === 404) {
          setReferral(null);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const responseJson = await response.json();
        
        // Robust parser to search both nested data properties and array variants
        const root = responseJson?.data || responseJson || {};
        let foundItem = null;

        if (root.id && root.id.toString() === id.toString()) {
          foundItem = root;
        } else if (Array.isArray(root.referrals)) {
          foundItem = root.referrals.find((item) => item.id && item.id.toString() === id.toString());
        } else if (Array.isArray(root)) {
          foundItem = root.find((item) => item.id && item.id.toString() === id.toString());
        } else if (root.referral && root.referral.id && root.referral.id.toString() === id.toString()) {
          foundItem = root.referral;
        }

        setReferral(foundItem);
      } catch (err) {
        setError(err.message || 'Failed to load referral details.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralDetails();
  }, [id]);

  // Format Helper functions
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.substring(0, 10).replace(/-/g, '/');
  };

  const formatProfit = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {loading ? (
          <div className="loader-container">
            <Loader2 size={40} className="spinner" />
            <p style={{ color: 'var(--text-secondary)' }}>Fetching details...</p>
          </div>
        ) : error ? (
          <div className="detail-card card" style={{ textAlign: 'center' }}>
            <div className="form-error" role="alert" style={{ marginBottom: '1.5rem' }}>
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
            <Link to="/" className="detail-back-link" aria-label="Back to dashboard">
              <ArrowLeft size={16} />
              ← Back to dashboard
            </Link>
          </div>
        ) : !referral ? (
          <div className="detail-card card" style={{ textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Referral not found</h1>
            <Link to="/" className="detail-back-link" aria-label="Back to dashboard">
              <ArrowLeft size={16} />
              ← Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="detail-card card">
            <div className="detail-header">
              <h1>Referral Details</h1>
              <h2 className="detail-partner-name">{referral.name}</h2>
            </div>

            <dl className="detail-list">
              <div className="detail-row">
                <dt className="detail-label">Referral ID</dt>
                <dd className="detail-value">{referral.id}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-label">Service Name</dt>
                <dd className="detail-value">{referral.serviceName}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-label">Date</dt>
                <dd className="detail-value">{formatDate(referral.date)}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-label">Profit</dt>
                <dd className="detail-value profit">{formatProfit(referral.profit)}</dd>
              </div>
            </dl>

            <Link to="/" className="detail-back-link" aria-label="Back to dashboard">
              <ArrowLeft size={16} />
              ← Back to dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReferralDetail;
