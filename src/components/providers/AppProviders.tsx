'use client';

import React, { ReactNode } from 'react';
import { QmsProvider } from '@/context/QmsContext';
import DemoControlBar from '@/components/navigation/DemoControlBar';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QmsProvider>
      <DemoControlBar />
      {children}
    </QmsProvider>
  );
}
