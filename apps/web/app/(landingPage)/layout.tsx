import {Header, Footer} from '@repo/ui';

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
