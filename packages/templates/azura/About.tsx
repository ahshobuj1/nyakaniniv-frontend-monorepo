import {Content} from '@repo/types';

export default function About({content}: {content: Content}) {
  return (
    <section>
      <h2>About Us</h2>
      <p>{content?.aboutText || 'We are a DJ service.'}</p>
    </section>
  );
}
