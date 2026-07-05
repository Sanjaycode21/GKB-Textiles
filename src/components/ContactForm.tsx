"use client";

import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  const handleWhatsAppSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      setErrorMessage('Please fill out all required fields (Name, Email, Subject, and Message) before sending via WhatsApp.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // 1. Save to Supabase and trigger email bot
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process inquiry.');
      }

      // 2. Format the message for WhatsApp
      const whatsappNumber = '919080157410';
      const text = `*New Website Inquiry*\n\n` +
                   `*Name:* ${formData.fullName.trim()}\n` +
                   `*Email:* ${formData.email.trim()}\n` +
                   `*Phone:* ${formData.phone ? formData.phone.trim() : 'N/A'}\n` +
                   `*Subject:* ${formData.subject}\n\n` +
                   `*Message:*\n${formData.message.trim()}`;
                   
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      
      // 3. Open WhatsApp chat in a new tab
      window.open(url, '_blank');

      // 4. Show success screen
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-stitched fade-in-left visible flex-center" style={{ minHeight: '400px', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(74, 124, 89, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: 'var(--sage)'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--indigo-deep)', marginBottom: '1rem' }}>Message Sent Successfully!</h3>
        <p style={{ color: 'var(--charcoal-light)', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Thank you for reaching out to GKB Textiles. We have received your inquiry and will get back to you within 24 business hours.
        </p>
        <button 
          onClick={() => setStatus('idle')} 
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="form-stitched fade-in-left visible">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full-name">Full Name</label>
          <input 
            type="text" 
            id="full-name" 
            name="fullName" 
            className="form-input" 
            placeholder="Enter your full name" 
            value={formData.fullName}
            onChange={handleChange}
            required 
            disabled={status === 'submitting'}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="form-input" 
            placeholder="Enter your email address" 
            value={formData.email}
            onChange={handleChange}
            required 
            disabled={status === 'submitting'}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="form-input" 
            placeholder="Enter your phone number" 
            value={formData.phone}
            onChange={handleChange}
            disabled={status === 'submitting'}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select 
            id="subject" 
            name="subject" 
            className="form-input" 
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
          >
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
          <textarea 
            id="message" 
            name="message" 
            className="form-textarea" 
            placeholder="Tell us about your requirements..." 
            value={formData.message}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
          ></textarea>
        </div>
        
        {status === 'error' && (
          <div style={{
            color: '#721c24',
            backgroundColor: '#f8d7da',
            borderColor: '#f5c6cb',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
            border: '1px solid #f5c6cb',
            textAlign: 'left'
          }}>
            {errorMessage || 'Failed to send message. Please try again later.'}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.5rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={status === 'submitting'}
            style={{ display: 'inline-flex', alignItems: 'center', height: '48px', padding: '0 24px' }}
          >
            {status === 'submitting' ? (
              <>
                <svg 
                  className="animate-spin" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  style={{ 
                    marginRight: '8px', 
                    width: '16px', 
                    height: '16px', 
                    animation: 'spin 1s linear infinite',
                    color: 'currentColor' 
                  }}
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ marginRight: '8px' }}
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Message
              </>
            )}
          </button>

          <button 
            type="button"
            onClick={handleWhatsAppSubmit}
            disabled={status === 'submitting'}
            className="btn"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              backgroundColor: '#25D366', 
              color: '#ffffff', 
              border: 'none',
              padding: '0 24px',
              height: '48px',
              fontWeight: 600,
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#20ba5a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              style={{ marginRight: '8px' }}
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.978 14.12 1.01 11.5 1.012c-5.433 0-9.858 4.37-9.863 9.8-.001 1.716.463 3.393 1.343 4.881L1.932 20.48l4.715-1.326z" />
            </svg>
            Send via WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
