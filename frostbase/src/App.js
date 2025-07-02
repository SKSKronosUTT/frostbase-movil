import React, { useEffect, useState } from 'react';

import SplashScreen from "./screens/SplashScreen";
import LoginNavigation from './navigation/LoginNavigation';

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
    <LoginNavigation />
  );
}
