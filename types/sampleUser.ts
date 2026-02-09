
export type SampleUserStatus = "active" | "inactive";

export interface SampleUser {
  email: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  postal: string;
  country: string;
  status: SampleUserStatus;
   createdAt: string;
}
