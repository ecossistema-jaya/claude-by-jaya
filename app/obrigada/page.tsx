import type { Metadata } from 'next';
import Link from 'next/link';

/* Página pública para onde a Hotmart manda o comprador depois do pagamento.
   Não tem sessão nem consulta ao banco: o acesso é liberado pelo webhook
   (supabase/functions/hotmart-webhook) e confirmado quando a pessoa entra. */

export const metadata: Metadata = {
  title: 'Compra confirmada · Claude do Zero',
  robots: { index: false, follow: false },
};

const SUPORTE =
  'https://wa.me/5561992634557?text=Oi%20Jaya%2C%20comprei%20o%20Claude%20do%20Zero%20e%20n%C3%A3o%20consegui%20entrar.';

export default function Obrigada() {
  return (
    <main className="login">
      <span className="claude-float f1" aria-hidden="true" />
      <span className="claude-float f2" aria-hidden="true" />
      <span className="claude-float f3" aria-hidden="true" />
      <div className="caixa">
        <div className="eyebrow">Série Claude do Zero</div>
        <h1>Sua entrada está sendo liberada</h1>
        <p>
          Entre com o e-mail que você usou na compra, pelo Google ou por um código que chega nesse
          e-mail. Se não abrir na hora, espere um minuto e tente de novo.
        </p>

        <Link className="botao" href="/login">
          Entrar na área do aluno
        </Link>

        <p>
          Não conseguiu entrar? <a href={SUPORTE}>Me chame no WhatsApp</a>.
        </p>
      </div>
    </main>
  );
}
