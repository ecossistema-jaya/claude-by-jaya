import { guides, type LibraryGuide } from './content';

const baseUrl = 'https://jayaroberta.com';

export function toMarkdown(guide: LibraryGuide) {
  const sections = guide.sections.map((section) => [
    `## ${section.title}`,
    ...section.paragraphs,
    ...(section.steps?.map((step, index) => `${index + 1}. ${step}`) ?? []),
    ...(section.prompt ? ['### Para experimentar', '```text\n' + section.prompt + '\n```'] : []),
    ...(section.note ? [`> ${section.note}`] : []),
  ].join('\n\n'));
  return [
    `# ${guide.title}`,
    guide.description,
    `Biblioteca Claude by Jaya · ${guide.kind} · ${guide.level}`,
    `Revisado em: ${guide.reviewedAt}`,
    `Disponível em: ${baseUrl}/biblioteca/${guide.slug}`,
    '## O que você vai produzir',
    guide.outcome,
    '## Antes de começar',
    guide.prerequisite,
    ...sections,
    '## Confira sua entrega',
    guide.checklist.map((item) => `- [ ] ${item}`).join('\n'),
    '## Fontes para consultar',
    guide.sources.map(({ title, url }) => `- [${title}](${url})`).join('\n'),
    ...(guide.nextSlug && guides.some((item) => item.slug === guide.nextSlug)
      ? [`Próxima leitura: ${baseUrl}/biblioteca/${guide.nextSlug}`] : []),
    '\n',
  ].join('\n\n');
}
