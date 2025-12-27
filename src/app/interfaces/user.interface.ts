export type UserRole = 'HR' | 'EMPLOYEE';

export interface User {
  _id?: string;
  username: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
}
