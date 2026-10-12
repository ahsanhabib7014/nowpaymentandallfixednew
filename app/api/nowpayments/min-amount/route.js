// import { NextResponse } from 'next/server';

// const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
// const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// // ✅ Supported currencies
// const CURRENCIES = ['usdttrc20', 'trx', 'bnbbsc', 'sol'];

// export async function GET() {
//   try {
//     const results = await Promise.all(
//       CURRENCIES.map(async (currency) => {
//         try {
//           // ✅ সঠিক parameter order: currency_from = crypto, currency_to = usd
//           const url = `${NOWPAYMENTS_API_URL}/min-amount?currency_from=${currency}&currency_to=usd&fiat_equivalent=usd`;
          
//           console.log(`[${currency}] Fetching: ${url}`);

//           const res = await fetch(url, {
//             headers: {
//               'x-api-key': NOWPAYMENTS_API_KEY,
//             },
//             cache: 'no-store',
//           });

//           if (!res.ok) {
//             console.warn(`Min amount fetch failed for ${currency}:`, res.status);
//             return { currency, min: null };
//           }

//           const data = await res.json();
//           console.log(`[${currency}] Response:`, JSON.stringify(data));
          
//           // ✅ min_amount হলো crypto-তে minimum, fiat_equivalent হলো USD-তে minimum
//           const minUsd = Math.ceil(Number(data.fiat_equivalent) || 0);
          
//           return { currency, min: minUsd };
//         } catch (err) {
//           console.error(`Error for ${currency}:`, err);
//           return { currency, min: null };
//         }
//       })
//     );

//     const minimums = {};
//     results.forEach(({ currency, min }) => {
//       minimums[currency] = min;
//     });

//     console.log('✅ Final minimums:', minimums);

//     return NextResponse.json({
//       success: true,
//       minimums,
//     });
//   } catch (err) {
//     console.error('Min amount API error:', err);
//     return NextResponse.json(
//       { success: false, minimums: {} },
//       { status: 500 }
//     );
//   }
// }

// /////////////////////////////////////////////////////


import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import { verifyAuth } from '@/utils/authCheck';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// ✅ Supported currencies
const CURRENCIES = ['usdttrc20', 'trx', 'bnbbsc', 'sol'];

export async function GET() {
  try {
    // ✅ ১. Auth check
    await dbConnect();
    const auth = await verifyAuth('user');
    if (!auth.success) {
      return NextResponse.json(
        { success: false, minimums: {}, message: auth.message },
        { status: auth.status }
      );
    }

    // ✅ ২. Fetch minimums
    const results = await Promise.all(
      CURRENCIES.map(async (currency) => {
        try {
          const url = `${NOWPAYMENTS_API_URL}/min-amount?currency_from=${currency}&currency_to=usd&fiat_equivalent=usd`;

          const res = await fetch(url, {
            headers: {
              'x-api-key': NOWPAYMENTS_API_KEY,
            },
            cache: 'no-store',
          });

          if (!res.ok) {
            console.warn(`Min amount fetch failed for ${currency}:`, res.status);
            return { currency, min: null };
          }

          const data = await res.json();
          const minUsd = Math.ceil(Number(data.fiat_equivalent) || 0);
          return { currency, min: minUsd };
        } catch (err) {
          console.error(`Error for ${currency}:`, err);
          return { currency, min: null };
        }
      })
    );

    const minimums = {};
    results.forEach(({ currency, min }) => {
      minimums[currency] = min;
    });

    return NextResponse.json({
      success: true,
      minimums,
    });

  } catch (err) {
    console.error('Min amount API error:', err);
    return NextResponse.json(
      { success: false, minimums: {} },
      { status: 500 }
    );
  }
}