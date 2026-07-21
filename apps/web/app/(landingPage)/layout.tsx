import {Footer} from '@repo/ui';
import {LandingHeader} from '@/components/LandingHeader';

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
      <LandingHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
