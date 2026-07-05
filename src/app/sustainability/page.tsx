import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ThreadDivider from '@/components/ThreadDivider';

export const metadata: Metadata = {
  title: 'Sustainability at GKB Textiles | Solar Energy & Eco-Friendly Manufacturing',
  description: 'Discover how GKB Textiles integrates sustainability through 100 kW solar power, air jet technology, and eco-friendly fibre practices in textile manufacturing.',
};

export default function SustainabilityPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://gkb-textiles.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sustainability",
        "item": "https://gkb-textiles.vercel.app/sustainability"
      }
    ]
  };

  const sustainabilitySchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does GKB Textiles use renewable energy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GKB Textiles operates a 100 kW on-site solar power plant that supplies approximately 22% of the facility's daily electricity needs, helping reduce greenhouse gas emissions and environmental footprint."
        }
      },
      {
        "@type": "Question",
        "name": "What eco-friendly technologies are used by GKB Textiles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We operate 14 Picanol OmniPlus 800 Air Jet Looms, which use compressed air to insert weft yarns. This technology consumes less energy per meter, cuts noise pollution, and produces minimal waste compared to shuttle looms."
        }
      },
      {
        "@type": "Question",
        "name": "Does GKB Textiles use sustainable fibres?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we weave natural cotton fibres (compact, combed, and carded yarns). Woven cotton fabrics are biodegradable and environment-friendly."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sustainabilitySchema) }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="hero hero-page hero-sustainability">
        <div className="hero-bg">
          <Image 
            src="/images/sustainability-hero.png" 
            alt="Green fields and solar panels powering the GKB Textiles sustainable manufacturing operations" 
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 45%' }}
          />
        </div>
        <div className="hero-overlay"></div>
        

        <div className="hero-content center">
          <span className="hero-tagline">Sustainability</span>
          <h1>Weaving a Greener Future</h1>
          <p className="hero-description">At GKB Textiles, sustainability is integrated into our manufacturing practices through solar energy, efficient technology, and responsible operations.</p>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== SUSTAINABLE PRACTICES — FEATURE CARDS ===== */}
      <section className="section section-sage">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              Our Sustainable Practices
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </h2>
            <p className="section-subtitle">Committed to reducing our environmental footprint through technology and innovation.</p>
          </div>

          <div className="grid-3 stagger-children">
            {/* Solar Panel Energy */}
            <div className="feature-card fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </div>
              <h3>Solar Panel Energy</h3>
              <p>Our 100 kW Solar Power Plant contributes approximately 22% of daily energy requirements, significantly reducing conventional energy consumption and lowering our carbon footprint. With an average daily consumption of 2,200 kWh, solar energy plays a vital role in our manufacturing operations.</p>
            </div>

            {/* Air Jet Technology */}
            <div className="feature-card fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
                  <path d="M12.59 19.41A2 2 0 1 0 14 16H2" />
                  <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" />
                </svg>
              </div>
              <h3>Air Jet Fibre Technology</h3>
              <p>Our 14 Picanol OmniPlus 800 Air Jet Looms use compressed air instead of traditional shuttle mechanisms, resulting in lower energy consumption per metre of fabric, reduced noise pollution, and more efficient yarn utilization with minimal waste generation.</p>
            </div>

            {/* Eco-Friendly Fibres */}
            <div className="feature-card fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h3>Eco-Friendly Fibres</h3>
              <p>We work with natural cotton fibres including compact, combed, and carded yarns. Our focus on cotton-based fabrics supports biodegradable end products. We continuously explore sustainable yarn options and responsible sourcing practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== SUSTAINABILITY METRICS / IMPACT STRIP ===== */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">
              Our Impact in Numbers
            </h2>
          </div>

          <div className="metrics-strip fade-in">
            <div className="metric-item">
              <div className="metric-number" data-count="100" data-suffix=" kW">0</div>
              <div className="metric-label">Solar Power Capacity</div>
            </div>
            <div className="metric-item">
              <div className="metric-number" data-count="22" data-suffix="%">0</div>
              <div className="metric-label">Renewable Energy Share</div>
            </div>
            <div className="metric-item">
              <div className="metric-number" data-count="2200">0</div>
              <div className="metric-label">Daily kWh Consumption</div>
            </div>
            <div className="metric-item">
              <div className="metric-number" data-count="150000">0</div>
              <div className="metric-label">Monthly Metres Output</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== SUSTAINABILITY APPROACH — SPLIT LAYOUT ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              Our Approach to Sustainable Manufacturing
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </h2>
          </div>

          <div className="split-layout">
            {/* Left: Text Content */}
            <div className="split-text fade-in-left">
              <p>Through efficient resource utilization, modern air jet weaving technology, optimized production planning, and responsible operational practices, we continuously work towards sustainable and energy-efficient textile manufacturing.</p>
              <p>Our integrated facility design minimizes material handling, reduces waste, and optimizes energy consumption across all production stages.</p>

              <ul className="check-list">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Efficient resource utilization
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Optimized production planning
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Reduced material waste
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Modern energy-efficient machinery
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Integrated facility operations
                </li>
              </ul>
            </div>

            {/* Right: Stitched Card Summary */}
            <div className="fade-in-right">
              <div className="stitched-card">
                <span className="corner-stitch top-left" style={{ position: 'absolute', display: 'block', width: '16px', height: '16px', top: '8px', left: '8px', transform: 'translate(-50%,-50%)' }}>
                  <svg viewBox="0 0 20 20" width="16" height="16"><line x1="2" y1="2" x2="18" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /><line x1="18" y1="2" x2="2" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </span>
                <span className="corner-stitch top-right" style={{ position: 'absolute', display: 'block', width: '16px', height: '16px', top: '8px', right: '8px', transform: 'translate(50%,-50%)' }}>
                  <svg viewBox="0 0 20 20" width="16" height="16"><line x1="2" y1="2" x2="18" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /><line x1="18" y1="2" x2="2" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </span>
                <span className="corner-stitch bottom-left" style={{ position: 'absolute', display: 'block', width: '16px', height: '16px', bottom: '8px', left: '8px', transform: 'translate(-50%,50%)' }}>
                  <svg viewBox="0 0 20 20" width="16" height="16"><line x1="2" y1="2" x2="18" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /><line x1="18" y1="2" x2="2" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </span>
                <span className="corner-stitch bottom-right" style={{ position: 'absolute', display: 'block', width: '16px', height: '16px', bottom: '8px', right: '8px', transform: 'translate(50%,50%)' }}>
                  <svg viewBox="0 0 20 20" width="16" height="16"><line x1="2" y1="2" x2="18" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /><line x1="18" y1="2" x2="2" y2="18" stroke="#9AB3CD" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </span>

                <h3 className="text-gold" style={{ marginBottom: '1.5rem' }}>Key Sustainability Facts</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '0.75rem 0', borderBottom: '1px dashed var(--stitch-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)', flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    <span><strong>100 kW</strong> Solar Power Plant on-site</span>
                  </li>
                  <li style={{ padding: '0.75rem 0', borderBottom: '1px dashed var(--stitch-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)', flexShrink: 0 }}>
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span><strong>22%</strong> of energy from renewable sources</span>
                  </li>
                  <li style={{ padding: '0.75rem 0', borderBottom: '1px dashed var(--stitch-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)', flexShrink: 0 }}>
                      <path d="M9.59 4.59A2 2 0 1 1 11 8H2" /><path d="M12.59 19.41A2 2 0 1 0 14 16H2" /><path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" />
                    </svg>
                    <span><strong>14</strong> Picanol Air Jet Looms — low energy per metre</span>
                  </li>
                  <li style={{ padding: '0.75rem 0', borderBottom: '1px dashed var(--stitch-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)', flexShrink: 0 }}>
                      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                    <span><strong>100% Cotton</strong> — natural, biodegradable fibres</span>
                  </li>
                  <li style={{ padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)', flexShrink: 0 }}>
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <span><strong>Reduced noise</strong> and waste through modern technology</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THREAD DIVIDER ===== */}
      <ThreadDivider />

      {/* ===== CTA SECTION ===== */}
      <section className="section section-cream">
        <div className="container">
          <div className="cta-section fade-in">
            <h2>Partner With Us for Sustainable Textiles</h2>
            <p>Join us in our commitment to sustainable manufacturing. Let us develop eco-conscious fabric solutions tailored to your requirements.</p>
            <Link href="/contact" className="btn btn-sage">
              Get in Touch
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
