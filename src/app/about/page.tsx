import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import ThreadDivider from '@/components/ThreadDivider';

export const metadata: Metadata = {
  title: 'About GKB Textiles | Our Story, Vision & Heritage | Erode',
  description: 'Learn about GKB Textiles - a leading cotton grey fabric manufacturer with 20+ years of expertise. Founded by G. Balakrishnan in Erode, Tamil Nadu.',
};

export default function AboutPage() {
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
        "name": "About Us",
        "item": "https://gkb-textiles.vercel.app/about"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who founded GKB Textiles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GKB Textiles was founded in Erode, Tamil Nadu, by Mr. G. Balakrishnan, who holds a B.E. in Mechanical Engineering and has over 20 years of textile manufacturing experience."
        }
      },
      {
        "@type": "Question",
        "name": "What type of looms does GKB Textiles use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GKB Textiles uses advanced imported Picanol OmniPlus 800 Air Jet and Dobby Looms to produce high-quality woven fabrics."
        }
      },
      {
        "@type": "Question",
        "name": "What is the manufacturing history of GKB Textiles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GKB Textiles started operations in 2005 with Rapier Shuttleless Loom technology. In 2013, they imported 6 Picanol OmniPlus 800 Air Jet Looms, expanding with 3 more in 2015, and 3 imported Air Jet Dobby Looms in 2018."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ============================================= */}
      {/* PAGE HERO                                     */}
      {/* ============================================= */}
      <section className="hero hero-page">
        <div className="hero-bg">
          <Image 
            src="/images/thread-spools.jpg" 
            alt="White thread spools loaded on creel at GKB Textiles factory Erode" 
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 45%' }}
          />
        </div>
        <div className="hero-overlay"></div>
        

        <div className="hero-content center">
          <span className="hero-tagline">Our Story</span>
          <h1>Crafting Excellence Since 2005</h1>
          <p className="hero-description">Over two decades of passion, precision, and commitment to textile manufacturing excellence.</p>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      {/* ============================================= */}
      {/* BRAND STORY — SPLIT LAYOUT                    */}
      {/* ============================================= */}
      <section className="section">
        <div className="container">
          <div className="split-layout">
            <div className="split-text fade-in-left">
              <h2>The GKB Textiles Story</h2>
              <p>GKB Textiles is a leading manufacturer and exporter of premium-quality cotton grey fabrics based in Erode, Tamil Nadu, India. With over two decades of industry expertise, we specialize in producing high-quality woven fabrics using advanced Picanol OmniPlus 800 Air Jet Looms.</p>
              <p>Our commitment to quality, timely delivery, technical excellence, and customer satisfaction has enabled us to build long-term relationships with clients across domestic and international markets.</p>
              <p>We are equipped to manufacture a wide range of woven fabrics with customized constructions, unique dobby patterns, and specialized fabric developments tailored to customer requirements.</p>
            </div>
            <div className="split-image fade-in-right" style={{ minHeight: '400px', position: 'relative' }}>
              <Image 
                src="/images/about-heritage.png" 
                alt="GKB Textiles factory interior with advanced looms" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Pattern Band */}
      <div className="fabric-band"></div>

      {/* ============================================= */}
      {/* VISION & MISSION                              */}
      {/* ============================================= */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              <h2>Our Vision &amp; Mission</h2>
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </div>
            <p className="section-subtitle">The guiding principles that drive every thread we weave and every fabric we deliver.</p>
          </div>

          <div className="grid-2 stagger-children">
            {/* Vision Card */}
            <div className="stitched-card fade-in">
              <div style={{ marginBottom: '1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--terracotta)' }}>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3>Our Vision</h3>
              <p>To become a globally recognized textile manufacturing partner known for superior quality, innovation, reliability, and customer-centric solutions while continuously expanding our capabilities and market presence.</p>
            </div>

            {/* Mission Card */}
            <div className="stitched-card fade-in">
              <div style={{ marginBottom: '1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--terracotta)' }}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3>Our Mission</h3>
              <p>To deliver high-quality woven fabrics through advanced technology, skilled craftsmanship, and efficient manufacturing practices while ensuring timely delivery, cost-effective production, and consistent customer satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      {/* ============================================= */}
      {/* FOUNDER SECTION                               */}
      {/* ============================================= */}
      <section className="section">
        <div className="container">
          <div className="split-layout">
            {/* Left: Founder Info */}
            <div className="split-text fade-in-left">
              <h2>Meet Our Founder</h2>
              <div style={{ 
                position: 'relative', 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: '3px solid var(--indigo-pale, #cbd5e1)', 
                boxShadow: 'var(--shadow-soft)', 
                marginBottom: '1.5rem' 
              }}>
                <Image 
                  src="/images/founder.jpg" 
                  alt="Mr. G. Balakrishnan - Founder of GKB Textiles"
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover', transform: 'scale(1.15) translateY(6px)' }}
                />
              </div>
              <h3>Mr. G. Balakrishnan</h3>
              <p className="accent-text">B.E. Mechanical Engineering | Founder &amp; Proprietor</p>
              <p>With over 20 years of textile manufacturing expertise, Mr. G. Balakrishnan founded GKB Textiles with a singular vision: to produce cotton grey fabrics of exceptional quality. His technical background in mechanical engineering combined with deep industry knowledge has been instrumental in establishing GKB Textiles as a trusted name in the textile sector.</p>
              <p>Under his leadership, GKB Textiles has grown from a modest operation with Rapier looms to a modern manufacturing facility equipped with imported Picanol OmniPlus 800 Air Jet and Dobby Looms, serving both domestic and international markets.</p>
            </div>

            {/* Right: Founder Quote */}
            <div className="founder-quote fade-in-right">
              <div className="quote-mark">&ldquo;</div>
              <blockquote>At GKB Textiles, quality has always been our highest priority. We believe in delivering fabrics that meet exact customer requirements rather than focusing solely on volume. Every order receives personal attention, technical supervision, and a commitment to excellence. With continuous investments in technology and infrastructure, we strive to develop unique fabric constructions and long-lasting partnerships built on trust, reliability, and performance.</blockquote>
              <p className="quote-author">&mdash; G. Balakrishnan</p>
              <p className="quote-title">Founder &amp; Proprietor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      {/* ============================================= */}
      {/* COMPANY TIMELINE                              */}
      {/* ============================================= */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              <h2>Our Journey</h2>
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </div>
            <p className="section-subtitle">From humble beginnings to advanced manufacturing excellence.</p>
          </div>

          <div className="timeline-vertical stagger-children" style={{ marginTop: '5.5rem' }}>
            <div className="timeline-start-logo fade-in">
              <Image 
                src="/images/logo-transparent.png" 
                alt="GKB Textiles Logo" 
                width={46} 
                height={46} 
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="timeline-item fade-in">
              <span className="year">2005</span>
              <p className="event">Started operations with Rapier Shuttleless Loom technology.</p>
            </div>

            <div className="timeline-item fade-in">
              <span className="year">2012</span>
              <p className="event">Completed the first phase of operations and prepared for expansion.</p>
            </div>

            <div className="timeline-item fade-in">
              <span className="year">2013</span>
              <p className="event">Established a fully integrated production facility under one roof and imported 6 Picanol OmniPlus 800 Air Jet Looms.</p>
            </div>

            <div className="timeline-item fade-in">
              <span className="year">2015</span>
              <p className="event">Expanded capacity with the addition of 3 imported Picanol OmniPlus 800 Air Jet Looms.</p>
            </div>

            <div className="timeline-item fade-in">
              <span className="year">2018</span>
              <p className="event">Expanded weaving capabilities with the addition of 3 imported Picanol OmniPlus 800 Dobby Looms from the United States.</p>
            </div>

            <div className="timeline-item fade-in">
              <span className="year">2020</span>
              <p className="event">Installed a 100 kW Solar Power Plant to support sustainable manufacturing.</p>
            </div>

            <div className="timeline-item fade-in">
              <span className="year">2025</span>
              <p className="event">Added 2 imported Picanol OmniPlus 800 Dobby Looms from France, enhancing production flexibility and design capabilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      {/* ============================================= */}
      {/* WHY CHOOSE US                                 */}
      {/* ============================================= */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <div className="title-blocks" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
              <h2>Why Choose GKB Textiles</h2>
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </div>
            <p className="section-subtitle">A commitment to quality, technology, and customer satisfaction that sets us apart.</p>
          </div>

          <div className="split-layout">
            {/* Left: Checklist */}
            <div className="fade-in-left">
              <ul className="check-list">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  20+ years of textile manufacturing expertise
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Advanced Picanol OmniPlus 800 Air Jet Loom technology
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Ability to develop complex and customized fabric constructions
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Strong focus on quality assurance and process control
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Timely delivery and assured order completion
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Competitive manufacturing costs
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Personalized customer support from management
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Export-ready manufacturing capabilities
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Consistent production and reliable supply chain
                </li>
              </ul>
            </div>

            {/* Right: Manufacturing Infrastructure Card */}
            <div className="stitched-card fade-in-right">
              <h3 style={{ marginBottom: '2rem' }}>Manufacturing Infrastructure</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gold-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)' }}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--indigo-deep)' }}>14</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-light)' }}>Picanol OmniPlus 800 Looms</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gold-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--indigo-deep)' }}>20+</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-light)' }}>Years of Experience</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gold-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)' }}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--indigo-deep)' }}>100 kW</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-light)' }}>Solar Power Capacity</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gold-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold-thread)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--indigo-deep)' }}>100%</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-light)' }}>Quality Controlled Production</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
