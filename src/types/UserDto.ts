export interface UserDto {
  userId: number;
  nickName: string | null;
  email : string;
  profile : string;
  state: 'PENDING' | 'USER' | 'ADMIN';
}
