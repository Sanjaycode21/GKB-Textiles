"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'ADMIN';
  status: string;
  canManageInquiries: boolean;
  canDeleteInquiries: boolean;
  canExportInquiries: boolean;
  canManageUsers: boolean;
  canViewAuditLogs: boolean;
}

interface AdminNavProps {
  currentUser: AdminUser | null;
}

export default function AdminNav({ currentUser }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/admin/login');
    router.refresh();
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', bg: '#0b2447', text: '#ffffff' };
      case 'SUPPORT_ADMIN':
        return { label: 'Support Team', bg: '#0284c7', text: '#ffffff' };
      case 'ADMIN':
        return { label: 'Staff Admin', bg: '#475569', text: '#ffffff' };
      default:
        return { label: 'Admin', bg: '#64748b', text: '#ffffff' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Brand & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/admin/contacts" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Image 
              src="/images/logo-transparent.png" 
              alt="GKB Textiles Logo" 
              width={110} 
              height={32} 
              style={{ objectFit: 'contain' }}
              priority
            />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#0b2447',
              padding: '2px 6px',
              backgroundColor: '#f1f5f9',
              borderRadius: '4px',
              marginLeft: '4px'
            }}>Portal</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link 
              href="/admin/contacts"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                color: pathname === '/admin/contacts' ? '#0b2447' : '#64748b',
                backgroundColor: pathname === '/admin/contacts' ? '#f1f5f9' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              Inquiries
            </Link>

            {currentUser?.canManageUsers && (
              <Link 
                href="/admin/users"
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: pathname === '/admin/users' ? '#0b2447' : '#64748b',
                  backgroundColor: pathname === '/admin/users' ? '#f1f5f9' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                Team Management
              </Link>
            )}

            {currentUser?.canViewAuditLogs && (
              <Link 
                href="/admin/audit-logs"
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: pathname === '/admin/audit-logs' ? '#0b2447' : '#64748b',
                  backgroundColor: pathname === '/admin/audit-logs' ? '#f1f5f9' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                Audit Logs
              </Link>
            )}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser && (
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0b2447' }}>
                  {currentUser.name}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: badge.bg,
                  color: badge.text,
                  letterSpacing: '0.5px'
                }}>
                  {badge.label}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {currentUser.email}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            title="Sign out of administration session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

