import React from 'react';
import Link from 'next/link';
import ThreadDivider from '@/components/ThreadDivider';

export default function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero hero-home">
        <div className="hero-bg">
          <img src="/images/hero-home-landscape.png" alt="Precision Woven Cotton Fabrics" />
        </div>
        <div className="hero-overlay"></div>

        <div className="hero-content center">
          <span className="hero-tagline fade-in">SINCE 2005</span>
          <h1 className="fade-in">Precision Woven. <br />Reliably Delivered.</h1>
          <p className="hero-description fade-in">
            Premium Cotton Grey Fabrics manufactured using advanced Picanol Air Jet Loom technology, with capabilities spanning dobby fabrics, double cloth constructions, seersucker fabrics, and tailor-made fabric solutions.
          </p>
          <div className="hero-buttons fade-in">
            <a href="#fabric-collection" className="btn btn-primary">Explore Our Fabrics</a>
            <Link href="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== MANUFACTURING PROCESS TIMELINE ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              Our Manufacturing Process
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </h2>
            <p className="section-subtitle">Every fabric is produced under direct supervision of experienced technicians and management.</p>
          </div>

          <div className="timeline stagger-children">
            {/* Step 1: Production Planning */}
            <div className="timeline-step fade-in">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                  <line x1="8" y1="18" x2="12" y2="18" />
                </svg>
              </div>
              <span className="step-number">01</span>
              <h3 className="step-title">Production Planning</h3>
              <p className="step-desc">Orders are carefully analysed and production schedules are meticulously crafted for optimal output.</p>
            </div>

            {/* Step 2: Yarn Selection */}
            <div className="timeline-step fade-in">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="step-number">02</span>
              <h3 className="step-title">Yarn Selection</h3>
              <p className="step-desc">Premium cotton yarns sourced from trusted suppliers, tested for count, strength, and consistency.</p>
            </div>

            {/* Step 3: Warping & Sizing */}
            <div className="timeline-step fade-in">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <span className="step-number">03</span>
              <h3 className="step-title">Warping &amp; Sizing</h3>
              <p className="step-desc">Precision warping and sizing processes ensure uniform tension and optimal loom performance.</p>
            </div>

            {/* Step 4: Weaving */}
            <div className="timeline-step fade-in">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="step-number">04</span>
              <h3 className="step-title">Weaving</h3>
              <p className="step-desc">Fabric is woven on advanced Picanol OmniPlus 800 Air Jet Looms with electronic dobby control.</p>
            </div>

            {/* Step 5: Quality Inspection */}
            <div className="timeline-step fade-in">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className="step-number">05</span>
              <h3 className="step-title">Quality Inspection</h3>
              <p className="step-desc">Every metre of fabric undergoes rigorous quality checks for defects, density, and dimensional accuracy.</p>
            </div>

            {/* Step 6: Dispatch */}
            <div className="timeline-step fade-in">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <span className="step-number">06</span>
              <h3 className="step-title">Dispatch</h3>
              <p className="step-desc">Finished fabrics are carefully packed and dispatched to domestic and international destinations on schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== PRODUCT HIGHLIGHTS / FABRIC COLLECTION ===== */}
      <section className="section section-cream" id="fabric-collection">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              Our Fabric Collection
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </h2>
            <p className="section-subtitle">Premium cotton grey fabrics in a wide range of constructions and weave patterns.</p>
          </div>

          <div className="grid-4 stagger-children">
            {/* Dobby Fabrics */}
            <div className="swatch-card fade-in">
              <div className="swatch-color" style={{ backgroundColor: '#D4C5A9' }}></div>
              <div className="swatch-info">
                <h3>Dobby Fabrics</h3>
                <p>Intricate geometric patterns woven on electronic dobby looms for rich surface texture and visual depth.</p>
                <span className="swatch-tag">SPECIALTY</span>
              </div>
            </div>

            {/* Plain & Twill Weaves */}
            <div className="swatch-card fade-in">
              <div className="swatch-color" style={{ backgroundColor: '#EDE8DC' }}></div>
              <div className="swatch-info">
                <h3>Plain &amp; Twill Weaves</h3>
                <p>Timeless fabric constructions offering durability and versatility for a wide range of end-use applications.</p>
                <span className="swatch-tag">CLASSIC</span>
              </div>
            </div>

            {/* Double Cloth Fabrics */}
            <div className="swatch-card fade-in">
              <div className="swatch-color" style={{ backgroundColor: '#9E9589' }}></div>
              <div className="swatch-info">
                <h3>Double Cloth Fabrics</h3>
                <p>Two-layered fabric constructions providing enhanced weight, warmth, and a luxurious hand feel.</p>
                <span className="swatch-tag">PREMIUM</span>
              </div>
            </div>

            {/* Seersucker & Fancy */}
            <div className="swatch-card fade-in">
              <div className="swatch-color" style={{ backgroundColor: '#8BA4C4' }}></div>
              <div className="swatch-info">
                <h3>Seersucker &amp; Fancy</h3>
                <p>Distinctive puckered textures and creative weave innovations for designer and fashion-forward applications.</p>
                <span className="swatch-tag">DESIGNER</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== WHY CHOOSE US / BRAND VALUES ===== */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">
              Why Choose GKB Textiles
            </h2>
          </div>

          <div className="values-strip stagger-children">
            {/* 20+ Years Expertise */}
            <div className="value-item fade-in">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h3>20+ Years Expertise</h3>
              <p>Two decades of textile manufacturing excellence</p>
            </div>

            {/* Advanced Technology */}
            <div className="value-item fade-in">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
              </div>
              <h3>Advanced Technology</h3>
              <p>Picanol OmniPlus 800 Air Jet Looms</p>
            </div>

            {/* Quality Assurance */}
            <div className="value-item fade-in">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <h3>Quality Assurance</h3>
              <p>Rigorous quality control at every stage</p>
            </div>

            {/* Export Ready */}
            <div className="value-item fade-in">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3>Export Ready</h3>
              <p>IEC registered with global shipping capabilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== INFRASTRUCTURE STATS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              Manufacturing at Scale
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </h2>
          </div>

          <div className="stitched-card fade-in">
            <div className="metrics-strip">
              <div className="metric-item">
                <span className="metric-number" data-count="14" data-suffix="+">0</span>
                <span className="metric-label">Looms</span>
              </div>
              <div className="metric-item">
                <span className="metric-number" data-count="150000" data-suffix="+">0</span>
                <span className="metric-label">Monthly Metres</span>
              </div>
              <div className="metric-item">
                <span className="metric-number" data-count="250000" data-suffix="+">0</span>
                <span className="metric-label">Storage Capacity (sq ft)</span>
              </div>
              <div className="metric-item">
                <span className="metric-number" data-count="100" data-suffix=" kW">0</span>
                <span className="metric-label">Solar Power</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
