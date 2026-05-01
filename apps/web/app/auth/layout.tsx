const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-[#f0f0f0]">
      <main>{children}</main>
    </div>
  );
};

export default layout;
