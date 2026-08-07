'use client';

/* Remover apaga a linha e o histórico de acesso perde o vínculo. Desativar
   resolve quase sempre, então este botão pergunta antes. */
export default function BotaoRemover({ email }: { email: string }) {
  return (
    <button
      type="submit"
      className="perigo"
      onClick={(e) => {
        if (!confirm(`Remover ${email} da lista? Desativar já bloqueia o acesso.`)) {
          e.preventDefault();
        }
      }}
    >
      remover
    </button>
  );
}
