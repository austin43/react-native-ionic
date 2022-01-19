import { useEffect } from "react";
import { useThemeStore } from "../stores/useThemeStore";
import { Appearance } from "react-native";

export const theme = () => {
  const appearance = Appearance.getColorScheme();
  console.log("appearance", appearance);

  Appearance.addChangeListener((state) => {
    console.log("appearance", state);
  });

  useThemeStore.subscribe(
    (state) => state.theme,
    (theme) => {
      console.log("theme", theme);

      if (theme === "system") {
      }

      // get the preference
      // set keyboard, statusbar, and the theme to dark/light
    },
    { fireImmediately: true }
  );
};

// export const Theme: React.FC = () => {
//   const theme = useThemeStore((state) => state.theme);

//   useEffect(() => {
//     if (theme === "system") {
//       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
//       document.body.classList.toggle("dark", prefersDark.matches);

//       if (Capacitor.isNativePlatform()) {
//         Keyboard.setStyle({
//           style: prefersDark ? KeyboardStyle.Dark : KeyboardStyle.Light,
//         });
//         StatusBar.setStyle({
//           style: prefersDark ? Style.Dark : Style.Light,
//         });
//       }

//       const handler = (e: MediaQueryListEvent) => {
//         document.body.classList.toggle("dark", e.matches);
//       };

//       prefersDark.addEventListener("change", handler);
//       return () => prefersDark.removeEventListener("change", handler);
//     } else if (theme === "dark") {
//       if (Capacitor.isNativePlatform()) {
//         Keyboard.setStyle({ style: KeyboardStyle.Dark });
//         StatusBar.setStyle({
//           style: Style.Dark,
//         });
//       }
//       document.body.classList.toggle("dark", true);
//     } else {
//       if (Capacitor.isNativePlatform()) {
//         Keyboard.setStyle({ style: KeyboardStyle.Light });
//         StatusBar.setStyle({
//           style: Style.Light,
//         });
//       }
//       document.body.classList.toggle("dark", false);
//     }
//   }, [theme]);

//   useEffect(() => {
//     const initialColor = useThemeStore.getState().color;
//     document.body.classList.toggle(initialColor, true);

//     const unsubscribe = useThemeStore.subscribe(
//       (state) => state.color,
//       (color: string, prevColor) => {
//         if (color !== prevColor) {
//           document.body.classList.toggle(color, true);
//           document.body.classList.toggle(prevColor, false);
//         }
//       }
//     );
//     return () => unsubscribe();
//   }, []);

//   return null;
// };
