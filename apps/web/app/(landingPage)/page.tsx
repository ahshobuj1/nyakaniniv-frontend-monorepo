'use client';

import { FAQSection } from './_components/FAQSection';
import Features from './_components/Features';
import Hero from './_components/HeroSection';
import HowItWorks from './_components/HowItWorks';
import OurThemes from './_components/OurTheme';
import { useGetLandingPageContentQuery } from '@repo/store';

const Home = () => {
  const { data: response, isLoading } = useGetLandingPageContentQuery();
  const content = response?.data;

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <section>
      <Hero hero={content?.hero} />
      <Features services={content?.services} />
      <OurThemes />
      <HowItWorks steps={content?.steps} />
      <FAQSection faqs={content?.faqs} />
    </section>
  );
};

export default Home;
