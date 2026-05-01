import {Header, Footer} from '@repo/ui';

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
