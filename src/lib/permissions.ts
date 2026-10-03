export const RESOURCES = ["USERS", "ROLES", "TRANSACTIONS"] as const; // add 'CHANGE_LOGS' etc. if you guard them
export const ACTIONS = [
  "LIST",
  "CREATE",
  "UPDATE",
  "RESTORE",
  "DELETE",
] as const;

export type Resource = (typeof RESOURCES)[number];
export type Action = (typeof ACTIONS)[number];

export const perm = (r: Resource, a: Action) => `${r}.${a}`;
