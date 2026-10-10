'use client';


import { ScaleLoader } from 'react-spinners';

const LoadingSpinner = ({
  smallHeight,
  fullScreen,
  className = '',
}: {
  smallHeight?: boolean;
  fullScreen?: boolean;
  className?: string;
}) => {
  let heightClass = 'h-[70vh]';
  if (fullScreen) heightClass = 'h-screen';
  else if (smallHeight) heightClass = 'h-[250px]';

  return (
    <div className={`${heightClass} w-full flex flex-col justify-center items-center ${className}`}>
      <ScaleLoader color="#F63131" />
    </div>
  );
};



export default LoadingSpinner;
