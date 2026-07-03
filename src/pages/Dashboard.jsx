import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { Search, Copy, Check, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState({});
  const [referralShare, setReferralShare] = useState({});
  const [referrals, setReferrals] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc'); // default desc (Newest first)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Copy states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = async (searchQuery, sortOrder) => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('jwt_token');
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (sortOrder) params.append('sort', sortOrder);

      const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errMessage = `Error ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.message) {
            errMessage = `${errJson.message} (Status ${response.status})`;
          }
        } catch (_) {}
        throw new Error(errMessage);
      }

      const responseJson = await response.json();
      
      // Support nested in .data OR beside it at root level (as in the reference implementation)
      const root = responseJson?.data || responseJson || {};

      setMetrics(root.metrics || []);
      setServiceSummary(root.serviceSummary || {});
      setReferralShare(root.referral || {});
      setReferrals(root.referrals || []);
      
      // Reset to page 1 on new query/sort
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data, and re-fetch when sort changes
  useEffect(() => {
    fetchDashboardData(search, sort);
  }, [sort]);

  // Handle search typing with standard React input triggering API calls
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
  };

  // Trigger search fetch on button submit or debounce/enter
  // In addition, guidelines say "Typing here triggers a new API call", so let's hit the API.
  // To avoid hitting API on every single keystroke excessively, we can trigger fetch inside a setTimeout/useEffect.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Avoid calling on initial render since the other useEffect handles that, 
      // but standard React flow can just run it.
      fetchDashboardData(search, sort);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleCopyLink = () => {
    if (referralShare?.link) {
      navigator.clipboard.writeText(referralShare.link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (referralShare?.code) {
      navigator.clipboard.writeText(referralShare.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

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

  // Pagination calculation
  const totalItems = referrals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReferrals = referrals.slice(startIndex, endIndex);
  
  const showFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showTo = Math.min(endIndex, totalItems);

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <header className="dashboard-header">
          <h1>Referral Dashboard</h1>
          <p>Track your referrals, earnings, and partner activity in one place.</p>
        </header>

        {error && (
          <div className="alert-region" role="alert">
            <div className="form-error">
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading && referrals.length === 0 ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Overview Section */}
            <section className="dashboard-grid" role="region" aria-label="Overview metrics">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card">
                  <h3 className="card-title">Overview</h3>
                  <div className="metrics-grid">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="metric-card">
                        <div className="metric-label">{metric.label}</div>
                        <div className="metric-value">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Summary Section */}
                <div className="card summary-card" role="region" aria-label="Service summary">
                  <h3 className="card-title">Service summary</h3>
                  <div className="summary-list">
                    <div className="summary-item">
                      <span className="summary-label">Service</span>
                      <span className="summary-value">{serviceSummary.service || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Your Referrals</span>
                      <span className="summary-value">{serviceSummary.yourReferrals || '0'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Active Referrals</span>
                      <span className="summary-value">{serviceSummary.activeReferrals || '0'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Ref. Earnings</span>
                      <span className="summary-value">{formatProfit(serviceSummary.totalRefEarnings)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Referral Section */}
              <div className="card" role="region" aria-label="Share referral">
                <h3 className="card-title">Refer friends and earn more</h3>
                <div className="share-section">
                  <div className="share-group">
                    <span className="share-label">Your Referral Link</span>
                    <div className="share-input-wrapper">
                      <input
                        type="text"
                        readOnly
                        value={referralShare.link || ''}
                        className="share-input"
                      />
                      <button onClick={handleCopyLink} className={`btn-copy ${copiedLink ? 'copied' : ''}`}>
                        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="share-group">
                    <span className="share-label">Your Referral Code</span>
                    <div className="share-input-wrapper">
                      <input
                        type="text"
                        readOnly
                        value={referralShare.code || ''}
                        className="share-input"
                      />
                      <button onClick={handleCopyCode} className={`btn-copy ${copiedCode ? 'copied' : ''}`}>
                        {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Referrals Table Section */}
            <section className="card table-card">
              <div className="table-header-controls">
                <h2 style={{ fontSize: '1.25rem' }}>All referrals</h2>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div className="search-wrapper">
                    <Search className="search-icon" size={16} />
                    <input
                      type="text"
                      placeholder="Name or service..."
                      value={search}
                      onChange={handleSearchChange}
                      className="search-input"
                      aria-label="Search referrals"
                    />
                  </div>

                  <div className="sort-wrapper">
                    <label htmlFor="sort-select">Sort by date</label>
                    <select
                      id="sort-select"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="sort-select"
                    >
                      <option value="desc">Newest first</option>
                      <option value="asc">Oldest first</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="referrals-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReferrals.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-state">
                          No matching entries
                        </td>
                      </tr>
                    ) : (
                      currentReferrals.map((row) => (
                        <tr key={row.id} onClick={() => navigate(`/referral/${row.id}`)}>
                          <td className="cell-name">{row.name}</td>
                          <td className="cell-service">{row.serviceName}</td>
                          <td>{formatDate(row.date)}</td>
                          <td className="cell-profit">{formatProfit(row.profit)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="table-footer">
                <div className="table-summary">
                  Showing {showFrom}–{showTo} of {totalItems} entries
                </div>

                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-page"
                  >
                    Previous
                  </button>
                  {totalPages > 1 &&
                    Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`btn-page ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="btn-page"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">Go Business</div>
          <nav className="footer-nav" aria-label="Footer">
            <a href="#about" className="footer-link">About</a>
            <a href="#privacy" className="footer-link">Privacy</a>
          </nav>
          <div className="footer-copyright">© 2024 Go Business</div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
