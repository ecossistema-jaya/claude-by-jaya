import { ImageResponse } from 'next/og';

export const alt = 'Claude by Jaya — Biblioteca de Inteligência Aplicada';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px', background: '#F9F4F0', color: '#2B2521', fontFamily: 'sans-serif' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28 }}><span>Claude by Jaya</span><span style={{ fontSize: 18, color: '#8E0D13' }}>BIBLIOTECA GRATUITA</span></div>
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 100, lineHeight: 1, letterSpacing: -5 }}><span>Inteligência</span><span style={{ color: '#B64920' }}>se constrói.</span></div>
    <div style={{ display: 'flex', borderTop: '1px solid #D9C9BC', paddingTop: 25, justifyContent: 'space-between', fontSize: 21 }}><span>9 ambientes. Guias, exercícios e prática.</span><span>jayaroberta.com/biblioteca</span></div>
  </div>, size);
}
