import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Apple,
  Monitor,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionName?: string;
}

type DeviceTab = 'android' | 'ios' | 'desktop' | 'source';

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  companionName = 'Meera'
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  
  // Set default tab based on user's current device
  const [activeTab, setActiveTab] = useState<DeviceTab>(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'desktop';
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-[#cbe0d5] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#173e31] via-[#20493b] to-[#2c5f4d] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-xl shrink-0">
              <Download className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Download & Install AuraCalm
                </h2>
                <span className="text-[10px] font-bold bg-emerald-400/25 text-emerald-100 border border-emerald-300/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  No App Store Needed
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Install as a standalone app on your Phone, Tablet, or Computer.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Instant Install Action (If browser supports BeforeInstallPrompt) */}
        {isInstallable && !isInstalled && (
          <div className="p-4 bg-emerald-50/90 border-b border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Direct 1-Click Installation Available!
                </p>
                <p className="text-[11px] text-emerald-800">
                  Your browser supports direct installation to your home screen or desktop.
                </p>
              </div>
            </div>
            <button
              onClick={handleNativeInstall}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{installSuccess ? 'Installed!' : 'Install Now'}</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>AuraCalm is already installed</strong> and running in standalone app mode!
            </span>
          </div>
        )}

        {/* Device Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-3 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('android')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'android'
                ? 'bg-white text-emerald-900 border-t-2 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Android (Phone / Tablet)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ios'
                ? 'bg-white text-emerald-900 border-t-2 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iPhone & iPad (iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'desktop'
                ? 'bg-white text-emerald-900 border-t-2 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-700" />
            <span>Desktop (Mac / Windows / PC)</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'source'
                ? 'bg-white text-emerald-900 border-t-2 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-700" />
            <span>Codebase / Offline Run</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: ANDROID */}
          {activeTab === 'android' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  📱
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">
                    Install on Android in 3 Simple Steps
                  </h4>
                  <p className="text-emerald-800 text-xs">
                    Works on Google Chrome, Samsung Internet, Edge, and Brave browsers.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Open in Chrome or your Mobile Browser</h5>
                    <p className="text-slate-600 mt-0.5">
                      Ensure you are viewing this app URL in Google Chrome on your Android device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Tap the Menu Icon <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border text-slate-700">⋮</span>
                    </h5>
                    <p className="text-slate-600 mt-0.5">
                      Tap the three vertical dots <strong className="text-slate-800">(⋮)</strong> at the top right of the Chrome screen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Select "Install app" or "Add to Home screen"
                    </h5>
                    <p className="text-slate-600 mt-0.5">
                      Tap <strong className="text-emerald-900">Install app</strong> (or "Add to Home screen"). The AuraCalm icon will immediately appear on your phone alongside your other apps with zero browser address bars!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IOS (IPHONE / IPAD) */}
          {activeTab === 'ios' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  <Apple className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Add to iPhone or iPad Home Screen
                  </h4>
                  <p className="text-slate-600 text-xs">
                    Apple WebKit uses the Safari Share menu for full-screen web apps.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Open in Safari</h5>
                    <p className="text-slate-600 mt-0.5">
                      Make sure you open this link in the native <strong>Safari</strong> browser on your iPhone or iPad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Tap the Share Button <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">⎋ / Share</span>
                    </h5>
                    <p className="text-slate-600 mt-0.5">
                      Tap the <strong>Share</strong> button (the square icon with an arrow pointing upward) located in the bottom navigation bar of Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Tap "Add to Home Screen" <span className="font-semibold text-emerald-800">[+]</span>
                    </h5>
                    <p className="text-slate-600 mt-0.5">
                      Scroll down in the action list and select <strong>Add to Home Screen</strong>, then tap <strong>Add</strong> in the top right. AuraCalm is now installed with its custom icon!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESKTOP (MAC / WINDOWS / CHROMEBOOK) */}
          {activeTab === 'desktop' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-blue-950">
                    Install on Mac, Windows, or Chromebook
                  </h4>
                  <p className="text-blue-800 text-xs">
                    Runs in its own clean window, launches from your dock or taskbar, and works offline.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Look at the Browser Address Bar (URL)</h5>
                    <p className="text-slate-600 mt-0.5">
                      In Chrome, Edge, or Brave, look at the right end of the address bar (next to the bookmark star). You will see an <strong>Install icon</strong> (a small monitor with a down-arrow).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Or use Browser Menu (⋮)</h5>
                    <p className="text-slate-600 mt-0.5">
                      Click the three dots in Chrome/Edge &rarr; <strong>"Save and Share"</strong> &rarr; <strong>"Install AuraCalm..."</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Instant Desktop App</h5>
                    <p className="text-slate-600 mt-0.5">
                      Click <strong>Install</strong>. AuraCalm opens in an elegant window without browser tabs or toolbars, accessible anytime from your applications menu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CODEBASE / LOCAL OFFLINE RUN */}
          {activeTab === 'source' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-purple-950">
                    Run Locally or Build Native Android/iOS App
                  </h4>
                  <p className="text-purple-800 text-xs">
                    Full React + TypeScript + Vite + Express stack. Run on your own machine.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-slate-700 font-medium">
                  Run locally in your terminal in 2 commands:
                </p>

                <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] relative group overflow-x-auto">
                  <code>
                    # 1. Install dependencies<br />
                    npm install<br /><br />
                    # 2. Start full-stack local server<br />
                    npm run dev
                  </code>

                  <button
                    onClick={() => handleCopyCode('npm install\nnpm run dev')}
                    className="absolute right-2.5 top-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-sans flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-700" />
                    <span>Wrap into Native APK / IPA with Capacitor:</span>
                  </h5>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    You can package this web app as a native Google Play Store APK or Apple App Store IPA using Capacitor:
                    <span className="font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded mx-1">
                      npm i @capacitor/core @capacitor/cli && npx cap init
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Share / Open on Phone Quick Link Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">Want to open on your phone right now?</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-semibold px-1.5 py-0.2 rounded">
                  Quick Share
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Copy the direct app link and paste it into Chrome or Safari on your mobile device.
              </p>
            </div>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-700" />
                  <span>Copy App Link</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-slate-600 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Zero installation bloatware:</strong> AuraCalm runs 100% on-device with zero tracking, consumes less than 5 MB of storage, and stores your progress privately in your browser storage.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] text-slate-500">
            Guide: <strong className="text-slate-800">{companionName}</strong> • Works 100% offline once installed
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
