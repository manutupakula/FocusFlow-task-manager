import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem('ff-theme') === 'dark'
  );

 useEffect(() => {
  localStorage.setItem('ff-theme', dark ? 'dark' : 'light');
  document.body.style.background = dark ? '#0d1117' : '#f5f9ff';
  document.body.style.color      = dark ? '#e2e8f0' : '#0d1b2a';
  document.body.classList.toggle('dark', dark);   // ← add this line
}, [dark]);

  const toggle = () => setDark(d => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);