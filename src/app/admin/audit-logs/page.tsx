"use client";

import React, { useState, useEffect } from 'react';
import AdminNav, { AdminUser } from '@/components/admin/AdminNav';

interface AuditLogItem {
  id: number;
  userId: number | null;
  userEmail: string;
  action: string;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch current user
      const meRes = await fetch('/api/admin/auth/me');
      if (!meRes.ok) throw new Error('Authentication required.');
      const meData = await meRes.json();
      setCurrentUser(meData.user);

      // 2. Fetch logs
      const url = new URL('/api/admin/audit-logs', window.location.origin);
      if (actionFilter !== 'all') url.searchParams.set('action', actionFilter);
      if (searchTerm.trim()) url.searchParams.set('search', searchTerm.trim());

      const res = await fetch(url.toString());
      if (!res.ok) {
        if (res.status === 403) throw new Error('Forbidden: You do not have permission to view audit logs.');
        throw new Error('Failed to retrieve audit records.');
      }
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionBadge = (action: string) => {
    if (action.includes('FAILED') || action.includes('DELETED') || action.includes('LOCKED')) {
      return { bg: '#fee2e2', text: '#991b1b' };
    }
    if (action.includes('SUCCESS') || action.includes('ACCEPTED')) {
      return { bg: '#dcfce7', text: '#166534' };
    }
    if (action.includes('INVITED') || action.includes('UPDATED')) {
      return { bg: '#e0f2fe', text: '#0369a1' };
    }
    return { bg: '#f1f5f9', text: '#334155' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'var(--font-inter, sans-serif)' }}>
      <AdminNav currentUser={currentUser} />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#0b2447',
            margin: '0 0 0.5rem',
            fontFamily: 'var(--font-heading, serif)',
          }}>
            System Security &amp; Audit Logs
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Immutable event record of administrator authentication, permission updates, and data operations.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Filters */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 300px' }}>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by actor email or details..."
              style={{ flex: 1, height: '40px', padding: '0 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
            />
            <button type="submit" style={{ padding: '0 18px', background: '#0b2447', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
              Search
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Action Type:</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
            >
              <option value="all">All Actions</option>
              <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
              <option value="LOGIN_FAILED">LOGIN_FAILED</option>
              <option value="LOGIN_LOCKED">LOGIN_LOCKED</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="USER_INVITED">USER_INVITED</option>
              <option value="USER_UPDATED">USER_UPDATED</option>
              <option value="USER_DELETED">USER_DELETED</option>
              <option value="INQUIRY_DELETED">INQUIRY_DELETED</option>
              <option value="PASSWORD_RESET_SUCCESS">PASSWORD_RESET_SUCCESS</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 18px' }}>Timestamp</th>
                  <th style={{ padding: '12px 18px' }}>Actor</th>
                  <th style={{ padding: '12px 18px' }}>Action</th>
                  <th style={{ padding: '12px 18px' }}>IP Address</th>
                  <th style={{ padding: '12px 18px' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      Loading audit records...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      No audit records found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => {
                    const badge = getActionBadge(log.action);
                    return (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 18px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 18px', fontWeight: 600, color: '#0b2447' }}>
                          {log.userEmail}
                        </td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            backgroundColor: badge.bg,
                            color: badge.text,
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px', color: '#64748b', fontFamily: 'monospace' }}>
                          {log.ipAddress || 'Unknown'}
                        </td>
                        <td style={{ padding: '12px 18px', color: '#475569', maxWidth: '350px', wordBreak: 'break-word' }}>
                          {log.details || '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

