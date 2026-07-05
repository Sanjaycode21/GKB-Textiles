"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ThreadDivider from '@/components/ThreadDivider';

interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteSubmit = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts?id=${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete contact submission.');
      }
      setContacts((prev) => prev.filter((item) => item.id !== deleteId));
      if (selectedContact?.id === deleteId) {
        setSelectedContact(null);
      }
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || 'An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/contacts');
      if (!res.ok) {
        throw new Error('Failed to load contact submissions.');
      }
      const data = await res.json();
      setContacts(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading database data.');
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const totalCount = contacts.length;
  const exportCount = contacts.filter(c => c.subject === 'export').length;
  const bulkCount = contacts.filter(c => c.subject === 'bulk-order').length;
  const devCount = contacts.filter(c => c.subject === 'fabric-development').length;

  // Filtered contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone && contact.phone.includes(searchTerm));
      
    const matchesSubject = subjectFilter === 'all' || contact.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });

  // Export to CSV helper
  const exportToCSV = () => {
    if (filteredContacts.length === 0) return;
    
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Subject', 'Message', 'Submitted At'];
    const rows = filteredContacts.map(c => [
      c.id,
      `"${c.fullName.replace(/"/g, '""')}"`,
      c.email,
      c.phone || '',
      c.subject,
      `"${c.message.replace(/"/g, '""')}"`,
      new Date(c.createdAt).toLocaleString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gkb_textiles_inquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case 'general': return 'General Enquiry';
      case 'fabric-development': return 'Fabric Dev';
      case 'export': return 'Export';
      case 'bulk-order': return 'Bulk Order';
      default: return subject;
    }
  };

  const getSubjectBadgeStyle = (subject: string) => {
    switch (subject) {
      case 'export':
        return { backgroundColor: 'rgba(22, 48, 87, 0.1)', color: 'var(--indigo-deep)', border: '1px solid var(--indigo-pale)' };
      case 'bulk-order':
        return { backgroundColor: 'rgba(154, 179, 205, 0.2)', color: '#1a3a60', border: '1px solid var(--gold-thread)' };
      case 'fabric-development':
        return { backgroundColor: 'var(--sage-pale)', color: 'var(--sage-dark)', border: '1px solid var(--sage-light)' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db' };
    }
  };

  return (
    <>
      {/* ============================================= */}
      {/* PAGE HERO                                     */}
      {/* ============================================= */}
      <section className="hero hero-page">
        <div className="hero-bg">
          <Image 
            src="/images/thread-spools.jpg" 
            alt="Admin console background showing fabric weaving details" 
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 45%' }}
          />
        </div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content center">
          <span className="hero-tagline">Admin Console</span>
          <h1>Contact Database</h1>
          <p className="hero-description">Secure, local database inquiries from the GKB Textiles Contact Us form.</p>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      <main style={{ minHeight: 'calc(100vh - var(--nav-height))', padding: '4rem 0', backgroundColor: 'var(--cream, #fbf9f6)' }}>
        <div className="container">
          
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: 'var(--indigo-deep, #1e3a8a)', fontSize: '1.8rem', margin: 0 }}>
              Inquiries Management
            </h2>
            
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                onClick={fetchContacts}
                className="btn btn-outline-dark"
                style={{ 
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '44px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                Refresh
              </button>
              <button 
                onClick={exportToCSV}
                disabled={filteredContacts.length === 0}
                className="btn btn-primary"
                style={{ 
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '44px',
                  opacity: filteredContacts.length === 0 ? 0.6 : 1,
                  cursor: filteredContacts.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Warning Alert about Database Location */}
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '2.5rem',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            color: '#b45309',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
              <strong>Dev Note:</strong> This database is connected directly to your hosted **Supabase** instance. Submissions are persistent. Ensure that you secure this admin dashboard route using authentication before deploying to a public production URL.
            </div>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-card" style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--indigo-light, #94a3b8)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Inquiries</h4>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--indigo-deep, #1e3a8a)', fontFamily: 'var(--font-heading, serif)' }}>{totalCount}</span>
            </div>
            <div className="admin-card" style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--indigo-light, #94a3b8)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Export Orders</h4>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--indigo-deep, #1e3a8a)', fontFamily: 'var(--font-heading, serif)' }}>{exportCount}</span>
            </div>
            <div className="admin-card" style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--indigo-light, #94a3b8)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Bulk Inquiries</h4>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--indigo-deep, #1e3a8a)', fontFamily: 'var(--font-heading, serif)' }}>{bulkCount}</span>
            </div>
            <div className="admin-card" style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--indigo-light, #94a3b8)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Fabric Dev</h4>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--indigo-deep, #1e3a8a)', fontFamily: 'var(--font-heading, serif)' }}>{devCount}</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="admin-card" style={{ marginBottom: '2rem' }}>
            <div className="admin-filter-bar">
              <div className="admin-filter-search">
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--indigo-deep)' }}>Search Inquiries</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search name, email, phone, or message contents..." 
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '40px', height: '48px', border: '1px solid var(--indigo-pale)', borderRadius: '4px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg 
                    style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--indigo-light)' }}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              <div className="admin-filter-select">
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--indigo-deep)' }}>Filter by Subject</label>
                <select 
                  className="form-input"
                  style={{ height: '48px', border: '1px solid var(--indigo-pale)', borderRadius: '4px', backgroundColor: 'var(--white)' }}
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="general">General Enquiry</option>
                  <option value="fabric-development">Fabric Development</option>
                  <option value="export">Export Enquiry</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

        {/* main table or grid */}
        {error && (
          <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '2rem', textAlign: 'center', borderRadius: '6px', border: '1px solid #f5c6cb' }}>
            <p>{error}</p>
            <button onClick={fetchContacts} className="btn btn-primary" style={{ marginTop: '1rem' }}>Try Again</button>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--white)', borderRadius: '6px', border: '1px solid var(--indigo-pale)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--indigo-pale)', borderTopColor: 'var(--indigo-deep)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--charcoal-light)' }}>Connecting to Supabase Database...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex-center" style={{ minHeight: '300px', flexDirection: 'column', textAlign: 'center', backgroundColor: 'var(--white)', borderRadius: '6px', border: '1px solid var(--indigo-pale)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', padding: '2rem' }}>
            <div style={{ color: 'var(--indigo-pale)', marginBottom: '1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 4v16M2 12h20" /></svg>
            </div>
            <h3 style={{ color: 'var(--indigo-deep)' }}>No Inquiries Found</h3>
            <p style={{ color: 'var(--charcoal-light)', maxWidth: '400px', margin: '0.5rem auto 0' }}>
              {contacts.length === 0 
                ? "You haven't received any contact inquiries yet. Submit a message on the Contact page to test!"
                : "No inquiries match your current search queries or subject filter settings."}
            </p>
          </div>
        ) : (
          <div className="admin-inquiries-list">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`admin-inquiry-card ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--indigo-deep)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {contact.fullName}
                      <span 
                        style={{ 
                          fontSize: '0.7rem', 
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          ...getSubjectBadgeStyle(contact.subject)
                        }}
                      >
                        {getSubjectLabel(contact.subject)}
                      </span>
                    </h3>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.3rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--charcoal-light)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <span style={{ fontSize: '0.8rem', color: 'var(--indigo-light)' }}>
                    {new Date(contact.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div 
                  style={{ 
                    marginTop: '1rem', 
                    paddingTop: '0.8rem', 
                    borderTop: '1px dashed var(--indigo-pale)',
                    color: 'var(--charcoal)',
                    whiteSpace: selectedContact?.id === contact.id ? 'pre-wrap' : 'nowrap',
                    overflow: selectedContact?.id === contact.id ? 'visible' : 'hidden',
                    textOverflow: selectedContact?.id === contact.id ? 'clip' : 'ellipsis',
                    maxHeight: selectedContact?.id === contact.id ? 'none' : '2.4rem',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}
                >
                  {contact.message}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(contact.id);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease',
                    }}
                    className="delete-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Delete
                  </button>

                  <div style={{ fontSize: '0.8rem', color: 'var(--indigo-mid)', textDecoration: 'underline' }}>
                    {selectedContact?.id === contact.id ? 'Click to collapse message' : 'Click to read full message'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .delete-btn:hover {
          background-color: rgba(220, 38, 38, 0.08) !important;
          color: #b91c1c !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </main>

    {/* ===== DELETE CONFIRMATION MODAL ===== */}
    {deleteId !== null && (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 36, 71, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.25s ease'
      }}>
        <div style={{
          backgroundColor: 'var(--white, #ffffff)',
          borderRadius: '12px',
          border: '1px solid var(--indigo-pale, #e2e8f0)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '90%',
          maxWidth: '440px',
          padding: '2.2rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#ef4444'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--indigo-deep, #0b2447)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading, serif)' }}>
            Confirm Delete
          </h3>
          <p style={{ color: 'var(--charcoal-light, #64748b)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Are you sure you want to delete this contact submission? This action will permanently remove this record from your database and cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
              className="btn btn-outline-dark"
              style={{
                height: '42px',
                padding: '0 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteSubmit}
              disabled={isDeleting}
              className="btn btn-primary"
              style={{
                height: '42px',
                padding: '0 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: '#dc2626',
                borderColor: '#dc2626',
                color: '#ffffff',
                cursor: 'pointer',
                opacity: isDeleting ? 0.7 : 1
              }}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
