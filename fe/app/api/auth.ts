import { post } from "./base";
import { InSignIn, OutSignIn, InSignUp, OutSignUp } from "../interface/user";

const AuthApi = {
  signIn: function (data: InSignIn) {
    return post<OutSignIn>("/login/", data);
  },
  signUp: function (data: InSignUp) {
    return post<OutSignUp>("/register/", data);
  },
};

export default AuthApi;
