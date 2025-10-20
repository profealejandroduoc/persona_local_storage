# Actividad Registro de Persona con TS+SWC y Local Storage

## 1 Crear interfaz persona

```ts
export interface Person {
  id: string;         
  rut: string;
  nombre: string;
  apellido: string;
  direccion: string;
}

```

## 2. Create a helper to manipulate local storage

```ts
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
```
