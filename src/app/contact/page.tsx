import React from 'react';
import type { Metadata } from 'next';
import ThreadDivider from '@/components/ThreadDivider';

export const metadata: Metadata = {
  title: 'Contact GKB Textiles | Business Enquiries & Export Orders | Erode',
  description: 'Contact GKB Textiles for premium cotton fabrics, custom weaving, and export orders. Located in Erode, Tamil Nadu. Email: gkbbalu@gmail.com, Phone: +91-9443340467.',
};

export default function ContactPage() {
  return (
    <>
      {/* ============================================= */}
      {/* PAGE HERO                                     */}
      {/* ============================================= */}
      <section className="hero hero-page">
        <div className="hero-bg">
          <img src="/images/thread-spools.jpg" alt="White thread spools in a textile factory" />
        </div>
        <div className="hero-overlay"></div>
        
        {/* Decorative Logo Blocks Grid */}
        <div className="card-blocks-grid" aria-hidden="true">
          <span className="b-light"></span><span className="b-navy"></span>
          <span className="b-mid"></span><span className="b-pale"></span>
          <span className="b-empty"></span><span className="b-navy"></span>
          <span className="b-empty"></span><span className="b-navy"></span>
        </div>

        <div className="hero-content center">
          <span className="hero-tagline">Get In Touch</span>
          <h1>Let's Start a Conversation</h1>
          <p className="hero-description">Whether you need premium cotton fabrics or custom weaving solutions, we are here to help.</p>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      {/* ============================================= */}
      {/* CONTACT FORM + INFO SECTION                   */}
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
              <h2>Contact Us</h2>
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </div>
            <p className="section-subtitle">Reach out for business enquiries, fabric development, or any questions.</p>
          </div>

          <div className="grid-2">
            {/* LEFT: Contact Form */}
            <div className="form-stitched fade-in-left">
              <form action="#" method="POST">
                <div className="form-group">
                  <label htmlFor="full-name">Full Name</label>
                  <input type="text" id="full-name" name="full_name" className="form-input" placeholder="Enter your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" className="form-input" placeholder="Enter your email address" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" className="form-input" placeholder="Enter your phone number" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" className="form-input" defaultValue="" required>
                    <option value="" disabled>Select a subject</option>
                    <option value="general">General Enquiry</option>
                    <option value="fabric-development">Fabric Development</option>
                    <option value="export">Export Enquiry</option>
                    <option value="bulk-order">Bulk Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" className="form-textarea" placeholder="Tell us about your requirements..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  Send Message
                </button>
              </form>
            </div>

            {/* RIGHT: Contact Info Card */}
            <div className="contact-info-card fade-in-right">
              <h3>Get In Touch</h3>

              {/* Sales & Business Enquiries */}
              <div className="contact-info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div className="info-text">
                  <h4>Sales &amp; Business Enquiries</h4>
                  <p>gkbbalu@gmail.com</p>
                </div>
              </div>

              {/* General Enquiries */}
              <div className="contact-info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div className="info-text">
                  <h4>General Enquiries</h4>
                  <p>gkbtextiles@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div className="info-text">
                  <h4>Phone</h4>
                  <p>+91 - 9443 40467</p>
                </div>
              </div>

              {/* Address */}
              <div className="contact-info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div className="info-text">
                  <h4>Address</h4>
                  <p>GKB Textiles, No. 53/8, Pudhuvalasu Main Road, Lakkapuram, Erode – 638002, Tamil Nadu, India.</p>
                </div>
              </div>

              {/* Map */}
              <div className="map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125323.40216705234!2d77.56372!3d11.341036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f46762f23cb%3A0xb493179e05e3e8!2sErode%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GKB Textiles location on Google Maps"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      {/* ============================================= */}
      {/* EXPORT CAPABILITIES SECTION                   */}
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
              <h2>Export Capabilities</h2>
              <div className="title-blocks title-blocks-right" aria-hidden="true">
                <span className="b-light"></span><span className="b-navy"></span>
                <span className="b-mid"></span><span className="b-pale"></span>
                <span className="b-empty"></span><span className="b-navy"></span>
              </div>
            </div>
            <p className="section-subtitle">GKB Textiles serves both domestic and international markets.</p>
          </div>

          <div className="export-grid stagger-children">
            {/* IEC Registered Exporter */}
            <div className="export-item fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              IEC Registered Exporter
            </div>

            {/* FOB & CIF Shipment Support */}
            <div className="export-item fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
              FOB &amp; CIF Shipment Support
            </div>

            {/* Letter of Credit (LC) Accepted */}
            <div className="export-item fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              Letter of Credit (LC) Accepted
            </div>

            {/* Advance Payment Terms */}
            <div className="export-item fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
              Advance Payment Terms
            </div>

            {/* Export Documentation Assistance */}
            <div className="export-item fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><line x1="16" y1="11" x2="8" y2="11" /><line x1="16" y1="15" x2="8" y2="15" /><line x1="10" y1="19" x2="8" y2="19" /></svg>
              Export Documentation Assistance
            </div>

            {/* Timely Shipment Coordination */}
            <div className="export-item fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Timely Shipment Coordination
            </div>
          </div>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      {/* ============================================= */}
      {/* CUSTOMER COMMITMENT CTA                       */}
      {/* ============================================= */}
      <section className="section-dark">
        <div className="container cta-section">
          <div className="fade-in">
            <h2>Our Commitment to You</h2>
            <p>At GKB Textiles, we believe that long-term business relationships are built on trust, transparency, and performance. Every order receives direct attention from management to ensure smooth execution from planning to dispatch.</p>
            <p className="accent-text" style={{ color: 'var(--gold-thread)', fontSize: '1.1rem', marginTop: '1.5rem' }}>Quality. Reliability. Innovation. Timely Delivery.</p>
          </div>
        </div>
      </section>
    </>
  );
}
