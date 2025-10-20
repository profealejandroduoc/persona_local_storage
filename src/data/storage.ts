// src/storage.ts
import type { Persona } from "../interfaces/Persona";

const STORAGE_KEY = "people";

export function loadPeople(): Persona[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Persona[]) : [];
    } catch {
        return [];
    }
}

export function savePeople(people: Persona[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}
