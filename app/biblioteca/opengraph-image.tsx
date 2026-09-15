import { ImageResponse } from 'next/og';

export const alt = 'Claude by Jaya — Biblioteca de Inteligência Aplicada';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const rays = Array.from({ length: 96 }, (_, index) => {
    const angle = (index / 96) * Math.PI * 2;
    return {
      x1: 190 + Math.cos(angle) * 85,
      y1: 190 + Math.sin(angle) * 85,
      x2: 190 + Math.cos(angle) * 171,
      y2: 190 + Math.sin(angle) * 171,
    };
  });

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#17190F', color: '#F7F3E8', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 64px', padding: '37px 0 28px', borderBottom: '1px solid #3C3D30' }}>
        <span style={{ fontSize: 29, letterSpacing: -1 }}>Claude by Jaya</span>
        <span style={{ fontSize: 15, color: '#BDBDAF', letterSpacing: 2 }}>BIBLIOTECA / CONHECIMENTO ABERTO</span>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative', padding: '44px 64px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 750 }}>
          <span style={{ fontSize: 15, color: '#BDBDAF', letterSpacing: 2, marginBottom: 24 }}>A SUA EXPERIÊNCIA É O PONTO DE PARTIDA.</span>
          <span style={{ fontSize: 91, lineHeight: 1.03, letterSpacing: -5 }}>O que você</span>
          <span style={{ fontSize: 91, lineHeight: 1.03, letterSpacing: -5, color: '#FFB12B' }}>sabe, ampliado.</span>
          <span style={{ fontSize: 22, color: '#BDBDAF', marginTop: 28 }}>Aprenda a pensar, criar e trabalhar com Claude.</span>
        </div>

        <div style={{ position: 'absolute', right: 40, top: 24, width: 380, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="380" height="380" viewBox="0 0 380 380" style={{ position: 'absolute', top: 0, left: 0 }}>
            <circle cx="190" cy="190" r="181" fill="none" stroke="#3C3D30" />
            {rays.map((ray, index) => <line key={index} {...ray} stroke="#FFB12B" strokeWidth="1.3" opacity="0.65" />)}
            {[104, 128, 152].map((radius) => <circle key={radius} cx="190" cy="190" r={radius} fill="none" stroke="#17190F" strokeWidth="5" />)}
            <circle cx="190" cy="190" r="76" fill="none" stroke="#795B22" />
            <path d="M12 42V12h30M338 12h30v30M368 338v30h-30M42 368H12v-30" fill="none" stroke="#737567" />
            <rect x="48" y="54" width="12" height="12" fill="#FFB12B" />
            <rect x="60" y="42" width="12" height="12" fill="#FFB12B" />
            <rect x="72" y="30" width="12" height="12" fill="#FFB12B" />
            <rect x="308" y="297" width="17" height="17" fill="#FC6C35" />
            <rect x="325" y="314" width="17" height="17" fill="#FFB12B" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, background: '#FFB12B', color: '#17190F', transform: 'rotate(-12deg)', border: '1px solid #FFD179' }}>
            <span style={{ fontSize: 80, lineHeight: 1, fontStyle: 'italic' }}>j</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '33px 64px', background: '#F6F2E8', color: '#202117' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span style={{ fontSize: 21 }}>9 ambientes. Guias, exercícios e prática.</span>
          <span style={{ fontSize: 15, color: '#646455' }}>No seu ritmo. A partir do que você já sabe.</span>
        </div>
        <span style={{ fontSize: 20 }}>jayaroberta.com/biblioteca</span>
      </div>
    </div>,
    size,
  );
}
