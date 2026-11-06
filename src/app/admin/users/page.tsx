"use client";

import React, { useState, useEffect } from 'react';
import AdminNav, { AdminUser } from '@/components/admin/AdminNav';

interface AdminMember extends AdminUser {
  createdAt: string;
  lastLoginAt: string | null;
}

interface PendingInvite {
  id: number;
  email: string;
  name: string;
  role: string;
  expiresAt: string;
  createdAt: string;
  invitedBy: string;
}

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminMember | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'SUPPORT_ADMIN' | 'ADMIN' | 'SUPER_ADMIN'>('SUPPORT_ADMIN');
  const [inviteCanManageInquiries, setInviteCanManageInquiries] = useState(true);
  const [inviteCanDeleteInquiries, setInviteCanDeleteInquiries] = useState(false);
  const [inviteCanExportInquiries, setInviteCanExportInquiries] = useState(true);
  const [inviteCanViewAuditLogs, setInviteCanViewAuditLogs] = useState(true);
  const [submittingInvite, setSubmittingInvite] = useState(false);

  useEffect(() => {
    fetchMeAndData();
  }, []);

  const fetchMeAndData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch current user
      const meRes = await fetch('/api/admin/auth/me');
      if (!meRes.ok) throw new Error('Failed to verify session.');
      const meData = await meRes.json();
      setCurrentUser(meData.user);

      // 2. Fetch users list
      const usersRes = await fetch('/api/admin/users');
      if (!usersRes.ok) {
        if (usersRes.status === 403) {
          throw new Error('Access denied: You must be a Super Admin to access user management.');
        }
        throw new Error('Failed to load administrator records.');
      }
      const data = await usersRes.json();
      setUsers(data.users || []);
      setPendingInvites(data.pendingInvitations || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred loading records.');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInvite(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName,
          role: inviteRole,
          permissions: {
            canManageInquiries: inviteRole === 'SUPER_ADMIN' ? true : inviteCanManageInquiries,
            canDeleteInquiries: inviteRole === 'SUPER_ADMIN' ? true : inviteCanDeleteInquiries,
            canExportInquiries: inviteRole === 'SUPER_ADMIN' ? true : inviteCanExportInquiries,
            canViewAuditLogs: inviteRole === 'SUPER_ADMIN' ? true : inviteCanViewAuditLogs,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch invitation.');

      setSuccessMessage(`Invitation successfully dispatched to ${inviteEmail}.`);
      setIsInviteOpen(false);
      setInviteEmail('');
      setInviteName('');
      fetchMeAndData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleStatusToggle = async (user: AdminMember) => {
    const newStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status.');
      setSuccessMessage(`Account for ${user.email} is now ${newStatus}.`);
      fetchMeAndData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditPermissionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          role: editingUser.role,
          permissions: {
            canManageInquiries: editingUser.canManageInquiries,
            canDeleteInquiries: editingUser.canDeleteInquiries,
            canExportInquiries: editingUser.canExportInquiries,
            canViewAuditLogs: editingUser.canViewAuditLogs,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update permissions.');

      setSuccessMessage(`Permissions updated for ${editingUser.name}.`);
      setEditingUser(null);
      fetchMeAndData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const res = await fetch(`/api/admin/users?id=${deleteUserId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete account.');
      setSuccessMessage('Administrator account removed successfully.');
      setDeleteUserId(null);
      fetchMeAndData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRevokeInvite = async (inviteId: number) => {
    if (!confirm('Are you sure you want to revoke this pending invitation?')) return;
    try {
      const res = await fetch(`/api/admin/users?inviteId=${inviteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to revoke invite.');
      setSuccessMessage('Invitation revoked successfully.');
      fetchMeAndData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'var(--font-inter, sans-serif)' }}>
      <AdminNav currentUser={currentUser} />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#0b2447',
              margin: '0 0 0.5rem',
              fontFamily: 'var(--font-heading, serif)',
            }}>
              Administrator Team Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              Manage staff accounts, assign granular role permissions, and track active sessions.
            </p>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0b2447',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(11, 36, 71, 0.15)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Invite Administrator
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}>
            {successMessage}
          </div>
        )}

        {/* Members Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b2447', margin: 0 }}>
              Active Administrator Accounts ({users.length})
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 20px' }}>Administrator</th>
                  <th style={{ padding: '12px 20px' }}>Role</th>
                  <th style={{ padding: '12px 20px' }}>Permissions</th>
                  <th style={{ padding: '12px 20px' }}>Status</th>
                  <th style={{ padding: '12px 20px' }}>Last Sign In</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#0b2447' }}>{u.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: u.role === 'SUPER_ADMIN' ? '#0b2447' : u.role === 'SUPPORT_ADMIN' ? '#0284c7' : '#475569',
                        color: '#ffffff',
                      }}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {u.canManageInquiries && <span style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.75rem' }}>View</span>}
                        {u.canDeleteInquiries && <span style={{ padding: '2px 6px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '0.75rem' }}>Delete</span>}
                        {u.canExportInquiries && <span style={{ padding: '2px 6px', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '0.75rem' }}>Export</span>}
                        {u.canViewAuditLogs && <span style={{ padding: '2px 6px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.75rem' }}>Audit</span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: u.status === 'ACTIVE' ? '#dcfce7' : u.status === 'INVITED' ? '#fef3c7' : '#fee2e2',
                        color: u.status === 'ACTIVE' ? '#166534' : u.status === 'INVITED' ? '#92400e' : '#991b1b',
                      }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.85rem' }}>
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {currentUser?.id !== u.id && (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => setEditingUser(u)}
                            style={{
                              padding: '4px 10px',
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleStatusToggle(u)}
                            style={{
                              padding: '4px 10px',
                              background: u.status === 'ACTIVE' ? '#fff1f2' : '#f0fdf4',
                              border: '1px solid',
                              borderColor: u.status === 'ACTIVE' ? '#fecdd3' : '#bbf7d0',
                              color: u.status === 'ACTIVE' ? '#be123c' : '#15803d',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => setDeleteUserId(u.id)}
                            style={{
                              padding: '4px 10px',
                              background: '#fee2e2',
                              border: '1px solid #fca5a5',
                              color: '#b91c1c',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invites Section */}
        {pendingInvites.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b2447', margin: 0 }}>
                Pending Invitations ({pendingInvites.length})
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 20px' }}>Invitee</th>
                    <th style={{ padding: '12px 20px' }}>Assigned Role</th>
                    <th style={{ padding: '12px 20px' }}>Invited By</th>
                    <th style={{ padding: '12px 20px' }}>Expires</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvites.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#0b2447' }}>{inv.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{inv.email}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>{inv.role}</td>
                      <td style={{ padding: '14px 20px', color: '#64748b' }}>{inv.invitedBy}</td>
                      <td style={{ padding: '14px 20px', color: '#64748b' }}>{new Date(inv.expiresAt).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleRevokeInvite(inv.id)}
                          style={{
                            padding: '4px 10px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fca5a5',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Revoke Invite
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ===== INVITE MODAL ===== */}
      {isInviteOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 36, 71, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b2447', marginBottom: '1.5rem' }}>
              Invite Administrator
            </h2>

            <form onSubmit={handleInviteSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Staff Full Name
                </label>
                <input 
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Balakrishnan G"
                  style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input 
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="staff@gkbtextiles.com"
                  style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Role Assignment
                </label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                >
                  <option value="SUPPORT_ADMIN">SUPPORT_ADMIN (Zockle Support Team)</option>
                  <option value="ADMIN">ADMIN (General Staff)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Business Owner Co-Partner)</option>
                </select>
              </div>

              {inviteRole !== 'SUPER_ADMIN' && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0b2447', marginBottom: '0.75rem' }}>
                    Granular Access Permissions
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    <input 
                      type="checkbox" 
                      checked={inviteCanManageInquiries} 
                      onChange={(e) => setInviteCanManageInquiries(e.target.checked)} 
                    />
                    View &amp; Manage Contact Inquiries
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    <input 
                      type="checkbox" 
                      checked={inviteCanExportInquiries} 
                      onChange={(e) => setInviteCanExportInquiries(e.target.checked)} 
                    />
                    Export Inquiries to CSV
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    <input 
                      type="checkbox" 
                      checked={inviteCanDeleteInquiries} 
                      onChange={(e) => setInviteCanDeleteInquiries(e.target.checked)} 
                    />
                    Delete Inquiries Record (Caution)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                    <input 
                      type="checkbox" 
                      checked={inviteCanViewAuditLogs} 
                      onChange={(e) => setInviteCanViewAuditLogs(e.target.checked)} 
                    />
                    View System Audit Logs
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  style={{ padding: '8px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInvite}
                  style={{ padding: '8px 20px', background: '#0b2447', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {submittingInvite ? 'Dispatching...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 36, 71, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b2447', marginBottom: '1rem' }}>
              Edit Permissions: {editingUser.name}
            </h2>

            <form onSubmit={handleEditPermissionsSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                >
                  <option value="SUPPORT_ADMIN">SUPPORT_ADMIN (Zockle Support Team)</option>
                  <option value="ADMIN">ADMIN (General Staff)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>

              {editingUser.role !== 'SUPER_ADMIN' && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={editingUser.canManageInquiries} 
                      onChange={(e) => setEditingUser({ ...editingUser, canManageInquiries: e.target.checked })} 
                    />
                    View &amp; Manage Contact Inquiries
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={editingUser.canExportInquiries} 
                      onChange={(e) => setEditingUser({ ...editingUser, canExportInquiries: e.target.checked })} 
                    />
                    Export Inquiries to CSV
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={editingUser.canDeleteInquiries} 
                      onChange={(e) => setEditingUser({ ...editingUser, canDeleteInquiries: e.target.checked })} 
                    />
                    Delete Inquiries Record
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                    <input 
                      type="checkbox" 
                      checked={editingUser.canViewAuditLogs} 
                      onChange={(e) => setEditingUser({ ...editingUser, canViewAuditLogs: e.target.checked })} 
                    />
                    View System Audit Logs
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: '8px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#0b2447', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE USER MODAL ===== */}
      {deleteUserId !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 36, 71, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '420px',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b2447', marginBottom: '0.75rem' }}>
              Remove Administrator
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to permanently revoke this administrator account? All active sessions for this user will be terminated immediately.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteUserId(null)}
                style={{ padding: '8px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                style={{ padding: '8px 20px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Yes, Remove Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

