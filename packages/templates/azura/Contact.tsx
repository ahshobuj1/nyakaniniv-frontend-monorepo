import {Content} from '@repo/types';

export default function Contact({content}: {content: Content}) {
  return (
    <section>
      <h2>Contact Us</h2>
      <p>{content?.email || 'contact@example.com'}</p>
    </section>
  );
}
