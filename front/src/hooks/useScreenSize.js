import { useState, useEffect } from 'react';

const useScreenSize = (listenWidth, listenHeight) => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      if(
        window.innerHeight < 
        (listenHeight ?? 0) || 
        window.innerWidth < 
        listenWidth || 
        (!listenHeight && !listenWidth)
      ){
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [listenHeight, listenWidth]);

  return screenSize;
};

export default useScreenSize;