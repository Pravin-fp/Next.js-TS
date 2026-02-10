export type PaymentMethod = {
  id: string;                       
  method: "cashapp" | "gpay" | "phonepe";
  value: string;                   
};
export type RentalUser = {
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
