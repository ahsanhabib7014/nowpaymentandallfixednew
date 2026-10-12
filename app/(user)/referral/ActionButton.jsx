'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ActionButton({
  onClick,
  children,
  loadingText = 'প্রসেসিং হচ্ছে...',
  successCard = null,
  successFloating = false,
  className = '',
  disabled = false,
  type = 'button',
  icon = null,
}) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customMessage, setCustomMessage] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = async (e) => {
    if (loading || showSuccess || disabled) return;

    setLoading(true);
    try {
      const result = await onClick?.(e);

      // ✅ result যদি object হয় { success, message }
      if (result && typeof result === 'object') {
        if (result.success && successCard) {
          setCustomMessage(result.message || successCard.text);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setCustomMessage(null);
          }, 2500);
        }
        return;
      }

      // ✅ result যদি true/false হয়
      if (successCard && result !== false) {
        setCustomMessage(successCard.text);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCustomMessage(null);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ✅ FLOATING SUCCESS CARD — Portal দিয়ে স্ক্রিনের মাঝখানে
  // ============================================================
  if (showSuccess && successCard && successFloating) {
    return (
      <>
        <button
          type={type}
          disabled={true}
          className={`flex items-center justify-center gap-2 font-bold transition shadow-md opacity-50 cursor-not-allowed ${className}`}
        >
          {icon}
          {children}
        </button>

        {mounted && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none px-4">
            <div className="flex flex-col items-center gap-3 border-2 border-emerald-500 rounded-2xl bg-slate-900/95 backdrop-blur-md px-6 py-5 shadow-2xl shadow-emerald-500/40 w-full max-w-[320px]">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/50">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-emerald-400 font-bold text-sm text-center leading-snug">
                {customMessage || successCard.text}
              </p>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  // ============================================================
  // ✅ INLINE SUCCESS CARD
  // ============================================================
  if (showSuccess && successCard) {
    return (
      <div className="flex items-center justify-center w-full py-1">
        <div className="w-full border-2 border-emerald-500 rounded-2xl bg-slate-900/80 backdrop-blur-sm p-5 flex flex-col items-center justify-center gap-3 shadow-lg shadow-emerald-500/20">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/50">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-emerald-400 font-bold text-sm text-center">
            {customMessage || successCard.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={loading || disabled}
      className={`flex items-center justify-center gap-2 font-bold transition shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}