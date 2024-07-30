export const JWT_SECRET = process.env.JWT_SECRET ?? "Need to change later";
export const WORKER_JWT_SECRET = JWT_SECRET + "worker" ; // Cannot have the same secret for the users and the worker ;

export const TOTAL_DECIMALS = 1000_000;

// 1/1000_000_000_000_000_000