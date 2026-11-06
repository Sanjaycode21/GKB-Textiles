"use client";

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/contacts';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      if (data.requiresTwoFactor) {
        setRequires2FA(true);
        setIsSubmitting(false);
        return;
      }

      // Successful login
      if (data.user) {
        try {
          localStorage.setItem('gkb_admin_user', JSON.stringify(data.user));
        } catch {}
      }
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: twoFactorCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify authentication code.');
      }

      if (data.user) {
        try {
          localStorage.setItem('gkb_admin_user', JSON.stringify(data.user));
        } catch {}
      }
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid verification code.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem',
      fontFamily: 'var(--font-inter, sans-serif)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(11, 36, 71, 0.08), 0 8px 10px -6px rgba(11, 36, 71, 0.03)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#0b2447',
          padding: '2.5rem 2rem 2rem',
          textAlign: 'center',
          color: '#ffffff',
        }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <Image 
              src="/images/logo-transparent.png" 
              alt="GKB Textiles Logo" 
              width={140} 
              height={42} 
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              priority
            />
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: '0 0 0.5rem',
            letterSpacing: '0.5px',
          }}>
            Administrator Portal
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            margin: 0,
          }}>
            {requires2FA ? 'Two-Factor Authentication' : 'Authorized Personnel Access Only'}
          </p>
        </div>

        {/* Body Form */}
        <div style={{ padding: '2.25rem 2rem' }}>
          {errorMessage && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {!requires2FA ? (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.5rem',
                }}>
                  Admin Email
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gkbtextiles.com"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    fontSize: '0.95rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}>
                  <label style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155',
                  }}>
                    Password
                  </label>
                  <Link 
                    href="/admin/forgot-password"
                    style={{
                      fontSize: '0.8rem',
                      color: '#0b2447',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    fontSize: '0.95rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#0b2447',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit}>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Enter the 6-digit verification code sent to <strong>{email}</strong>.
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="text"
                  required
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoFocus
                  style={{
                    width: '100%',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '8px',
                    border: '2px solid #0b2447',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || twoFactorCode.length < 6}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#0b2447',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || twoFactorCode.length < 6 ? 0.7 : 1,
                  marginBottom: '1rem',
                }}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => { setRequires2FA(false); setErrorMessage(''); }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Back to email &amp; password
              </button>
            </form>
          )}

          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#94a3b8',
          }}>
            Protected by GKB Textiles Role-Based Access Control
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        Loading sign in...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
