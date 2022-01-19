import create, { GetState, SetState, State } from "zustand";
import {
  persist,
  StoreApiWithPersist,
  StoreApiWithSubscribeWithSelector,
  subscribeWithSelector,
} from "zustand/middleware";
// import { customStorage } from '../utils/customStorage'

interface ThemeStoreStateItems {
  theme: string;
  color: string;
}
interface ThemeStoreState extends State, ThemeStoreStateItems {
  setTheme(theme: ThemeStoreState["theme"]): void;
  setColor(color: ThemeStoreState["color"]): void;
}

const initialState = {
  theme: "system",
  color: "purple",
};

export const useThemeStore = create<
  ThemeStoreState,
  SetState<ThemeStoreState>,
  GetState<ThemeStoreState>,
  StoreApiWithSubscribeWithSelector<ThemeStoreState> &
    StoreApiWithPersist<ThemeStoreState>
>(
  subscribeWithSelector(
    persist(
      (set) => ({
        ...initialState,
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),
        setColor: (color) =>
          set((state) => {
            state.color = color;
          }),
      }),
      {
        name: "themeStore",
        // getStorage: () => customStorage,
      }
    )
  )
);
