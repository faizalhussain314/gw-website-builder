import store from "../../store/store";

export const getToken = (): string => {
  const state = store.getState();
  return state.user.wp_token;
};
