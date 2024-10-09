import { get, post } from "./base";
import { InSignIn, OutSignIn, InSignUp, OutSignUp } from "../interface/user";

interface refrestInterface {
  refresh_token: string;
}

const AuthApi = {
  signIn: function (data: InSignIn) {
    return post<OutSignIn>("/login/", data);
  },
  signUp: function (data: InSignUp) {
    return post<OutSignUp>("/register/", data);
  },
  secret: function() {
    return get("/secret/");
  },
  refresh: function(data: refrestInterface) {
    return post("/refresh/", data);
  }
};

export default AuthApi;
