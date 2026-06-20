'use client';


import { ScaleLoader } from 'react-spinners';

const LoadingSpinner = ({ smallHeight, fullScreen }: { smallHeight?: boolean; fullScreen?: boolean }) => {
    let heightClass = 'h-[70vh]';
    if (fullScreen) heightClass = 'h-screen';
    else if (smallHeight) heightClass = 'h-[250px]';

    return (
        <div className={`${heightClass} w-full flex flex-col justify-center items-center`}>
            <ScaleLoader color="red" />
        </div>
    );
};



export default LoadingSpinner;
