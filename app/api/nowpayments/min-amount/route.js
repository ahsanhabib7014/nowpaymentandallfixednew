import { NextResponse } from 'next/server';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// ✅ Supported currencies
const CURRENCIES = ['usdttrc20', 'trx', 'bnbbsc', 'sol'];

export async function GET() {
  try {
    // ✅ সব currency-র minimum parallel fetch
    const results = await Promise.all(
      CURRENCIES.map(async (currency) => {
        try {
          const res = await fetch(
            `${NOWPAYMENTS_API_URL}/min-amount?currency_from=usd&currency_to=${currency}&fiat_equivalent=usd`,
            {
              headers: {
                'x-api-key': NOWPAYMENTS_API_KEY,
              },
              // ✅ 5 মিনিট cache
              next: { revalidate: 300 },
            }
          );

          if (!res.ok) {
            console.warn(`Min amount fetch failed for ${currency}:`, res.status);
            return { currency, min: null };
          }

          const data = await res.json();
          
          // ✅ fiat_equivalent = USD-তে minimum
          const minUsd = Math.ceil(Number(data.fiat_equivalent) || 0);
          
          return { currency, min: minUsd };
        } catch (err) {
          console.error(`Error for ${currency}:`, err);
          return { currency, min: null };
        }
      })
    );

    // ✅ Object আকারে রিটার্ন — page.js সহজে ব্যবহার করতে পারবে
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