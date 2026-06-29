export interface Client {
  city?: {
    name: string;
  };
  date_joined: Date;
  email: string | undefined;
  first_name: string | undefined;
  id: number;
  last_name: string | undefined;
  middle_name: string | undefined;
  phone: string | undefined;
  profile_type: number;
  is_staff?: boolean;
  roles?: {
    name: string;
  }[];
}
