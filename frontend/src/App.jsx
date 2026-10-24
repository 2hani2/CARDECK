
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();

        if (search.trim()) params.set('search', search.trim());
        if (category) params.set('category', category);
        if (minPrice !== '') params.set('minPrice', minPrice);
        if (maxPrice !== '') params.set('maxPrice', maxPrice);

        const query = params.toString();
        const url = `http://localhost:3000/api/vehicles${query ? `?${query}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Could not load vehicles.');
        }

        const data = await response.json();
        setVehicles(data.vehicles);
      } catch (err) {
        setError(
          'Unable to connect to the backend. Make sure your API server is running on port 3000.'
        );
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(fetchVehicles, 250);
    return () => clearTimeout(timeout);
  }, [search, category, minPrice, maxPrice]);

  function clearFilters() {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  }

  return (
    <main className="inventory-page">
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-icon">C</span>
          <span>CAR<span className="brand-accent">DECK</span></span>
        </a>
        <span className="header-label">VEHICLE INVENTORY</span>
      </header>

      <section className="hero">
        <p className="eyebrow">FIND YOUR NEXT DRIVE</p>
        <h1>Find the car that<br />moves you.</h1>
        <p className="hero-description">
          Explore our inventory and discover your next vehicle.
        </p>
      </section>

      <section className="inventory">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR COLLECTION</p>
            <h2>Available vehicles</h2>
          </div>
          <span className="vehicle-count">
            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
          </span>
        </div>

        <div className="filters">
          <label className="search-field">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search make or model..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Luxury">Luxury</option>
            </select>
          </label>

          <label>
            <span>Minimum price (₹)</span>
            <input
              type="number"
              min="0"
              placeholder="No minimum"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </label>

          <label>
            <span>Maximum price (₹)</span>
            <input
              type="number"
              min="0"
              placeholder="No maximum"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </label>

          <button className="clear-button" onClick={clearFilters}>
            Clear
          </button>
        </div>

        {loading ? (
          <p className="state-message">Loading inventory...</p>
        ) : error ? (
          <p className="state-message error-message">{error}</p>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <h3>No vehicles found</h3>
            <p>Try changing your search or clearing the filters.</p>
            <button className="primary-button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <article className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-image">
                  <span className="vehicle-category">{vehicle.category}</span>
                  <span className="car-symbol">🚘</span>
                </div>
                <div className="vehicle-details">
                  <p className="vehicle-make">{vehicle.make}</p>
                  <h3>{vehicle.model}</h3>
                  <div className="vehicle-meta">
                    <span>Stock: {vehicle.quantity}</span>
                    <span>ID: {vehicle.id}</span>
                  </div>
                  <div className="vehicle-footer">
                    <div>
                      <span className="price-label">PRICE</span>
                      <p className="vehicle-price">
                        ₹{Number(vehicle.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="stock-badge">
                      {vehicle.quantity > 0 ? 'In stock' : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">
        CARDECK <span>·</span> YOUR NEXT DRIVE STARTS HERE
      </footer>
    </main>
  );
}

export default App;
