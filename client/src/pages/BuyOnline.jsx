import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaCheckCircle, FaTruck, FaShieldAlt } from 'react-icons/fa';
import './BuyOnline.css';

const BuyOnline = () => {
  const [activeCategory, setActiveCategory] = useState('kitchen');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productsData = {
    kitchen: [
      {
        id: 1,
        name: 'Premium Modular Island',
        price: 'Start from ₹85,000',
        description: 'High-gloss finish with integrated storage.',
        image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=2070&auto=format&fit=crop',
        type: 'Kitchen'
      },
      {
        id: 2,
        name: 'Quartz Countertops',
        price: '₹350 / sq.ft',
        description: 'Stain-resistant engineered stone surfaces.',
        image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=2070&auto=format&fit=crop',
        type: 'Surface'
      },
      {
        id: 3,
        name: 'Matte Black Faucet S1',
        price: '₹12,499',
        description: 'Modern pull-down sprayer mixer.',
        image: 'https://images.unsplash.com/photo-1584620862017-105053d3c36b?q=80&w=1974&auto=format&fit=crop',
        type: 'Fittings'
      },
      {
        id: 4,
        name: 'Floating Shelves Set',
        price: '₹4,500',
        description: 'Solid wood open shelving for kitchens.',
        image: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?q=80&w=2070&auto=format&fit=crop',
        type: 'Storage'
      },
      {
        id: 5,
        name: 'Smart Corner Unit',
        price: '₹18,000',
        description: 'Maximize space with pull-out carousel.',
        image: 'https://images.unsplash.com/photo-1556911220-e62b29ca8d89?q=80&w=2070&auto=format&fit=crop',
        type: 'Storage'
      },
      {
        id: 6,
        name: 'Designer Chimney',
        price: '₹22,999',
        description: 'Silent suction technology with touch control.',
        image: 'https://images.unsplash.com/photo-1541575765-8857d47453f2?q=80&w=2000&auto=format&fit=crop',
        type: 'Appliance'
      },
    ],
    accessories: [
      {
        id: 101,
        name: 'Abstract Wall Art',
        price: '₹8,900',
        description: 'Hand-painted canvas for modern homes.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop',
        type: 'Decor'
      },
      {
        id: 102,
        name: 'Gold Pendant Light',
        price: '₹5,500',
        description: 'Minimalist industrial hanging lamp.',
        image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=1935&auto=format&fit=crop',
        type: 'Lighting'
      },
      {
        id: 103,
        name: 'Velvet Accent Chair',
        price: '₹15,000',
        description: 'Plush seating with gold metal legs.',
        image: 'https://images.unsplash.com/photo-1567538096630-e08558e0fcde?q=80&w=2070&auto=format&fit=crop',
        type: 'Furniture'
      },
      {
        id: 104,
        name: 'Handwoven Rug',
        price: '₹12,000',
        description: 'Pure wool geometric pattern area rug.',
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=2070&auto=format&fit=crop',
        type: 'Flooring'
      },
    ]
  };

  useEffect(() => {
    setLoading(true);
    // Simulate loading transition
    const timer = setTimeout(() => {
      setProducts(productsData[activeCategory]);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  return (
    <div className="buy-online-page">
      {/* Hero Section */}
      <section className="shop-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Buy Online</h1>
          <p className="hero-subtitle">Premium kitchen solutions &amp; decor delivered with style</p>
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Shop</span>
          </div>
        </div>
      </section>

      {/* Main Shop Content */}
      <section className="shop-content">
        <div className="container">

          {/* Category Switch */}
          <div className="shop-controls">
            <div className="category-pills">
              <button
                className={`pill-btn ${activeCategory === 'kitchen' ? 'active' : ''}`}
                onClick={() => setActiveCategory('kitchen')}
              >
                Kitchen &amp; Dining
              </button>
              <button
                className={`pill-btn ${activeCategory === 'accessories' ? 'active' : ''}`}
                onClick={() => setActiveCategory('accessories')}
              >
                Interior Accessories
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="shop-loading">
              <div className="spinner"></div>
              <p>Curating collection...</p>
            </div>
          ) : (
            <div className="products-grid-premium">
              {products.map((product) => (
                <div key={product.id} className="product-card-premium">
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} />
                    <div className="product-overlay-actions">
                      <button className="action-btn view-btn"><FaSearch /> View</button>
                    </div>
                  </div>

                  <div className="product-info-body">
                    <span className="product-category-label">{product.type}</span>
                    <h3>{product.name}</h3>
                    <p className="prod-desc">{product.description}</p>
                    <div className="prod-footer">
                      <span className="price-tag">{product.price}</span>
                      <button className="cart-icon-btn"><FaShoppingCart /></button>
                    </div>

                    <button className="enquire-full-btn">Enquire Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trust Badges */}
          <div className="shop-trust-badges">
            <div className="badge-item">
              <FaCheckCircle className="badge-icon" />
              <span>Premium Quality Materials</span>
            </div>
            <div className="badge-item">
              <FaTruck className="badge-icon" />
              <span>Secure &amp; Safe Delivery</span>
            </div>
            <div className="badge-item">
              <FaShieldAlt className="badge-icon" />
              <span>Expert Installation Support</span>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="shop-cta">
        <div className="container">
          <div className="cta-block">
            <h2>Need help choosing the right solution?</h2>
            <button className="btn-gold">Get Free Consultation</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyOnline;
