import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ThreadDivider from '@/components/ThreadDivider';

export const metadata: Metadata = {
  title: 'Our Fabric Collection | Dobby, Twill & Seersucker | GKB Textiles',
  description: 'Explore GKB Textiles\' premium cotton grey fabric collection. Detailed specifications, weave patterns, and configurations for Dobby, Plain, Twill, Double Cloth, and Seersucker fabrics.',
};

export default function ProductsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://gkbtextiles.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://gkbtextiles.vercel.app/products"
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "GKB Textiles Fabric Collection",
    "description": "Premium cotton grey fabrics manufactured using advanced Picanol Air Jet looms.",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "Dobby Fabrics",
          "description": "Intricate geometric patterns woven on electronic dobby looms for rich surface texture and visual depth.",
          "category": "Textiles / Fabric",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "Plain & Twill Weaves",
          "description": "Timeless fabric constructions offering durability and versatility for a wide range of end-use applications.",
          "category": "Textiles / Fabric",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Product",
          "name": "Double Cloth Fabrics",
          "description": "Two-layered fabric constructions providing enhanced weight, warmth, and a luxurious hand feel.",
          "category": "Textiles / Fabric",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Product",
          "name": "Seersucker & Fancy",
          "description": "Distinctive puckered textures and creative weave innovations for designer and fashion-forward applications.",
          "category": "Textiles / Fabric",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "itemCondition": "https://schema.org/NewCondition"
          }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="hero hero-page hero-products" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundColor: 'var(--indigo-deep)' }}>
          {/* Subtle geometric grid texture using CSS as a placeholder for the hero image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(var(--indigo-mid) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.25
          }}></div>
        </div>
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(11,36,71,0.6) 0%, rgba(22,48,87,0.85) 100%)' }}></div>
        
        <div className="hero-content center" style={{ position: 'relative', zIndex: 3 }}>
          <span className="hero-tagline">Our Offerings</span>
          <h1>Precision Woven Fabrics</h1>
          <p className="hero-description">Explore our premium cotton grey fabric catalog, engineered to meet exact industrial specifications and high-end fashion standards.</p>
        </div>
      </section>

      {/* ===== BREADCRUMB BAR ===== */}
      <div style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--indigo-pale)', padding: '0.8rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--charcoal-light)' }}>
          <Link href="/" style={{ color: 'var(--indigo-mid)', textDecoration: 'none' }}>Home</Link>
          <span>&gt;</span>
          <span style={{ color: 'var(--charcoal)' }}>Products</span>
        </div>
      </div>

      {/* ===== ANCHOR NAVIGATION BAR ===== */}
      <section style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--indigo-pale)', padding: '1.2rem 0', position: 'sticky', top: 'var(--nav-height)', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="#dobby" className="category-jump-link">Dobby Fabrics</Link>
            <Link href="#plain-twill" className="category-jump-link">Plain &amp; Twill</Link>
            <Link href="#double-cloth" className="category-jump-link">Double Cloth</Link>
            <Link href="#seersucker" className="category-jump-link">Seersucker &amp; Fancy</Link>
          </div>
        </div>
      </section>


      {/* ===== PRODUCTS DETAILED SECTIONS ===== */}
      
      {/* 1. DOBBY FABRICS */}
      <section id="dobby" className="product-section">
        <div className="container">
          <div className="product-container">
            {/* Left: Swatch Placeholder */}
            <div className="product-swatch-container">
              {/* Complex CSS Dobby Checkerboard Pattern to visually simulate Dobby Weaving texture */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#D4C5A9',
                backgroundImage: `
                  linear-gradient(45deg, #c5b69b 25%, transparent 25%), 
                  linear-gradient(-45deg, #c5b69b 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #c5b69b 75%), 
                  linear-gradient(-45deg, transparent 75%, #c5b69b 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                opacity: 0.85
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(22, 48, 87, 0.9)',
                color: 'var(--white)',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                Interactive Visual Weave representation
              </div>
            </div>

            {/* Right: Info */}
            <div className="product-info-column">
              <span className="product-tag">Specialty Weaves</span>
              <h2>Dobby Fabrics</h2>
              <p className="product-description">
                Dobby fabrics are characterized by small, geometric patterns and textured surfaces. Using state-of-the-art imported electronic dobby control looms, we weave highly intricate and uniform surface patterns, offering luxurious depth and excellent physical stability.
              </p>

              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Specification</th>
                    <th>Standard Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Yarn Count Range</strong></td>
                    <td>40s, 50s, 60s, 80s (Carded &amp; Combed Compact Yarn)</td>
                  </tr>
                  <tr>
                    <td><strong>GSM Range</strong></td>
                    <td>110 GSM – 160 GSM</td>
                  </tr>
                  <tr>
                    <td><strong>Weave Options</strong></td>
                    <td>Diamond, Checks, Mock-leno, Honeycomb, Herringbone, Birdseye</td>
                  </tr>
                  <tr>
                    <td><strong>Available Widths</strong></td>
                    <td>50 inches to 76 inches (Finished width)</td>
                  </tr>
                </tbody>
              </table>

              <div className="product-details-list">
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Premium Texture:</strong> Distinct raise of surface yarn adds rich tactile feel and visual elegance.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Moisture Control:</strong> Enhanced surface area allows fast moisture dissipation.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Fashion Focus:</strong> Highly suitable for premium formal wear and designer collections.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Custom Designs:</strong> Custom draft and peg plan structures available on request.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThreadDivider />

      {/* 2. PLAIN & TWILL WEAVES */}
      <section id="plain-twill" className="product-section">
        <div className="container">
          <div className="product-container">
            {/* Left: Info */}
            <div className="product-info-column">
              <span className="product-tag">Classic Weaves</span>
              <h2>Plain &amp; Twill Weaves</h2>
              <p className="product-description">
                The staple of modern garments and industrial textiles. Our plain weaves offer consistent, balanced tightness, while our twill constructions feature pronounced diagonal ribs, delivering high drapability, superior tear strength, and a smooth, lustrous handle.
              </p>

              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Specification</th>
                    <th>Standard Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Yarn Count Range</strong></td>
                    <td>20s, 30s, 40s, 60s (Single &amp; Double Ply Compact Yarn)</td>
                  </tr>
                  <tr>
                    <td><strong>GSM Range</strong></td>
                    <td>90 GSM – 200 GSM</td>
                  </tr>
                  <tr>
                    <td><strong>Weave Options</strong></td>
                    <td>1/1 Plain, 2/1 Twill, 2/2 Twill, Drill, Gabardine, Satin/Sateen</td>
                  </tr>
                  <tr>
                    <td><strong>Available Widths</strong></td>
                    <td>48 inches to 76 inches</td>
                  </tr>
                </tbody>
              </table>

              <div className="product-details-list">
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>High Tensile Strength:</strong> Exceptional durability due to dense yarn intersections.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Wrinkle Resistance:</strong> Twill diagonal lines allow fabric to recover quickly from creasing.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Smooth Finish:</strong> Zero defect weaving ensures flat surface ideal for printing/dyeing.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Industrial Versatility:</strong> Fits everything from everyday shirts to pocketing &amp; medical linens.</span>
                </div>
              </div>
            </div>

            {/* Right: Swatch Placeholder */}
            <div className="product-swatch-container">
              {/* Diagonal Twill stripe pattern using repeating linear-gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#EDE8DC',
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e2dac9 10px, #e2dac9 12px)',
                opacity: 0.95
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(22, 48, 87, 0.9)',
                color: 'var(--white)',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                Interactive Visual Weave representation
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThreadDivider />

      {/* 3. DOUBLE CLOTH FABRICS */}
      <section id="double-cloth" className="product-section">
        <div className="container">
          <div className="product-container">
            {/* Left: Swatch Placeholder */}
            <div className="product-swatch-container">
              {/* Layered border representation for double cloth */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#9E9589',
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, #8c8275 25%, #8c8275 26%, transparent 27%, transparent 74%, #8c8275 75%, #8c8275 76%, transparent 77%),
                  linear-gradient(90deg, transparent 24%, #8c8275 25%, #8c8275 26%, transparent 27%, transparent 74%, #8c8275 75%, #8c8275 76%, transparent 77%)
                `,
                backgroundSize: '40px 40px',
                opacity: 0.85
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(22, 48, 87, 0.9)',
                color: 'var(--white)',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                Interactive Visual Weave representation
              </div>
            </div>

            {/* Right: Info */}
            <div className="product-info-column">
              <span className="product-tag">Premium Weaves</span>
              <h2>Double Cloth Fabrics</h2>
              <p className="product-description">
                Engineered with two distinct layers of warp and weft yarns, our double cloth constructions are interlinked during the weaving process. This yields a plush, heavy-duty fabric that offers warmth and body, often featuring reversible face designs.
              </p>

              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Specification</th>
                    <th>Standard Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Yarn Count Range</strong></td>
                    <td>40s, 50s, 60s (Double-ply stitching configurations)</td>
                  </tr>
                  <tr>
                    <td><strong>GSM Range</strong></td>
                    <td>180 GSM – 280 GSM</td>
                  </tr>
                  <tr>
                    <td><strong>Weave Options</strong></td>
                    <td>Interlocking Plain, Stitched Double Twill, Pocket Weave, Reversible</td>
                  </tr>
                  <tr>
                    <td><strong>Available Widths</strong></td>
                    <td>56 inches to 72 inches (Custom up to 76 inches)</td>
                  </tr>
                </tbody>
              </table>

              <div className="product-details-list">
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Plush Comfort:</strong> Double layer structure traps micro-pockets of air for natural warmth.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Reversibility:</strong> Can weave different constructions on both sides (e.g. check on face, plain on back).</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Excellent Drape:</strong> Heavy-weight fabric falls beautifully with minimal creasing.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Luxury Apparel:</strong> Highly popular for unlined casual blazers, overshirts, and kids wear.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThreadDivider />

      {/* 4. SEERSUCKER & FANCY */}
      <section id="seersucker" className="product-section">
        <div className="container">
          <div className="product-container">
            {/* Left: Info */}
            <div className="product-info-column">
              <span className="product-tag">Designer Weaves</span>
              <h2>Seersucker &amp; Fancy</h2>
              <p className="product-description">
                Famous for its crinkled, puckered surface, seersucker is woven by adjusting warp tensions. The puckering keeps the fabric slightly away from the skin, promoting air circulation. This collection also includes customized mock-leno structures and designer weft insert innovations.
              </p>

              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Specification</th>
                    <th>Standard Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Yarn Count Range</strong></td>
                    <td>40s, 50s, 60s (High-tension warp combinations)</td>
                  </tr>
                  <tr>
                    <td><strong>GSM Range</strong></td>
                    <td>100 GSM – 140 GSM</td>
                  </tr>
                  <tr>
                    <td><strong>Weave Options</strong></td>
                    <td>Slack-Tension Stripes, Crinkled Checks, Textured Dobby-Jacquard</td>
                  </tr>
                  <tr>
                    <td><strong>Available Widths</strong></td>
                    <td>56 inches to 72 inches (Custom up to 76 inches)</td>
                  </tr>
                </tbody>
              </table>

              <div className="product-details-list">
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Natural Cooling:</strong> Slack warp tension creates wave lines, minimizing skin contact.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>No Ironing Required:</strong> Signature puckered texture looks best un-ironed; low-maintenance care.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Fashion Forward:</strong> Popular for premium resort wear, summer blazers, and luxury dresses.</span>
                </div>
                <div className="detail-item">
                  <span className="detail-bullet">✓</span>
                  <span><strong>Breathable Comfort:</strong> Open tension profile maximizes air passage on hot days.</span>
                </div>
              </div>
            </div>

            {/* Right: Swatch Placeholder */}
            <div className="product-swatch-container">
              {/* Vertical puckered wave strip pattern using linear-gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#8BA4C4',
                backgroundImage: `
                  linear-gradient(90deg, #7c98b8 50%, transparent 50%),
                  linear-gradient(0deg, rgba(255,255,255,0.15) 1px, transparent 1px)
                `,
                backgroundSize: '24px 100%, 100% 6px',
                opacity: 0.95
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(22, 48, 87, 0.9)',
                color: 'var(--white)',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                Interactive Visual Weave representation
              </div>
            </div>
          </div>
        </div>
      </section>

      <ThreadDivider />

      {/* ===== CALL TO ACTION (CTA) ===== */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="cta-box">
            {/* Subtle background thread decoration */}
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '2px dashed rgba(255,255,255,0.1)',
              margin: '1rem',
              borderRadius: '6px',
              pointerEvents: 'none'
            }}></div>
            
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
              Need a Custom Construction?
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: 'var(--gold-light)', position: 'relative', zIndex: 1 }}>
              Our engineering team specializes in custom fabric developments. Let us weave to your specific yarn parameters, thread count, thickness, and width requirements.
            </p>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Link href="/contact" className="btn btn-whatsapp" style={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                backgroundColor: 'var(--white)',
                color: 'var(--indigo-deep)',
                padding: '14px 36px',
                fontSize: '0.95rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Inquire For Custom Fabric
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
