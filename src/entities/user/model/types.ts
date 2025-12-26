export interface AuthPayload {
  phone: string;
  password: string;
}

export interface AuthUser {
  id: number;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  profile_type: string;
  city: {
    id: number;
    name: string;
  };
  uuid: string;
  date_joined: string;
  roles: {
    name: string;
  }[];
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
}
