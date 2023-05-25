import { writable } from "svelte/store";

export const loading = writable(false);
export const totalIncome = writable(0);
export const totalBills = writable(0);
