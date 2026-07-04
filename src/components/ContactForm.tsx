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
    <div className="form-stitched fade-in-left">
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
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={status === 'submitting'}
          style={{ display: 'inline-flex', alignItems: 'center' }}
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
      </form>
    </div>
  );
}
