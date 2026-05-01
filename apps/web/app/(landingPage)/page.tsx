
import { FAQSection } from './_components/FAQSection';
import Features from './_components/Features';
import Hero from './_components/HeroSection';
import HowItWorks from './_components/HowItWorks';
import OurThemes from './_components/OurTheme';

const Home = () => {
  return (
    <section>
      <Hero />
      <Features />
      <OurThemes />
      <HowItWorks />
      <FAQSection />
    </section>
  );
};

export default Home;
