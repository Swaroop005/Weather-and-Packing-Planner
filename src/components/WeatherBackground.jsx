import { useEffect, useState, useMemo } from 'react';
import './WeatherBackground.css';

const WeatherBackground = ({ conditionType }) => {
  // We use useMemo to generate random drops/flakes once per condition change
  const elements = useMemo(() => {
    const arr = [];
    if (conditionType === 'rain') {
      for (let i = 0; i < 60; i++) {
        arr.push({
          id: i,
          left: `${Math.random() * 100}vw`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`, // 0.5s to 1s
          animationDelay: `${Math.random() * 2}s`,
          opacity: 0.3 + Math.random() * 0.4
        });
      }
    } else if (conditionType === 'snow') {
      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 6 + 4; // 4px to 10px
        arr.push({
          id: i,
          left: `${Math.random() * 100}vw`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${5 + Math.random() * 5}s`, // 5s to 10s
          animationDelay: `${Math.random() * 5}s`,
          opacity: 0.4 + Math.random() * 0.5
        });
      }
    } else if (conditionType === 'clouds') {
      for (let i = 0; i < 5; i++) {
        const size = Math.random() * 200 + 200; // 200 to 400px
        arr.push({
          id: i,
          top: `${Math.random() * 40}vh`,
          width: `${size}px`,
          height: `${size * 0.6}px`,
          animationDuration: `${30 + Math.random() * 30}s`, // slow moving
          animationDelay: `-${Math.random() * 30}s` // start already on screen
        });
      }
    } else if (!conditionType || conditionType === 'clear') {
      // Default / Clear state -> beautiful floating aurora orbs
      const colors = ['rgba(147, 51, 234, 0.4)', 'rgba(59, 130, 246, 0.4)', 'rgba(236, 72, 153, 0.3)', 'rgba(16, 185, 129, 0.2)'];
      for (let i = 0; i < 4; i++) {
        arr.push({
          id: `aurora-${i}`,
          top: `${Math.random() * 60 - 10}vh`,
          left: `${Math.random() * 80 - 10}vw`,
          width: `${Math.random() * 30 + 40}vw`,
          height: `${Math.random() * 30 + 40}vw`,
          background: colors[i],
          animationDuration: `${15 + Math.random() * 10}s`,
          animationDelay: `-${Math.random() * 10}s`
        });
      }
    }
    return arr;
  }, [conditionType]);

  return (
    <div className="weather-bg-container">
      {elements.map((el) => {
        if (el.id.toString().startsWith('aurora')) {
          return (
            <div 
              key={el.id} 
              className="aurora-orb" 
              style={{
                top: el.top,
                left: el.left,
                width: el.width,
                height: el.height,
                background: el.background,
                animationDuration: el.animationDuration,
                animationDelay: el.animationDelay
              }}
            />
          );
        }
        if (conditionType === 'rain') {
          return (
            <div 
              key={el.id} 
              className="rain-drop" 
              style={{
                left: el.left,
                animationDuration: el.animationDuration,
                animationDelay: el.animationDelay,
                opacity: el.opacity
              }}
            />
          );
        }
        if (conditionType === 'snow') {
          return (
            <div 
              key={el.id} 
              className="snow-flake" 
              style={{
                left: el.left,
                width: el.width,
                height: el.height,
                animationDuration: el.animationDuration,
                animationDelay: el.animationDelay,
                opacity: el.opacity
              }}
            />
          );
        }
        if (conditionType === 'clouds') {
          return (
            <div 
              key={el.id} 
              className="cloud-shape" 
              style={{
                top: el.top,
                width: el.width,
                height: el.height,
                animationDuration: el.animationDuration,
                animationDelay: el.animationDelay
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default WeatherBackground;
