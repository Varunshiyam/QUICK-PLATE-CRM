import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-page">
      <h1>Order Analytics Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>24</h2>
          <p>Weekly Orders</p>
        </div>

        <div className="stat-card">
          <h2>128</h2>
          <p>Monthly Orders</p>
        </div>

        <div className="stat-card">
          <h2>1420</h2>
          <p>Yearly Orders</p>
        </div>

        <div className="stat-card">
          <h2>3500+</h2>
          <p>Lifetime Orders</p>
        </div>

        <div className="stat-card">
          <h2>$12.4k</h2>
          <p>Total Spending</p>
        </div>
        <div className="stat-card">
         <h2>89%</h2>
         <p>Customer Satisfaction</p>
        </div>
      </div>

     <div className="insights-section">
  <h2>Insights & Trends</h2>

  <div className="insights-grid">
    <div className="insight-card">
      <span className="insight-icon">🔥</span>
      <div>
        <h3>Busiest Day</h3>
        <p>Friday is your most active ordering day.</p>
      </div>
    </div>

    <div className="insight-card">
      <span className="insight-icon">🍕</span>
      <div>
        <h3>Top Category</h3>
        <p>Pizza remains your most ordered category.</p>
      </div>
    </div>

    <div className="insight-card">
      <span className="insight-icon">📈</span>
      <div>
        <h3>Growth</h3>
        <p>Your orders increased by 18% this month.</p>
      </div>
    </div>
  </div>
</div>
      </div>
    
  );
}

export default Dashboard;