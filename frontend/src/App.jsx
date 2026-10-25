import { useEffect, useState } from 'react';
import './App.css';
import './HomePage.css';
import Auth from './Auth.jsx';

const API_URL = 'http://localhost:3000/api';

const emptyVehicle = {
  make: '',
  model: '',
  category: 'Sedan',
  price: '',
  quantity: '0',
};


// Extra browseable showcase listings so the catalogue has a useful range even
// when the database currently contains only a few vehicles. These are demo
// listings for the UI; add real inventory through the admin form when ready.
const showcaseVehicles = [
  { id: 'sample-1', make: 'Toyota', model: 'Fortuner', category: 'SUV', price: 4200000, quantity: 2 },
  { id: 'sample-2', make: 'Honda', model: 'City', category: 'Sedan', price: 1250000, quantity: 3 },
  { id: 'sample-3', make: 'BMW', model: '3 Series', category: 'Luxury', price: 7200000, quantity: 1 },
  { id: 'sample-4', make: 'Mercedes-Benz', model: 'C-Class', category: 'Luxury', price: 6900000, quantity: 1 },
  { id: 'sample-5', make: 'Hyundai', model: 'i20', category: 'Hatchback', price: 950000, quantity: 4 },
  { id: 'sample-6', make: 'Tata', model: 'Nexon EV', category: 'Electric', price: 1750000, quantity: 2 },
  { id: 'sample-7', make: 'Mahindra', model: 'XUV700', category: 'SUV', price: 2450000, quantity: 2 },
  { id: 'sample-8', make: 'Porsche', model: '911 Carrera', category: 'Sports', price: 22000000, quantity: 1 },
  { id: 'sample-9', make: 'Audi', model: 'A5 Cabriolet', category: 'Convertible', price: 8500000, quantity: 1 },
  { id: 'sample-10', make: 'Lamborghini', model: 'Huracan', category: 'Supercar', price: 35000000, quantity: 1 },
  { id: 'sample-11', make: 'Maruti Suzuki', model: 'Ertiga', category: 'MPV', price: 1150000, quantity: 3 },
  { id: 'sample-12', make: 'Toyota', model: 'Camry Hybrid', category: 'Hybrid', price: 4800000, quantity: 1 },
  { id: 'sample-13', make: 'Isuzu', model: 'D-Max V-Cross', category: 'Pickup', price: 2500000, quantity: 1 },
  { id: 'sample-14', make: 'Volkswagen', model: 'Golf GTI', category: 'Hatchback', price: 5000000, quantity: 1 },
  { id: 'sample-15', make: 'BMW', model: 'M4 Coupe', category: 'Coupe', price: 15500000, quantity: 1 },
];

function carImageFor(vehicle, index = 0) {
  const make = `${vehicle?.make || ''} ${vehicle?.model || ''}`.toLowerCase();
  if (make.includes('porsche')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85';
  if (make.includes('bmw')) return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85';
  if (make.includes('mercedes')) return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85';
  if (make.includes('toyota')) return 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=85';
  if (make.includes('honda')) return 'https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?auto=format&fit=crop&w=1200&q=85';
  const images = [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
  ];
  const imageIndex = Number.isFinite(Number(index)) ? Math.abs(Number(index)) : 0;
  return images[imageIndex % images.length];
}

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [authData, setAuthData] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('cardeck_auth');

      if (!savedAuth) return null;

      const parsedAuth = JSON.parse(savedAuth);

      if (!parsedAuth.token || !parsedAuth.user) return null;

      const tokenParts = parsedAuth.token.split('.');
      if (tokenParts.length !== 3) return null;

      const payload = JSON.parse(atob(tokenParts[1]));

      if (!payload.exp || payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem('cardeck_auth');
        return null;
      }

      return parsedAuth;
    } catch {
      localStorage.removeItem('cardeck_auth');
      return null;
    }
  });
  const [showAuth, setShowAuth] = useState(false);
  const [page, setPage] = useState(() => {
    try {
      const saved = localStorage.getItem('cardeck_auth');
      return saved ? 'inventory' : 'home';
    } catch {
      return 'home';
    }
  });

  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [purchasingId, setPurchasingId] = useState(null);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deliveryStep, setDeliveryStep] = useState('details');
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const isAdmin = authData?.user?.role === 'admin';

  async function fetchVehicles() {
    setLoading(true);
    setError('');

    try {
      // Fetch the real inventory without server-side filters, then combine it
      // with showcase listings and apply the filters to the complete catalogue.
      const response = await fetch(`${API_URL}/vehicles`);

      if (!response.ok) {
        throw new Error('Could not load vehicles.');
      }

      const data = await response.json();
      const realVehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
      const realKeys = new Set(realVehicles.map((vehicle) =>
        `${String(vehicle.make).toLowerCase()}|${String(vehicle.model).toLowerCase()}`
      ));
      const extraVehicles = showcaseVehicles.filter((vehicle) =>
        !realKeys.has(`${vehicle.make.toLowerCase()}|${vehicle.model.toLowerCase()}`)
      );
      let catalogue = [...realVehicles, ...extraVehicles];

      if (search.trim()) {
        const term = search.trim().toLowerCase();
        catalogue = catalogue.filter((vehicle) =>
          `${vehicle.make} ${vehicle.model} ${vehicle.category}`.toLowerCase().includes(term)
        );
      }
      if (category) {
        catalogue = catalogue.filter((vehicle) => vehicle.category === category);
      }
      if (minPrice !== '') {
        catalogue = catalogue.filter((vehicle) => Number(vehicle.price) >= Number(minPrice));
      }
      if (maxPrice !== '') {
        catalogue = catalogue.filter((vehicle) => Number(vehicle.price) <= Number(maxPrice));
      }
      setVehicles(catalogue);
    } catch {
      // Keep the showcase browseable even if the backend is temporarily offline.
      let catalogue = showcaseVehicles;
      if (search.trim()) {
        const term = search.trim().toLowerCase();
        catalogue = catalogue.filter((vehicle) =>
          `${vehicle.make} ${vehicle.model} ${vehicle.category}`.toLowerCase().includes(term)
        );
      }
      if (category) catalogue = catalogue.filter((vehicle) => vehicle.category === category);
      if (minPrice !== '') catalogue = catalogue.filter((vehicle) => Number(vehicle.price) >= Number(minPrice));
      if (maxPrice !== '') catalogue = catalogue.filter((vehicle) => Number(vehicle.price) <= Number(maxPrice));
      setVehicles(catalogue);
      setError('Showing showcase cars. Start the backend to load and manage your saved inventory.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchVehicles, 250);
    return () => clearTimeout(timeout);
  }, [search, category, minPrice, maxPrice]);

  function clearFilters() {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  }

  function handleLogout() {
    localStorage.removeItem('cardeck_auth');
    setAuthData(null);
    setShowAuth(false);
    setPage('home');
    closeVehicleForm();
  }

  function closeVehicleForm() {
    setShowVehicleForm(false);
    setEditingId(null);
    setVehicleForm(emptyVehicle);
    setFormMessage('');
    setFormError('');
  }

  function startAddVehicle() {
    setEditingId(null);
    setVehicleForm(emptyVehicle);
    setFormMessage('');
    setFormError('');
    setShowVehicleForm(true);
  }

  function startEditVehicle(vehicle) {
    setEditingId(vehicle.id);
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: String(vehicle.price),
      quantity: String(vehicle.quantity),
    });
    setFormMessage('');
    setFormError('');
    setShowVehicleForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setVehicleForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleVehicleSubmit(event) {
    event.preventDefault();
    setFormMessage('');
    setFormError('');

    if (!authData?.token || !isAdmin) {
      setFormError('Admin sign-in is required for this action.');
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;
      const url = isEditing
        ? `${API_URL}/vehicles/${editingId}`
        : `${API_URL}/vehicles`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          ...vehicleForm,
          price: Number(vehicleForm.price),
          quantity: Number(vehicleForm.quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save vehicle.');
      }

      setFormMessage(data.message || 'Vehicle saved successfully.');
      setEditingId(null);
      setVehicleForm(emptyVehicle);
      await fetchVehicles();
    } catch (err) {
      setFormError(err.message || 'Unable to save vehicle.');
    } finally {
      setSaving(false);
    }
  }

  function handlePurchaseVehicle(vehicle) {
    setPurchaseError('');
    setPurchaseMessage('');

    if (!authData?.token) {
      setShowAuth(true);
      return;
    }

    if (String(vehicle.id).startsWith('sample-')) {
      setPurchaseError(
        'This is a showcase vehicle. Please select a vehicle from the saved inventory.'
      );
      return;
    }

    if (Number(vehicle.quantity) <= 0) {
      setPurchaseError('This vehicle is out of stock.');
      return;
    }

    setSelectedVehicle(vehicle);
    setDeliveryStep('details');
    setDeliveryDetails({
      fullName: authData.user?.name || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
    });
  }

  function handleDeliveryChange(event) {
    const { name, value } = event.target;

    setDeliveryDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function confirmVehiclePurchase() {
    if (!selectedVehicle || !authData?.token) return;

    if (
      !deliveryDetails.fullName.trim() ||
      !deliveryDetails.phone.trim() ||
      !deliveryDetails.address.trim() ||
      !deliveryDetails.city.trim() ||
      !deliveryDetails.state.trim() ||
      !/^\d{6}$/.test(deliveryDetails.pinCode)
    ) {
      setPurchaseError(
        'Please complete all delivery fields and enter a valid 6-digit PIN code.'
      );
      return;
    }

    if (!/^[0-9+() -]{7,20}$/.test(deliveryDetails.phone)) {
      setPurchaseError('Please enter a valid phone number.');
      return;
    }

    setPurchasingId(selectedVehicle.id);
    setPurchaseError('');

    try {
      const response = await fetch(
        `${API_URL}/vehicles/${selectedVehicle.id}/purchase`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to complete the purchase.'
        );
      }

      setSelectedVehicle(null);
      setDeliveryStep('details');
      setPurchaseMessage(
        `Purchase confirmed for ${selectedVehicle.make} ${selectedVehicle.model}.`
      );

      await fetchVehicles();
    } catch (err) {
      setPurchaseError(
        err.message || 'Unable to complete the purchase.'
      );
    } finally {
      setPurchasingId(null);
    }
  }

  async function handleDeleteVehicle(vehicle) {
    if (!authData?.token || !isAdmin) {
      setError('Admin sign-in is required for this action.');
      return;
    }

    const confirmed = window.confirm(
      `Delete ${vehicle.make} ${vehicle.model}? This cannot be undone.`
    );

    if (!confirmed) return;

    setError('');

    try {
      const response = await fetch(`${API_URL}/vehicles/${vehicle.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete vehicle.');
      }

      if (editingId === vehicle.id) {
        closeVehicleForm();
      }

      await fetchVehicles();
    } catch (err) {
      setError(err.message || 'Unable to delete vehicle.');
    }
  }

  if (showAuth) {
    return (
      <Auth
        onLogin={(data) => {
          localStorage.setItem('cardeck_auth', JSON.stringify(data));
          setAuthData(data);
          setPage('inventory');
          setShowAuth(false);
        }}
      />
    );
  }

  if (!authData && page === 'home') {
    const featuredVehicles = vehicles.slice(0, 3);

    return (
      <main className="home-page">
        <header className="site-header home-header">
          <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setPage('home'); }}>
            <span className="brand-icon">C</span>
            <span>CAR<span className="brand-accent">DECK</span></span>
          </a>
          <nav className="home-nav" aria-label="Main navigation">
            <button className="nav-link active" onClick={() => setPage('home')}>Home</button>
            <button className="nav-link" onClick={() => setPage('inventory')}>Explore cars</button>
            <button className="auth-nav-button" onClick={() => setShowAuth(true)}>Sign in / Register</button>
          </nav>
        </header>

        <section className="home-hero">
          <div className="home-hero-overlay" />
          <div className="home-hero-content">
            <p className="eyebrow">A BETTER WAY TO FIND YOUR DRIVE</p>
            <h1>Find the car<br />that moves you.</h1>
            <p className="home-hero-description">
              A considered collection of exceptional cars. Explore the details,
              compare prices, and find the one that feels right.
            </p>
            <button className="home-cta" onClick={() => setPage('inventory')}>
              Explore our cars <span aria-hidden="true">↗</span>
            </button>
            <div className="hero-note"><span className="hero-note-line" /> YOUR NEXT DRIVE STARTS HERE</div>
          </div>
          <div className="hero-image-caption">THE ART OF THE DRIVE <span>01 / CARDECK COLLECTION</span></div>
        </section>

        <section className="home-intro">
          <div>
            <p className="eyebrow">THE CARDECK DIFFERENCE</p>
            <h2>Good cars.<br /><em>Clear choices.</em></h2>
          </div>
          <p>Browse our collection at your own pace. See transparent prices, check availability, and discover a car that fits your life — without the guesswork.</p>
        </section>

        <section className="featured-section">
          <div className="featured-heading">
            <div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Explore the collection</h2></div>
            <button className="text-link" onClick={() => setPage('inventory')}>View all cars <span aria-hidden="true">→</span></button>
          </div>
          {error && <p className="state-message error-message">{error}</p>}
        {purchaseError && <p className="state-message error-message" role="alert">{purchaseError}</p>}
        {purchaseMessage && <p className="state-message" role="status">{purchaseMessage}</p>}
          {loading ? <p className="state-message">Loading our collection...</p> : featuredVehicles.length === 0 ? (
            <div className="featured-empty"><p>Our collection is being prepared.</p><button className="text-link" onClick={() => setPage('inventory')}>Browse inventory →</button></div>
          ) : (
            <div className="featured-grid">
              {featuredVehicles.map((vehicle, index) => (
                <article className="featured-card" key={vehicle.id}>
                  <div className="featured-image-wrap">
                    <img src={carImageFor(vehicle, index)} alt={`${vehicle.make} ${vehicle.model}`} loading="lazy" />
                    <span className="featured-category">{vehicle.category}</span>
                  </div>
                  <div className="featured-card-body">
                    <p className="vehicle-make">{vehicle.make}</p>
                    <h3>{vehicle.model}</h3>
                    <div className="featured-card-footer">
                      <span>₹{Number(vehicle.price).toLocaleString('en-IN')}</span>
                      <button aria-label={`View ${vehicle.make} ${vehicle.model}`} onClick={() => setPage('inventory')}>View details ↗</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="featured-bottom"><button className="home-cta dark-cta" onClick={() => setPage('inventory')}>Discover all vehicles <span aria-hidden="true">↗</span></button></div>
        </section>

        <section className="home-benefits">
          <div><span>01</span><h3>Curated collection</h3><p>A selection of vehicles across styles and categories.</p></div>
          <div><span>02</span><h3>Transparent pricing</h3><p>Clear prices to help you make a confident choice.</p></div>
          <div><span>03</span><h3>Simple discovery</h3><p>Search and filter the inventory at your own pace.</p></div>
        </section>

        <footer className="site-footer">CARDECK <span>·</span> YOUR NEXT DRIVE STARTS HERE</footer>
      </main>
    );
  }

  return (
    <main className="inventory-page">
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-icon">C</span>
          <span>
            CAR<span className="brand-accent">DECK</span>
          </span>
        </a>

        <div className="header-actions">
          <span className="header-label">VEHICLE INVENTORY</span>
          {!authData && <button className="nav-link inventory-home-link" onClick={() => setPage('home')}>Home</button>}

          {authData ? (
            <>
              <span className="user-greeting">
                Hi, {authData.user?.name || 'User'}
              </span>
              <button className="auth-nav-button" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <button
              className="auth-nav-button"
              onClick={() => setShowAuth(true)}
            >
              Sign in / Register
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">FIND YOUR NEXT DRIVE</p>
        <h1>
          Find the car that
          <br />
          moves you.
        </h1>
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

        {isAdmin && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">ADMINISTRATION</p>
                <h3>Manage inventory</h3>
              </div>

              <button
                className="primary-button"
                onClick={
                  showVehicleForm ? closeVehicleForm : startAddVehicle
                }
              >
                {showVehicleForm ? 'Close form' : '+ Add vehicle'}
              </button>
            </div>

            {showVehicleForm && (
              <form className="vehicle-form" onSubmit={handleVehicleSubmit}>
                <h4>{editingId !== null ? 'Edit vehicle' : 'Add a vehicle'}</h4>

                <div className="vehicle-form-grid">
                  <label>
                    Make
                    <input
                      name="make"
                      value={vehicleForm.make}
                      onChange={handleFormChange}
                      placeholder="e.g. Toyota"
                      required
                    />
                  </label>

                  <label>
                    Model
                    <input
                      name="model"
                      value={vehicleForm.model}
                      onChange={handleFormChange}
                      placeholder="e.g. Camry"
                      required
                    />
                  </label>

                  <label>
                    Category
                    <select
                      name="category"
                      value={vehicleForm.category}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Sports">Sports</option>
                      <option value="Supercar">Supercar</option>
                      <option value="Convertible">Convertible</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="MPV">MPV</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Wagon">Wagon</option>
                    </select>
                  </label>

                  <label>
                    Price (₹)
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={vehicleForm.price}
                      onChange={handleFormChange}
                      required
                    />
                  </label>

                  <label>
                    Quantity
                    <input
                      name="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={vehicleForm.quantity}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                </div>

                {formError && (
                  <p className="admin-error" role="alert">{formError}</p>
                )}
                {formMessage && (
                  <p className="admin-success" role="status">{formMessage}</p>
                )}

                <div className="vehicle-form-actions">
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? 'Saving...'
                      : editingId !== null
                        ? 'Save changes'
                        : 'Create vehicle'}
                  </button>

                  <button
                    className="clear-button"
                    type="button"
                    onClick={closeVehicleForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

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
              <option value="Sports">Sports</option>
              <option value="Supercar">Supercar</option>
              <option value="Convertible">Convertible</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="MPV">MPV</option>
              <option value="Pickup">Pickup</option>
              <option value="Wagon">Wagon</option>
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

        {error && <p className="state-message error-message">{error}</p>}

        {loading ? (
          <p className="state-message">Loading inventory...</p>
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
                  <img className="vehicle-photo" src={carImageFor(vehicle, vehicle.id)} alt={`${vehicle.make} ${vehicle.model}`} loading="lazy" />
                </div>

                <div className="vehicle-details">
                  <p className="vehicle-make">{vehicle.make}</p>
                  <h3>{vehicle.model}</h3>

                  <div className="vehicle-meta">
                    <span>Stock: {vehicle.quantity}</span>
                    <span>ID: {String(vehicle.id).startsWith('sample-') ? 'Showcase' : vehicle.id}</span>
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

                  {authData && !isAdmin && (
                    <div className="vehicle-admin-actions">
                      <button
                        className="primary-button"
                        onClick={() => handlePurchaseVehicle(vehicle)}
                        disabled={Number(vehicle.quantity) <= 0 || purchasingId === vehicle.id || String(vehicle.id).startsWith('sample-')}
                      >
                        {Number(vehicle.quantity) <= 0
                          ? 'Out of stock'
                          : purchasingId === vehicle.id
                            ? 'Purchasing...'
                            : 'Purchase'}
                      </button>
                    </div>
                  )}

                  {isAdmin && !String(vehicle.id).startsWith('sample-') && (
                    <div className="vehicle-admin-actions">
                      <button
                        className="clear-button"
                        onClick={() => startEditVehicle(vehicle)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {selectedVehicle && (
          <div className="purchase-overlay">
            <section
              className="purchase-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="purchase-title"
            >
              <button
                type="button"
                className="purchase-close"
                onClick={() => {
                  setSelectedVehicle(null);
                  setPurchaseError('');
                }}
              >
                Close
              </button>

              <p className="eyebrow">CARDECK COLLECTION</p>

              <h2 id="purchase-title">
                {selectedVehicle.make} {selectedVehicle.model}
              </h2>

              <img
                className="purchase-car-image"
                src={carImageFor(selectedVehicle, selectedVehicle.id)}
                alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
              />

              <div className="purchase-summary">
                <div>
                  <span>Category</span>
                  <strong>{selectedVehicle.category}</strong>
                </div>

                <div>
                  <span>Price</span>
                  <strong>
                    ₹{Number(selectedVehicle.price).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div>
                  <span>Availability</span>
                  <strong>
                    {Number(selectedVehicle.quantity) > 0
                      ? `${selectedVehicle.quantity} in stock`
                      : 'Out of stock'}
                  </strong>
                </div>
              </div>

              <p className="purchase-note">
                Please confirm the vehicle details with the dealership,
                including its exact variant, model year, mileage, colour
                and included features.
              </p>

              <hr />

              <h3>Delivery information</h3>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setPurchaseError('');
                  setDeliveryStep('confirmation');
                }}
              >
                <div className="purchase-form-grid">
                  <label>
                    Full name
                    <input
                      name="fullName"
                      value={deliveryDetails.fullName}
                      onChange={handleDeliveryChange}
                      required
                    />
                  </label>

                  <label>
                    Phone number
                    <input
                      name="phone"
                      type="tel"
                      value={deliveryDetails.phone}
                      onChange={handleDeliveryChange}
                      pattern="[0-9+() -]{7,20}"
                      required
                    />
                  </label>

                  <label className="purchase-address-field">
                    Full delivery address
                    <textarea
                      name="address"
                      value={deliveryDetails.address}
                      onChange={handleDeliveryChange}
                      rows={3}
                      required
                    />
                  </label>

                  <label>
                    City
                    <input
                      name="city"
                      value={deliveryDetails.city}
                      onChange={handleDeliveryChange}
                      required
                    />
                  </label>

                  <label>
                    State
                    <input
                      name="state"
                      value={deliveryDetails.state}
                      onChange={handleDeliveryChange}
                      required
                    />
                  </label>

                  <label>
                    PIN code
                    <input
                      name="pinCode"
                      value={deliveryDetails.pinCode}
                      onChange={handleDeliveryChange}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                    />
                  </label>
                </div>

                {purchaseError && (
                  <p className="admin-error" role="alert">
                    {purchaseError}
                  </p>
                )}

                {deliveryStep === 'details' && (
                  <button
                    className="primary-button purchase-confirm-button"
                    type="submit"
                    disabled={Number(selectedVehicle.quantity) <= 0}
                  >
                    Continue to order summary
                  </button>
                )}
              </form>

              {deliveryStep === 'confirmation' && (
                <div className="purchase-final-confirmation">
                  <h3>Review your order</h3>

                  <p>
                    <strong>Vehicle:</strong>{' '}
                    {selectedVehicle.make} {selectedVehicle.model}
                  </p>

                  <p>
                    <strong>Total:</strong>{' '}
                    ₹{Number(selectedVehicle.price).toLocaleString('en-IN')}
                  </p>

                  <p>
                    <strong>Deliver to:</strong>{' '}
                    {deliveryDetails.fullName}, {deliveryDetails.address},{' '}
                    {deliveryDetails.city}, {deliveryDetails.state} –{' '}
                    {deliveryDetails.pinCode}
                  </p>

                  <p>
                    <strong>Phone:</strong> {deliveryDetails.phone}
                  </p>

                  <button
                    className="primary-button purchase-confirm-button"
                    type="button"
                    onClick={confirmVehiclePurchase}
                    disabled={
                      purchasingId === selectedVehicle.id ||
                      Number(selectedVehicle.quantity) <= 0
                    }
                  >
                    {purchasingId === selectedVehicle.id
                      ? 'Processing purchase...'
                      : 'Confirm final purchase'}
                  </button>

                  <button
                    className="clear-button"
                    type="button"
                    onClick={() => {
                      setDeliveryStep('details');
                      setPurchaseError('');
                    }}
                  >
                    Edit delivery details
                  </button>
                </div>
              )}
            </section>
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
