import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import RootRouter from './view/RootRouter'

export default function App() {

  const [theme, setTheme] = useState("light-theme")

  useEffect(() => {
    if (!window.matchMedia) {
      return
    }
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark-theme" : "light-theme")
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const newColorScheme = event.matches ? "dark-theme" : "light-theme";
      setTheme(newColorScheme)
    });
  }, [])

  useEffect(() => {
    const element = document.getElementById("root");
    if (element) {
      element.className = theme;
    }
  }, [theme])

  return (
    <BrowserRouter>
      <RootRouter />
    </BrowserRouter>
  )
}
