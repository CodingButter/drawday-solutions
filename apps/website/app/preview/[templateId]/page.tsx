/**
 * Template Preview Page
 * Displays template as component with persistent DrawDay navigation
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@raffle-spinner/ui';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import template components
const LuxuryTemplate = dynamic(() => import('@raffle-spinner/template-luxury'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">Loading template...</div>
  ),
  ssr: false,
});

const ClassicTemplate = dynamic(() => import('@raffle-spinner/template-classic'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">Loading template...</div>
  ),
  ssr: false,
});

const UKCompleteTemplate = dynamic(() => import('@raffle-spinner/template-uk-complete'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">Loading template...</div>
  ),
  ssr: false,
});

const templates: {
  [key: string]: {
    name: string;
    component: typeof LuxuryTemplate | typeof ClassicTemplate | typeof UKCompleteTemplate;
  };
} = {
  'uk-complete': {
    name: 'UK Professional',
    component: UKCompleteTemplate,
  },
  'modern-luxury': {
    name: 'Modern Luxury',
    component: LuxuryTemplate,
  },
  'classic-draw': {
    name: 'Classic Draw',
    component: ClassicTemplate,
  },
  'vibrant-energy': {
    name: 'Vibrant Energy',
    component: UKCompleteTemplate,
  },
  'minimal-elegance': {
    name: 'Minimal Elegance',
    component: UKCompleteTemplate,
  },
  'sports-fanatic': {
    name: 'Sports Fanatic',
    component: UKCompleteTemplate,
  },
  'tech-forward': {
    name: 'Tech Forward',
    component: UKCompleteTemplate,
  },
};

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const template = templates[templateId];

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
          <Button asChild>
            <Link href="/templates">Back to Templates</Link>
          </Button>
        </div>
      </div>
    );
  }

  const TemplateComponent = template.component;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Preview Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0 sticky top-0 z-50">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="h-6 w-px bg-gray-700" />

          <div>
            <div className="text-sm text-gray-400">Previewing:</div>
            <div className="text-white font-semibold">{template.name}</div>
          </div>
        </div>

        {/* Center Section - View Mode */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
              viewMode === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
              viewMode === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-sm">Mobile</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-drawday-gold text-drawday-navy hover:bg-amber" asChild>
            <Link href="/contact">Get This Template</Link>
          </Button>
        </div>
      </div>

      {/* Template Container */}
      <div className="flex-1 flex items-start justify-center bg-gray-100 overflow-auto">
        <div
          className={`transition-all duration-300 bg-white text-gray-900 ${
            viewMode === 'mobile' ? 'w-[375px]' : 'w-full'
          }`}
          style={{
            minHeight: viewMode === 'mobile' ? '812px' : 'auto',
            isolation: 'isolate',
          }}
        >
          <TemplateComponent />
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-sm flex-shrink-0">
        <div className="text-gray-400">
          This is a live template component. All functionality is for demonstration.
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Viewport: </span>
          <span className="text-white font-mono">
            {viewMode === 'mobile' ? '375px mobile' : 'Responsive desktop'}
          </span>
        </div>
      </div>
    </div>
  );
}
