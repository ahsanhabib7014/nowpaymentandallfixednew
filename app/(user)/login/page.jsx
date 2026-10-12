// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function LoginPage() {
//   const [uid, setUid] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [toastMessage, setToastMessage] = useState(null);
//   const router = useRouter();

//   // পেজ লোড হওয়ার সময় ব্লক মেসেজ চেক করা[cite: 10]
//   useEffect(() => {
//     const blockedMsg = sessionStorage.getItem('loginToastMessage');
//     if (blockedMsg) {
//       setToastMessage(blockedMsg);
//       const timer = setTimeout(() => {
//         setToastMessage(null);
//         sessionStorage.removeItem('loginToastMessage');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   // শুধুমাত্র সংখ্যা গ্রহণ এবং ১১ ডিজিট নিশ্চিত করা[cite: 10]
//   const handleUidChange = (e) => {
//     const val = e.target.value.replace(/\D/g, '');
//     if (val.length <= 11) {
//       setUid(val);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (uid.length !== 11) {
//       setMessage('ইউজার আইডি অবশ্যই ১১ ডিজিটের হতে হবে!');
//       return;
//     }

//     try {
//       // লগইন করার আগে ইউজার ব্লক কি না চেক করা[cite: 10]
//       const checkRes = await fetch(`/api/user/check-status?uid=${uid}`, {
//         credentials: 'include'
//       });
//       const checkData = await checkRes.json();

//       if (checkData.success && checkData.isBlocked) {
//         setToastMessage('আপনার অ্যাকাউন্ট ব্লক হয়ে গেছে, আপনি অ্যাডমিনের সঙ্গে যোগাযোগ করুন।');
//         return;
//       }

//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // অতি জরুরি: কুকি সেট করার জন্য
//         body: JSON.stringify({ uid, password }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         if (data.user && data.user.isBlocked) {
//           setToastMessage('আপনার অ্যাকাউন্ট ব্লক হয়ে গেছে, আপনি অ্যাডমিনের সঙ্গে যোগাযোগ করুন।');
//           return;
//         }

//         // টোকেন লোকালস্টোরেজ থেকে বাদ দেওয়া হয়েছে, কারণ এটি এখন HttpOnly কুকিতে সংরক্ষিত
//         if (data.user) {
//           localStorage.setItem('user', JSON.stringify(data.user));
//         }
        
//         setMessage('লগইন সফল হয়েছে! রিডাইরেক্ট হচ্ছে...');

//         if (data.user.role === 'admin') {
//           router.push('/admin');
//         } else {
//           window.location.replace('/game');
//         }
//       } else {
//         setMessage(data.message || 'লগইন ব্যর্থ হয়েছে');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setMessage('সার্ভার এরর!');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 relative">
      
//       {/* টোস্ট মেসেজ পপআপ */}
//       {toastMessage && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
//           <div className="bg-rose-600 border border-rose-400 text-white p-5 rounded-2xl shadow-2xl text-center space-y-2 max-w-xs w-full animate-bounce">
//             <h4 className="font-bold text-sm">⚠ অ্যাকাউন্ট ব্লকড!</h4>
//             <p className="text-xs text-rose-100">{toastMessage}</p>
//             <button 
//               onClick={() => setToastMessage(null)} 
//               className="mt-2 bg-white text-rose-600 text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-rose-50 transition"
//             >
//               ঠিক আছে
//             </button>
//           </div>
//         </div>
//       )}

//       <h2 className="text-xl font-bold text-emerald-400 text-center">লগইন করুন</h2>
      
//       <form onSubmit={handleLogin} className="space-y-4">
//         <div>
//           <label className="text-xs text-slate-400 block mb-1">ইউজার আইডি (UID)</label>
//           <input
//             type="text"
//             value={uid}
//             onChange={handleUidChange} 
//             maxLength={11} 
//             placeholder="আপনার আইডি লিখুন"
//             className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm outline-none focus:border-emerald-500"
//             required
//           />
//         </div>

//         <div>
//           <div className="flex justify-between items-center mb-1">
//             <label className="text-xs text-slate-400">পাসওয়ার্ড</label>
//             <Link href="/reset-password" className="text-xs text-emerald-400 hover:underline">
//               পাসওয়ার্ড ভুলে গেছেন?
//             </Link>
//           </div>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="পাসওয়ার্ড দিন"
//             className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm outline-none focus:border-emerald-500"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl transition text-sm shadow-lg shadow-emerald-900/20"
//         >
//           লগইন
//         </button>
//       </form>

//       {message && <p className="text-center text-sm text-amber-300">{message}</p>}

//       <div className="text-center pt-2 border-t border-slate-800">
//         <p className="text-xs text-slate-400">
//           অ্যাকাউন্ট নেই?{' '}
//           <Link href="/register" className="text-emerald-400 font-bold hover:underline">
//             রেজিস্ট্রেশন করুন
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


// //////////////////////////////////////////////////

'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ [FIX]: double-submit সম্পূর্ণ ব্লক করার জন্য ref
  const isSubmittingRef = useRef(false);

  const router = useRouter();

  // পেজ লোড হওয়ার সময় ব্লক মেসেজ চেক করা
  useEffect(() => {
    const blockedMsg = sessionStorage.getItem('loginToastMessage');
    if (blockedMsg) {
      setToastMessage(blockedMsg);
      const timer = setTimeout(() => {
        setToastMessage(null);
        sessionStorage.removeItem('loginToastMessage');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // শুধুমাত্র সংখ্যা গ্রহণ এবং ১১ ডিজিট নিশ্চিত করা
  const handleUidChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 11) {
      setUid(val);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ [FIX 1]: আগেই সাবমিট হয়ে থাকলে সাথে সাথে রিটার্ন
    if (isSubmittingRef.current) return;

    setMessage('');

    if (uid.length !== 11) {
      setMessage('ইউজার আইডি অবশ্যই ১১ ডিজিটের হতে হবে!');
      return;
    }

    // ✅ [FIX 2]: লক সেট করুন fetch শুরু হওয়ার আগেই
    isSubmittingRef.current = true;
    setLoading(true);

    try {
      // লগইন করার আগে ইউজার ব্লক কি না চেক করা
      const checkRes = await fetch(`/api/user/check-status?uid=${uid}`, {
        credentials: 'include',
      });
      const checkData = await checkRes.json();

      if (checkData.success && checkData.isBlocked) {
        setToastMessage(
          'আপনার অ্যাকাউন্ট ব্লক হয়ে গেছে, আপনি অ্যাডমিনের সঙ্গে যোগাযোগ করুন।'
        );
        // ✅ [FIX 3]: ব্লক হলে লক খুলে দিন
        isSubmittingRef.current = false;
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ uid, password }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.user && data.user.isBlocked) {
          setToastMessage(
            'আপনার অ্যাকাউন্ট ব্লক হয়ে গেছে, আপনি অ্যাডমিনের সঙ্গে যোগাযোগ করুন।'
          );
          isSubmittingRef.current = false;
          setLoading(false);
          return;
        }

        // টোকেন localStorage এ রাখা হয় না, HttpOnly কুকিতে সংরক্ষিত
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setMessage('লগইন সফল হয়েছে! রিডাইরেক্ট হচ্ছে...');

        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          window.location.replace('/game');
        }

        // ⚠️ সফল হলে ref লক আটকে থাকে যাতে redirect পর্যন্ত আর ক্লিক না হয়
        return;
      } else {
        setMessage(data.message || 'লগইন ব্যর্থ হয়েছে');
        // ✅ [FIX 4]: লগইন ব্যর্থ হলে আবার ট্রাই করার সুযোগ
        isSubmittingRef.current = false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('সার্ভার এরর!');
      // ✅ [FIX 5]: এরর হলে লক খুলে দিন
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 relative">
      {/* টোস্ট মেসেজ পপআপ */}
      {toastMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-rose-600 border border-rose-400 text-white p-5 rounded-2xl shadow-2xl text-center space-y-2 max-w-xs w-full animate-bounce">
            <h4 className="font-bold text-sm">⚠ অ্যাকাউন্ট ব্লকড!</h4>
            <p className="text-xs text-rose-100">{toastMessage}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="mt-2 bg-white text-rose-600 text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-rose-50 transition"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-emerald-400 text-center">
        লগইন করুন
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">
            ইউজার আইডি (UID)
          </label>
          <input
            type="text"
            value={uid}
            onChange={handleUidChange}
            maxLength={11}
            placeholder="আপনার আইডি লিখুন"
            disabled={loading}
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-slate-400">পাসওয়ার্ড</label>
            <Link
              href="/reset-password"
              className="text-xs text-emerald-400 hover:underline"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড দিন"
            disabled={loading}
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl transition text-sm shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'লগইন হচ্ছে...' : 'লগইন'}
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-amber-300">{message}</p>
      )}

      <div className="text-center pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          অ্যাকাউন্ট নেই?{' '}
          <Link
            href="/register"
            className="text-emerald-400 font-bold hover:underline"
          >
            রেজিস্ট্রেশন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}