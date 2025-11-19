
import * as real from "./authApi.real";
import * as mock from "./authApi.mock";

const useMock = import.meta.env.VITE_AUTH_MOCK === "true";

export const apiLogin = useMock ? mock.apiLogin : real.apiLogin;
export const apiRefresh = useMock ? mock.apiRefresh : real.apiRefresh;
export const apiGetMe = useMock ? mock.apiGetMe : real.apiGetMe;
