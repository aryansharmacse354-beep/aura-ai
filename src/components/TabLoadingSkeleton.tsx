import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { AQILogo } from './AQILogo';

interface TabLoadingSkeletonProps {
  title?: string;
}

export function TabLoadingSkeleton({ title = 'Atmospheric Module' }: TabLoadingSkeletonProps) {
  return (
    <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center p-6 space-y-5 animate-pulse bg-slate-900/30 rounded-2xl border border-slate-800/60">
      <div className="relative flex items-center justify-center">
        <AQILogo variant="icon-only" size="md" iconClassName="w-14 h-14 opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-cyan-400/50 animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <div className="flex items-center justify-center space-x-2 text-cyan-400 text-sm font-semibold">
          <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Mounting {title}...</span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Streaming spatial telemetry, physics weights & neural layers
        </p>
      </div>

      {/* Modern Skeletal Content Bars */}
      <div className="w-full max-w-md space-y-3 pt-2">
        <div className="h-3 bg-slate-800/80 rounded-full w-3/4 mx-auto" />
        <div className="h-2.5 bg-slate-800/50 rounded-full w-1/2 mx-auto" />
      </div>
    </div>
  );
}
