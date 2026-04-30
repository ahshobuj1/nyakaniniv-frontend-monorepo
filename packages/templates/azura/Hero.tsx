import {Content} from '@repo/types';

export default function Hero({content}: {content: Content}) {
  return (
    <section style={{background: 'var(--primary)'}}>
      <h1>{content.heroTitle}</h1>
    </section>
  );
}
