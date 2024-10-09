import { get, post } from "./base";
import { InSignIn, OutSignIn, InSignUp, OutSignUp } from "../interface/user";

interface refrestInterface {
  refresh_token: string;
}

const AuthApi = {
  signIn: function (data: InSignIn) {
    return post<OutSignIn>("/user/login/", data);
  },
  signUp: function (data: InSignUp) {
    return post<OutSignUp>("/user/register/", data);
  },
  secret: function() {
    return get("/auth/secret/");
  },
  refresh: function(data: refrestInterface) {
    return post("/auth/refresh/", data);
  }
};

export default AuthApi;
