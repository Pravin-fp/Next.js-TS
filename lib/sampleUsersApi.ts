import { SampleUser } from "../types/sampleUser";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

// ===============================
// GET sample users
// ===============================
export async function getSampleUsers(): Promise<SampleUser[]> {
  const res = await fetch(`${BASE_URL}/sample-users`);

  if (!res.ok) {
    throw new Error("Failed to fetch sample users");
  }

  return res.json();
}

// ===============================
// CREATE sample user
// ===============================
export async function createSampleUser(user: SampleUser): Promise<SampleUser> {
  const res = await fetch(`${BASE_URL}/sample-users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create sample user");
  }

  return res.json();
}

// ===============================
// UPDATE sample user
// ===============================
export async function updateSampleUser(
  email: string,
  user: Partial<SampleUser>
): Promise<void> {
  const res = await fetch(`${BASE_URL}/sample-users/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error("Failed to update sample user");
  }
}

// ===============================
// DELETE sample user
// ===============================
export async function deleteSampleUser(email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/sample-users/${email}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete sample user");
  }
}
