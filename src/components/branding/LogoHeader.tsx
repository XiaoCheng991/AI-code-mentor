"use client";
import React from 'react';

export const LogoHeader: React.FC<{ alt?: string; className?: string }>=({ alt = 'NebulaHub'}) => {
  return (
    <div className={"logo-header"} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src="../../../public/logo_icon.svg" alt={alt} style={{ width: 40, height: 40, objectFit: 'contain' }} />
    </div>
  );
};

export default LogoHeader;
