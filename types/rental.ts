export type Renter = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
};
export type PaymentMethod = {
  id: string;                       
  method: "cashapp" | "gpay" | "phonepe";
  value: string;                   
};
export type RentalUser = {
  rentalId?: string;
  id: string;
  renterName: string;
  email: string;
  phone: string;
  paymentMethods: PaymentMethod[];
  rentalType: "daily" | "weekly";
  dailyFee: string;
  deposit: string;
  driverType: "uber" | "ola" | "rapido";
  startDate: string;               
  endDate: string;                 
};

export type Rental = {
  rentalId: string;
  renterId: number;
  paymentMethods: {
    id: string;
    method: string;
    value: string;
  }[];
  rentalType: "daily" | "weekly";
  dailyFee: string;
  deposit: string;
  driverType: "uber" | "ola" | "rapido";
  startDate: string;
  endDate: string;
  createdAt: string;
};
