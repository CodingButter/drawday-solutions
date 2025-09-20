import { NavigationServer } from '@/components/navigation-server';
import { FooterServer } from '@/components/footer-server';
import { LayoutContentClient } from './layout-content-client';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <LayoutContentClient navigation={<NavigationServer />} footer={<FooterServer />}>
      {children}
    </LayoutContentClient>
  );
}
