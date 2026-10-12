// 'use client';

// export default function TabSwitcher({
//   value,               // true = Auto Crypto, false = Manual
//   onChange,            // (newValue) => void
//   manualLabel = 'Manual Deposit',
//   autoLabel = 'Auto Crypto',
//   manualIcon = 'fa-solid fa-hand-holding-dollar',
//   autoIcon = 'fa-solid fa-bolt',
// }) {
//   const tabs = [
//     { value: false, label: manualLabel, icon: manualIcon, color: 'emerald' },
//     { value: true,  label: autoLabel,   icon: autoIcon,   color: 'blue' },
//   ];

//   return (
//     <div className="relative grid grid-cols-2 gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
      
//       {/* ✅ Sliding background indicator */}
//       <div
//         className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg transition-all duration-300 ease-out shadow-md ${
//           value
//             ? 'left-[calc(50%+1.5px)] bg-blue-600'
//             : 'left-1.5 bg-emerald-600'
//         }`}
//       />

//       {tabs.map((tab) => {
//         const isActive = tab.value === value;

//         return (
//           <button
//             key={String(tab.value)}
//             type="button"
//             onClick={() => onChange(tab.value)}
//             className={`relative z-10 py-2.5 px-2 rounded-lg text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
//               isActive
//                 ? 'text-white'
//                 : 'text-slate-400 hover:text-white'
//             }`}
//           >
//             <i className={`${tab.icon} text-[11px] md:text-xs`}></i>
//             <span>{tab.label}</span>
//           </button>
//         );
//       })}

//     </div>
//   );
// }

// //////////////////////////////////////////////////////

'use client';

export default function TabSwitcher({
  value,               // true = Auto Crypto, false = Manual
  onChange,            // (newValue) => void
  manualLabel = 'Manual Deposit',
  autoLabel = 'Auto Crypto',
  manualIcon = 'fa-solid fa-hand-holding-dollar',
  autoIcon = 'fa-solid fa-bolt',
  rate = null,         // ✅ Parent থেকে dynamic rate
}) {
  const tabs = [
    { 
      value: false, 
      label: manualLabel, 
      icon: manualIcon, 
      color: 'emerald' 
    },
    { 
      value: true,  
      label: rate ? `${autoLabel} (৳${rate})` : autoLabel, 
      icon: autoIcon,   
      color: 'blue' 
    },
  ];

  return (
    <div className="relative grid grid-cols-2 gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
      
      {/* ✅ Sliding background indicator */}
      <div
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg transition-all duration-300 ease-out shadow-md ${
          value
            ? 'left-[calc(50%+1.5px)] bg-blue-600'
            : 'left-1.5 bg-emerald-600'
        }`}
      />

      {tabs.map((tab) => {
        const isActive = tab.value === value;

        return (
          <button
            key={String(tab.value)}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`relative z-10 py-2.5 px-2 rounded-lg text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className={`${tab.icon} text-[11px] md:text-xs`}></i>
            <span>{tab.label}</span>
          </button>
        );
      })}

    </div>
  );
}