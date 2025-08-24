import React from 'react';

export default function LiveSpinnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No nav or footer for live-spinner pages - they will be iframed
  return <>{children}</>;
}