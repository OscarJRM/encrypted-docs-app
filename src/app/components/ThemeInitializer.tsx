const prefersDarkQuery = "(prefers-color-scheme: dark)";

const themeInitializerCode = `
(() => {
  if (typeof window === "undefined" || window.__themeInitializerRan) return;
  window.__themeInitializerRan = true;

  const mediaQuery = window.matchMedia("${prefersDarkQuery}");
  const targets = [document.documentElement, document.body];

  const applyTheme = (isDark) => {
    targets.forEach((target) => {
      if (!target) return;
      target.classList.toggle("dark", isDark);
      target.classList.toggle("light", !isDark);
      target.dataset.theme = isDark ? "dark" : "light";
    });
  };

  applyTheme(mediaQuery.matches);

  const handleChange = (event) => applyTheme(event.matches);
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleChange);
  }
})();
`;

declare global {
  interface Window {
    __themeInitializerRan?: boolean;
  }
}

export function ThemeInitializer() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitializerCode }} />;
}
