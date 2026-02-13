
import { Rental } from "../types/rental";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

/* =========================================
   GET ALL RENTALS
========================================= */
export async function getRentals(): Promise<Rental[]> {
  const res = await fetch(`${BASE_URL}/rentals`);

  if (!res.ok) {
    throw new Error("Failed to fetch rentals");
  }

  return res.json();
}

/* =========================================
   CREATE RENTAL
========================================= */
export async function createRental(
  rental: Omit<Rental, "rentalId" | "createdAt" | "updatedAt" | "isDeleted">
): Promise<Rental> {
  const res = await fetch(`${BASE_URL}/rentals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rental),
  });

  if (!res.ok) {
    throw new Error("Failed to create rental");
  }

  return res.json();
}

/* =========================================
   UPDATE RENTAL
========================================= */
export async function updateRental(
  rentalId: string,
  rental: Partial<Rental>
): Promise<void> {
  const res = await fetch(`${BASE_URL}/rentals/${rentalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rental),
  });

  if (!res.ok) {
    throw new Error("Failed to update rental");
  }
}

/* =========================================
   SOFT DELETE RENTAL
========================================= */
export async function deleteRental(rentalId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/rentals/${rentalId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete rental");
  }
}
