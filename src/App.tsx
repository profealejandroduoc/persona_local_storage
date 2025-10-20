
import { useEffect, useMemo, useState } from "react";
import type { Persona } from "./interfaces/Persona";
import { loadPeople, savePeople } from "./data/storage";




// Genera un id simple
function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

//Omite el id de la interfaz al guardar porque se genera automático, manteniendo el estado 
//del formulario
type FormState = Omit<Persona, "id">;

export default function App() {
  const [people, setPeople] = useState<Persona[]>([]);
  const [form, setForm] = useState<FormState>({
    rut: "",
    nombre: "",
    apellido: "",
    direccion: "",
  });

  // Cargar datos guardados 
  useEffect(() => {
    setPeople(loadPeople());
  }, []);

  // Guardar automáticamente cada vez que cambie la lista
  useEffect(() => {
    savePeople(people);
  }, [people]);

  // Validaciones
  const errors = useMemo(() => {
    const err: Partial<Record<keyof FormState, string>> = {};
    if (!form.rut.trim()) err.rut = "El RUT es obligatorio.";
    if (form.rut.length > 1) err.rut = "RUT incompleto.";
    if (!form.nombre.trim()) err.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) err.apellido = "El apellido es obligatorio.";
    if (!form.direccion.trim()) err.direccion = "La dirección es obligatoria.";
    return err;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function handleChange<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();


    const newPersona: Persona = {
      id: makeId(),
      rut: form.rut.trim(),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      direccion: form.direccion.trim(),
    };

    if (!isValid) return;

    // Evita duplicados por RUT ¿Porqué puedo usar people?
    const exists = people.some((p) => p.rut === newPersona.rut);
    if (exists) {
      alert("Ya existe una persona con ese RUT.");
      return;
    }

    setPeople((prev) => [newPersona, ...prev]);

    // limpiar formulario
    setForm({ rut: "", nombre: "", apellido: "", direccion: "" });
  }

  function handleDelete(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  function handleClearAll() {
    if (confirm("¿Eliminar todas las personas guardadas?")) {
      setPeople([]);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Registro de Personas</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Completa el formulario y guarda las personas en tu navegador usando Local Storage.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <label htmlFor="rut"><strong>RUT</strong></label>
          <input
            id="rut"
            placeholder="12.345.678-K"
            value={form.rut}
            onChange={(e) => handleChange("rut", e.target.value)}
          />
          {errors.rut && <small style={{ color: "crimson" }}>{errors.rut}</small>}
        </div>

        <div style={{ display: "grid", gap: "0.25rem" }}>
          <label htmlFor="nombre"><strong>Nombre</strong></label>
          <input
            id="nombre"
            placeholder="Ej: Ana"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />
          {errors.nombre && <small style={{ color: "crimson" }}>{errors.nombre}</small>}
        </div>

        <div style={{ display: "grid", gap: "0.25rem" }}>
          <label htmlFor="apellido"><strong>Apellido</strong></label>
          <input
            id="apellido"
            placeholder="Ej: Pérez"
            value={form.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
          />
          {errors.apellido && <small style={{ color: "crimson" }}>{errors.apellido}</small>}
        </div>

        <div style={{ display: "grid", gap: "0.25rem" }}>
          <label htmlFor="direccion"><strong>Dirección</strong></label>
          <input
            id="direccion"
            placeholder="Ej: Av. Siempre Viva 123"
            value={form.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
          />
          {errors.direccion && <small style={{ color: "crimson" }}>{errors.direccion}</small>}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button type="submit" disabled={!isValid}>Guardar</button>
          <button type="button" onClick={handleClearAll} style={{ background: "#eee" }}>
            Limpiar todo
          </button>
        </div>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      <h2>Personas guardadas ({people.length})</h2>
      {people.length === 0 ? (
        <p style={{ color: "#777" }}>Aún no hay registros.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
          {people.map((p) => (
            <li key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "0.75rem" }}>
              <div><strong>RUT:</strong> {p.rut}</div>
              <div><strong>Nombre:</strong> {p.nombre} {p.apellido}</div>
              <div><strong>Dirección:</strong> {p.direccion}</div>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => handleDelete(p.id)} style={{ background: "#ffe6e6" }}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

