"use client";

import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchContacts();
  }, []);

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
    <main className="fabric-bg" style={{ minHeight: 'calc(100vh - var(--nav-height))', padding: '3rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--indigo-pale)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="accent-text" style={{ color: 'var(--sage)', fontSize: '1.1rem' }}>Admin Console</span>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--indigo-deep)', fontSize: '2.5rem', marginTop: '0.2rem' }}>Contact Database</h1>
              <p style={{ color: 'var(--charcoal-light)', margin: '0.2rem 0 0' }}>
                Secure, local database inquiries from the GKB Textiles Contact Us form.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                onClick={fetchContacts}
                className="btn"
                style={{ 
                  backgroundColor: 'var(--white)', 
                  border: '1px solid var(--indigo-light)', 
                  color: 'var(--indigo-deep)',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
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
                  opacity: filteredContacts.length === 0 ? 0.6 : 1,
                  cursor: filteredContacts.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Warning Alert about Database Location */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          color: '#b45309'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <div style={{ fontSize: '0.9rem' }}>
            <strong>Dev Note:</strong> This database is connected directly to your hosted **Supabase** instance. Submissions are persistent. Ensure that you secure this admin dashboard route using authentication before deploying to a public production URL.
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="form-stitched" style={{ padding: '1.2rem', textAlign: 'center', backgroundColor: 'var(--white)' }}>
            <h4 style={{ color: 'var(--indigo-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Total Inquiries</h4>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--indigo-deep)', fontFamily: 'var(--font-heading)' }}>{totalCount}</span>
          </div>
          <div className="form-stitched" style={{ padding: '1.2rem', textAlign: 'center', backgroundColor: 'var(--white)' }}>
            <h4 style={{ color: 'var(--indigo-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Export Orders</h4>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--indigo-deep)', fontFamily: 'var(--font-heading)' }}>{exportCount}</span>
          </div>
          <div className="form-stitched" style={{ padding: '1.2rem', textAlign: 'center', backgroundColor: 'var(--white)' }}>
            <h4 style={{ color: 'var(--indigo-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Bulk Inquiries</h4>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--indigo-deep)', fontFamily: 'var(--font-heading)' }}>{bulkCount}</span>
          </div>
          <div className="form-stitched" style={{ padding: '1.2rem', textAlign: 'center', backgroundColor: 'var(--white)' }}>
            <h4 style={{ color: 'var(--indigo-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Fabric Dev</h4>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--indigo-deep)', fontFamily: 'var(--font-heading)' }}>{devCount}</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="form-stitched" style={{ padding: '1.5rem', backgroundColor: 'var(--white)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

            <div style={{ flex: '0 1 240px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
          <div className="form-stitched" style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '2rem', textAlign: 'center' }}>
            <p>{error}</p>
            <button onClick={fetchContacts} className="btn btn-primary" style={{ marginTop: '1rem' }}>Try Again</button>
          </div>
        )}

        {loading ? (
          <div className="form-stitched" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--white)' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--indigo-pale)', borderTopColor: 'var(--indigo-deep)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--charcoal-light)' }}>Connecting to Supabase Database...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="form-stitched flex-center" style={{ minHeight: '300px', flexDirection: 'column', textAlign: 'center', backgroundColor: 'var(--white)' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className="form-stitched"
                style={{ 
                  backgroundColor: 'var(--white)',
                  padding: '1.5rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: selectedContact?.id === contact.id ? '2px solid var(--sage)' : '1px solid transparent'
                }}
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--indigo-mid)', textDecoration: 'underline' }}>
                  {selectedContact?.id === contact.id ? 'Click to collapse message' : 'Click to read full message'}
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
      `}</style>
    </main>
  );
}
