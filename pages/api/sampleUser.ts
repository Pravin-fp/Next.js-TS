
export type SampleUserStatus = "active" | "inactive";

export interface SampleUser {
  email: string;
  name: string;
  username?: string;
  phone?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  country?: string;
  status: SampleUserStatus;
  createdAt?: string;
}
