import React, { useEffect, useState } from 'react';
import Navigation from "./navigation/Navigation";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from './screens/LoginScreen';

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
    <LoginScreen />
  );
}
