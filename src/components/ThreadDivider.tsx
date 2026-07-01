import React from 'react';

export default function ThreadDivider() {
  return (
    <div className="thread-divider">
      <svg viewBox="0 0 1200 30" preserveAspectRatio="none">
        <path
          className="thread-path"
          d="M0,15 C50,5 100,25 150,15 C200,5 250,25 300,15 C350,5 400,25 450,15 C500,5 550,25 600,15 C650,5 700,25 750,15 C800,5 850,25 900,15 C950,5 1000,25 1050,15 C1100,5 1150,25 1200,15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
