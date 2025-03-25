// login and register
export interface UserDto {
  email: string;
  password: string;
}

// manage/info
export interface UserInfo {
  id: string;
  email: string;
  username: string;
  isEmailConfirmed?: boolean;
  aboutMe?: string;
  role?: string;
}
