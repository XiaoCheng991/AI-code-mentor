"use client";
import React from 'react';

type LogoHeaderProps = {
  // Destination when clicking the logo
  href?: string;
  // Optional additional CSS classes for the outer container
  className?: string;
  // Optional override for the logo source path
  logoPath?: string;
  // Logo image height in pixels
  size?: number;
  // Accessible alt text
  alt?: string;
};

/**
 * LogoHeader
 * A small, reusable component that renders a logo in the top-left corner.
 * The logo asset is expected to reside under the public folder.
 * It supports a fallback path to support environments where the asset is served as /public/logo_icon.svg.
 */
const LogoHeader: React.FC<LogoHeaderProps> = ({
  href = '/',
  className = '',
  logoPath = '/logo_icon.svg',
  size = 60,
  alt = 'Logo',
}) => {
  // Local state to handle potential fallback path if the first one fails to load
  const [src, setSrc] = React.useState<string>(logoPath);
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // If the initial path isn't the public path, try the explicit /public path
    // This ensures compatibility with setups that host assets under /public in the URL space.
    if (src !== '/public/logo_icon.svg') {
      img.src = '/public/logo_icon.svg';
      setSrc('/public/logo_icon.svg');
    }
  };

  return (
    <div
      className={`logo-header fixed top-0 left-0 z-50 ${className}`.trim()}
      style={{
        // a light touch of padding so the logo isn't glued to the edges
        padding: 8,
        // allow the logo to keep room if content flows under it
        pointerEvents: 'auto',
      }}
    >
      <a href={href} aria-label="Logo" style={{ display: 'inline-block' }}>
        <img
          src={src}
          alt={alt}
          onError={handleError}
          style={{ height: size, width: 'auto', display: 'block' }}
        />
      </a>
    </div>
  );
};

export default LogoHeader;
