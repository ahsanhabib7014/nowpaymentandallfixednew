export const revalidate = 60;

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=tron,solana,binancecoin&vs_currencies=usd',
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return Response.json({
      success: true,
      prices: {
        TRX: data.tron?.usd || 0.15,
        SOL: data.solana?.usd || 150,
        BNB: data.binancecoin?.usd || 600,
      },
    });
  } catch {
    return Response.json({
      success: false,
      prices: { TRX: 0.15, SOL: 150, BNB: 600 },
    });
  }
}