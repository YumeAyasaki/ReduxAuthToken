export interface TUser {
  username: string;
  email: string;
}

export interface InSignIn {
  email: string;
  password: string;
}

export interface OutSignIn {
  username: string;
  access_token: string;
  refresh_token: string;
}

export interface InSignUp {
  email: string;
  username: string;
  password: string;
}

export interface OutSignUp {
  user: TUser;
}
