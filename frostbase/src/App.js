import React, { useEffect, useState } from 'react';

import SplashScreen from "./screens/SplashScreen";
import Navigation from './navigation/Navigation';

export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Navigation />
  );
}
