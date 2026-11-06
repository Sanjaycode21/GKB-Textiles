"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ThreadDivider from '@/components/ThreadDivider';
import AdminNav, { AdminUser } from '@/components/admin/AdminNav';

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
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMeAndContacts();
  }, []);

  const fetchMeAndContacts = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch authenticated administrator profile & permissions
      const meRes = await fetch('/api/admin/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      // 2. Fetch contacts
      const res = await fetch('/api/admin/contacts');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Authentication required: Please sign in with an authorized account.');
        }
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

  const handleDeleteSubmit = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts?id=${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete contact submission.');
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
    if (filteredContacts.length === 0 || !currentUser?.canExportInquiries) return;
    
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
      case 'custom-weave': return 'Custom Weave';
      case 'visit': return 'Mill Visit';
      default: return subject;
    }
  };

  const getSubjectBadgeClass = (subject: string) => {
    switch (subject) {
      case 'export': return 'badge-export';
      case 'bulk-order': return 'badge-bulk';
      case 'fabric-development': return 'badge-dev';
      default: return 'badge-general';
    }
  };

  return (
    <>
      {/* Role-Based Admin Navigation Header */}
      <AdminNav currentUser={currentUser} />

      {/* Hero Section */}
      <section className="hero hero-page" style={{ minHeight: '260px', padding: '3.5rem 0 2.5rem' }}>
        <div className="hero-bg">
          <Image 
            src="/images/thread-spools.jpg" 
            alt="White thread spools loaded on creel at GKB Textiles factory in Erode" 
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 45%' }}
          />
        </div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content center">
          <span className="hero-tagline">Admin Portal</span>
          <h1>Inquiries Management</h1>
          <p className="hero-description">Secure contact submissions from domestic buyers and global export partners.</p>
        </div>
      </section>

      {/* Thread Divider */}
      <ThreadDivider />

      <main style={{ minHeight: 'calc(100vh - var(--nav-height))', padding: '3rem 0 4rem', backgroundColor: 'var(--cream, #fbf9f6)' }}>
        <div className="container">
          
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: 'var(--indigo-deep, #1e3a8a)', fontSize: '1.75rem', margin: '0 0 0.25rem' }}>
                Contact Submissions
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {currentUser ? `Signed in as ${currentUser.name} (${currentUser.role})` : 'Authorized session'}
              </span>
            </div>
            
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

              {currentUser?.canExportInquiries && (
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
              )}
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
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            backgroundColor: 'var(--white, #ffffff)',
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid var(--indigo-pale, #e2e8f0)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <input 
                type="text"
                placeholder="Search by name, email, phone or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '6px',
                  border: '1px solid var(--indigo-pale, #cbd5e1)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
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
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--indigo-light, #94a3b8)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--charcoal-light, #64748b)', marginRight: '4px' }}>Filter:</span>
              {(['all', 'export', 'bulk-order', 'fabric-development', 'general'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSubjectFilter(filter)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: subjectFilter === filter ? 'var(--indigo-deep, #1e3a8a)' : 'var(--indigo-pale, #cbd5e1)',
                    backgroundColor: subjectFilter === filter ? 'var(--indigo-deep, #1e3a8a)' : 'transparent',
                    color: subjectFilter === filter ? '#ffffff' : 'var(--charcoal-light, #64748b)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {filter === 'all' ? 'All Inquiries' : getSubjectLabel(filter)}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', borderRadius: '6px', marginBottom: '2rem' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Contacts List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--charcoal-light, #64748b)' }}>
              <div style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid var(--indigo-pale, #cbd5e1)',
                borderTopColor: 'var(--indigo-deep, #1e3a8a)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Loading submissions from database...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'var(--white, #ffffff)',
              borderRadius: '8px',
              border: '1px dashed var(--indigo-pale, #cbd5e1)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--indigo-light, #94a3b8)', margin: '0 auto 1rem' }}><circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
              <h3 style={{ color: 'var(--indigo-deep, #1e3a8a)', margin: '0 0 0.5rem', fontFamily: 'var(--font-heading, serif)' }}>No Submissions Found</h3>
              <p style={{ color: 'var(--charcoal-light, #64748b)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                {contacts.length === 0 
                  ? "There are currently no customer inquiries saved in the database."
                  : "No submissions match your active search and filter criteria."}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  style={{
                    backgroundColor: 'var(--white, #ffffff)',
                    border: '1px solid var(--indigo-pale, #e2e8f0)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-soft)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--indigo-deep, #1e3a8a)', fontFamily: 'var(--font-heading, serif)' }}>
                          {contact.fullName}
                        </h3>
                        <span className={`admin-badge ${getSubjectBadgeClass(contact.subject)}`}>
                          {getSubjectLabel(contact.subject)}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--charcoal-light, #64748b)', marginTop: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                          <a href={`mailto:${contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.email}</a>
                        </span>
                        
                        {contact.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <a href={`tel:${contact.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.phone}</a>
                          </span>
                        )}
                        
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          {new Date(contact.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Box */}
                  <div 
                    onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}
                    style={{
                      backgroundColor: 'var(--cream, #fbf9f6)',
                      border: '1px solid var(--indigo-pale, #e2e8f0)',
                      borderRadius: '6px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: 'var(--charcoal-deep, #334155)',
                      lineHeight: '1.6',
                      marginTop: '0.5rem',
                      position: 'relative'
                    }}
                  >
                    <p style={{ 
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: selectedContact?.id === contact.id ? 'unset' : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {contact.message}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    {currentUser?.canDeleteInquiries ? (
                      <button 
                        onClick={() => setDeleteId(contact.id)}
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
                    ) : <div />}

                    <div style={{ fontSize: '0.8rem', color: 'var(--indigo-mid)', textDecoration: 'underline', cursor: 'pointer' }}
                         onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}>
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
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
                style={{ height: '42px', padding: '0 20px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
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
