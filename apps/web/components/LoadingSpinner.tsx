'use client';

import PropTypes from 'prop-types';
import { ScaleLoader } from 'react-spinners';

const LoadingSpinner = ({ smallHeight }: { smallHeight?: boolean }) => {
    return (
        <div
            className={` ${smallHeight ? 'h-[250px]' : 'h-[70vh]'}
      flex 
      flex-col 
      justify-center 
      items-center `}>
            <ScaleLoader color="red" />
        </div>
    );
};

LoadingSpinner.propTypes = {
    smallHeight: PropTypes.bool,
};

export default LoadingSpinner;
