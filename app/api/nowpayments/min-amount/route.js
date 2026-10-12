import { NextResponse } from 'next/server';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// ✅ Supported currencies
const CURRENCIES = ['usdttrc20', 'trx', 'bnbbsc', 'sol'];

export async function GET() {
  try {
    const results = await Promise.all(
      CURRENCIES.map(async (currency) => {
        try {
          const url = `${NOWPAYMENTS_API_URL}/min-amount?currency_from=usd&currency_to=${currency}&fiat_equivalent=usd`;
          console.log(`\n========== [${currency}] ==========`);
          console.log(`Fetching: ${url}`);

          const res = await fetch(url, {
            headers: {
              'x-api-key': NOWPAYMENTS_API_KEY,
            },
            cache: 'no-store',
          });

          console.log(`Status: ${res.status}`);

          if (!res.ok) {
            const errorText = await res.text();
            console.warn(`Min amount fetch FAILED for ${currency}:`);
            console.warn(`Response: ${errorText}`);
            return { currency, min: null };
          }

          const data = await res.json();
          
          // ✅ Full response log
          console.log(`Full Response:`, JSON.stringify(data, null, 2));
          
          const minUsd = Math.ceil(Number(data.fiat_equivalent) || 0);
          console.log(`→ min USD: $${minUsd}`);
          
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

    console.log('\n========== FINAL MINIMUMS ==========');
    console.log(JSON.stringify(minimums, null, 2));
    console.log('=====================================\n');

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