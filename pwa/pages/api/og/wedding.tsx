import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const locales = {
  fr: {
    invited: 'VOUS ÊTES INVITÉS AU MARIAGE DE',
    brand: 'FARAH.MA',
  },
  ar: {
    invited: 'أنتم مدعوون لحفل زفاف',
    brand: 'FARAH.MA',
  },
  ary: {
    invited: 'معروضين لعرس',
    brand: 'FARAH.MA',
  },
  en: {
    invited: "YOU'RE INVITED TO THE WEDDING OF",
    brand: 'FARAH.MA',
  },
} as const;

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const bride = searchParams.get('bride') || 'Sarah';
    const groom = searchParams.get('groom') || 'Yassine';
    const image = searchParams.get('image');
    const locale = (searchParams.get('locale') || 'fr') as keyof typeof locales;
    const t = locales[locale] || locales.fr;

    const date = searchParams.get('date') || '';
    const city = searchParams.get('city') || '';

    // Premium background fallback
    const backgroundImage = image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=630&fit=crop';

    // Load DM Serif Display for that signature feeling
    // (In production, this should be a local asset or a highly reliable URL)
    const fontData = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/dmserifdisplay/DMSerifDisplay-Regular.ttf', req.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1A1A1A',
            position: 'relative',
            fontFamily: 'DM Serif Display, serif',
          }}
        >
          {/* Background Image with slight blur on edges */}
          <img
            src={backgroundImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.9,
            }}
            alt="Wedding"
          />

          {/* Immersive Dual Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)',
              display: 'flex',
            }}
          />
          <div
             style={{
               position: 'absolute',
               inset: 0,
               background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
               display: 'flex',
             }}
          />

          {/* Floating Glassmorphic Invitation Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 80px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '60px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Top Branding/Charm */}
            <div
                style={{
                    display: 'flex',
                    marginBottom: '30px',
                }}
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E8472A" />
                </svg>
            </div>

            {/* Invitational Label */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'white',
                opacity: 0.8,
                letterSpacing: '0.6em',
                marginBottom: '40px',
                textAlign: 'center',
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
              }}
            >
              {t.invited}
            </div>

            {/* Couple Names */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '40px',
              }}
            >
              <div style={{ fontSize: 96, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>{bride}</div>
              <div style={{ fontSize: 32, fontStyle: 'italic', color: '#E8472A', opacity: 0.9 }}>&</div>
              <div style={{ fontSize: 96, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>{groom}</div>
            </div>

            {/* Event Info Bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                <div style={{ padding: '8px 20px', borderRadius: '100px', backgroundColor: 'rgba(232, 71, 42, 0.15)', border: '1px solid rgba(232, 71, 42, 0.3)', color: '#F47C65', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {city}
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <div style={{ color: 'white', fontSize: 18, fontWeight: 500, opacity: 0.9, letterSpacing: '0.05em' }}>
                    {date}
                </div>
            </div>
          </div>

          {/* Signature Branding (Bottom) */}
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ color: 'white', opacity: 0.5, fontSize: 13, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              {t.brand}
            </div>
            <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'DM Serif Display',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
