import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  createdAt: string;
}

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cupangpandi.com";
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

const usersFile = path.join(process.cwd(), "data", "users.json");

function loadUsers(): User[] {
  if (!existsSync(usersFile)) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(usersFile, "utf8"));
    return Array.isArray(parsed) ? (parsed as User[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  mkdirSync(path.dirname(usersFile), { recursive: true });
  writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")): {
  salt: string;
  hash: string;
} {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, expectedHex: string): boolean {
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return (
    actual.length === expected.length && timingSafeEqual(actual, expected)
  );
}

function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function seedAdminIfMissing(): SafeUser {
  const users = loadUsers();
  const existing = users.find((u) => u.role === "admin");
  if (existing) {
    return toSafeUser(existing);
  }

  const { salt, hash } = hashPassword(DEFAULT_ADMIN_PASSWORD);
  const admin: User = {
    id: randomUUID(),
    name: "Admin",
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash: hash,
    salt,
    role: "admin",
    createdAt: new Date().toISOString(),
  };
  users.push(admin);
  saveUsers(users);
  return toSafeUser(admin);
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): SafeUser {
  const email = input.email.trim().toLowerCase();
  const users = loadUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("That email is already registered. Try logging in instead.");
  }

  const { salt, hash } = hashPassword(input.password);
  const user: User = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: hash,
    salt,
    role: "user",
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return toSafeUser(user);
}

export function findUserByEmail(email: string): SafeUser | null {
  const emailKey = email.trim().toLowerCase();
  const user = loadUsers().find((u) => u.email === emailKey);
  return user ? toSafeUser(user) : null;
}

export function loginUser(input: {
  email: string;
  password: string;
}): SafeUser | null {
  const emailKey = input.email.trim().toLowerCase();
  const user = loadUsers().find((u) => u.email === emailKey);
  if (!user || !verifyPassword(input.password, user.salt, user.passwordHash)) {
    return null;
  }
  return toSafeUser(user);
}
