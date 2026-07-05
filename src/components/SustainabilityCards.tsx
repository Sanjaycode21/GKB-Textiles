"use client";

import React, { useState } from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  icon: React.ReactNode;
}

function Card({ title, description, imageUrl, icon }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div 
      className={`feature-card-interactive ${isHovered || isActive ? 'active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false); // Reset active state on mouse leave for desktop
      }}
      onClick={handleToggle}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 30px',
        backgroundColor: 'var(--white, #ffffff)',
        border: '1.5px dashed var(--gold-thread, #c5a880)',
        borderRadius: '4px',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.01)',
      }}
    >
      {/* Front Face: Text Details */}
      <div 
        className="card-front-content"
        style={{
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isHovered || isActive ? 0 : 1,
          transform: isHovered || isActive ? 'translate3d(0, -15px, 0) scale(0.95)' : 'translate3d(0, 0, 0) scale(1)',
          pointerEvents: isHovered || isActive ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div className="feature-icon" style={{ marginBottom: '1.5rem', color: 'var(--sage, #4a7c59)' }}>
          {icon}
        </div>
        <h3 style={{ 
          fontFamily: 'var(--font-heading, "Playfair Display", serif)', 
          fontSize: '1.35rem', 
          color: 'var(--indigo-deep, #1e3a8a)', 
          marginBottom: '1rem',
          fontWeight: 700
        }}>
          {title}
        </h3>
        <p style={{ 
          fontSize: '0.92rem', 
          color: 'var(--charcoal-light, #64748b)', 
          lineHeight: '1.6',
          margin: 0
        }}>
          {description}
        </p>
      </div>

      {/* Back Face: Image Display */}
      <div 
        className="card-back-image"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isHovered || isActive ? 1 : 0,
          transform: isHovered || isActive ? 'scale(1)' : 'scale(1.08)',
          filter: isHovered || isActive ? 'none' : 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '30px',
          zIndex: 2,
        }}
      >
        {/* Dark gradient overlay for readability */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.1) 100%)',
            zIndex: 1
          }}
        />
        
        {/* Overlay Title */}
        <div style={{ position: 'relative', zIndex: 3, color: '#ffffff', textAlign: 'left' }}>
          <h4 style={{ 
            fontFamily: 'var(--font-heading, "Playfair Display", serif)', 
            fontSize: '1.4rem', 
            margin: '0 0 6px 0',
            color: '#ffffff',
            fontWeight: 700
          }}>
            {title}
          </h4>
          <span style={{ 
            fontSize: '0.75rem', 
            letterSpacing: '1.2px', 
            textTransform: 'uppercase', 
            color: 'var(--gold-thread, #c5a880)',
            fontWeight: 700,
            display: 'block'
          }}>
            Tap to read info
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SustainabilityCards() {
  const cardsData = [
    {
      title: "Solar Panel Energy",
      description: "Our 100 kW Solar Power Plant contributes approximately 22% of daily energy requirements, significantly reducing conventional energy consumption and lowering our carbon footprint. With an average daily consumption of 2,200 kWh, solar energy plays a vital role in our manufacturing operations.",
      imageUrl: "/images/sustainability-solar.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )
    },
    {
      title: "Air Jet Fibre Technology",
      description: "Our 14 Picanol OmniPlus 800 Air Jet Looms use compressed air instead of traditional shuttle mechanisms, resulting in lower energy consumption per metre of fabric, reduced noise pollution, and more efficient yarn utilization with minimal waste generation.",
      imageUrl: "/images/sustainability-airjet.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
          <path d="M12.59 19.41A2 2 0 1 0 14 16H2" />
          <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      )
    },
    {
      title: "Eco-Friendly Fibres",
      description: "We work with natural cotton fibres including compact, combed, and carded yarns. Our focus on cotton-based fabrics supports biodegradable end products. We continuously explore sustainable yarn options and responsible sourcing practices.",
      imageUrl: "/images/sustainability-cotton.png",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid-3 stagger-children">
      {cardsData.map((card, idx) => (
        <Card 
          key={idx}
          title={card.title}
          description={card.description}
          imageUrl={card.imageUrl}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
