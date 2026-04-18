import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const locales = {
  fr: {
    invited: 'VOUS ÊTES INVITÉS AU MARIAGE DE',
    brand: 'Farah.ma',
  },
  ar: {
    invited: 'أنتم مدعوون لحفل زفاف',
    brand: 'Farah.ma',
  },
  ary: {
    invited: 'معروضين لعرس',
    brand: 'Farah.ma',
  },
  en: {
    invited: "YOU'RE INVITED TO THE WEDDING OF",
    brand: 'Farah.ma',
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

    // Use a high-quality fallback if no image is provided
    const backgroundImage = image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=630&fit=crop';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: '#1A1A1A',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          <img
            src={backgroundImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            alt="Wedding"
          />

          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
              display: 'flex',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '80px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Invitational Text */}
            <div
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: '#E8472A', // Primary Terracotta
                letterSpacing: '0.4em',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {t.invited}
            </div>

            {/* Couple Names */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontFamily: 'serif',
                  fontWeight: 900,
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                {bride}
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  color: '#E8472A',
                  paddingTop: '10px',
                }}
              >
                &
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontFamily: 'serif',
                  fontWeight: 900,
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                {groom}
              </div>
            </div>

            {/* Brand Logo */}
            <div
              style={{
                position: 'absolute',
                top: '-350px',
                right: '-450px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{t.brand}</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
