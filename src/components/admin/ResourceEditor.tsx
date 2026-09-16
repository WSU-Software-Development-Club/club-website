import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  AuthExpiredError,
  createRow,
  deleteRow,
  listRows,
  updateRow,
  type Row,
} from "@/lib/adminApi";
import type { FieldSpec, ResourceSpec } from "./fieldSpecs";

interface ResourceEditorProps {
  spec: ResourceSpec;
  /** Called when the session expires so the page can send the user back to sign in. */
  onSessionExpired: () => void;
}

/** Blank form, one empty string per field. */
function emptyValues(spec: ResourceSpec): Record<string, string> {
  return Object.fromEntries(spec.fields.map((field) => [field.name, ""]));
}

/** Loads a row back into the form. Every input is a string, so nulls become "". */
function valuesFromRow(spec: ResourceSpec, row: Row): Record<string, string> {
  return Object.fromEntries(
    spec.fields.map((field) => [
      field.name,
      row[field.name] == null ? "" : String(row[field.name]),
    ]),
  );
}

export default function ResourceEditor({ spec, onSessionExpired }: ResourceEditorProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, string>>(() => emptyValues(spec));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Any 401 means the token is gone or stale; hand control back to the page.
  const report = useCallback(
    (err: unknown) => {
      if (err instanceof AuthExpiredError) {
        onSessionExpired();
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    },
    [onSessionExpired],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listRows(spec.resource));
    } catch (err) {
      report(err);
    } finally {
      setLoading(false);
    }
  }, [spec.resource, report]);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setValues(emptyValues(spec));
    setEditingId(null);
    setError(null);
  }

  function startEdit(row: Row) {
    setValues(valuesFromRow(spec, row));
    setEditingId(Number(row[spec.idKey]));
    setConfirmingId(null);
    setError(null);
    setNotice(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      if (editingId === null) {
        await createRow(spec.resource, values);
        setNotice(`Added the ${spec.noun}.`);
      } else {
        await updateRow(spec.resource, editingId, values);
        setNotice(`Saved changes to the ${spec.noun}.`);
      }
      resetForm();
      await load(); // re-read so the list always matches the database
    } catch (err) {
      report(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    setNotice(null);

    try {
      await deleteRow(spec.resource, id);
      setConfirmingId(null);
      if (editingId === id) resetForm();
      setNotice(`Removed the ${spec.noun}.`);
      await load();
    } catch (err) {
      report(err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Existing rows */}
      <Card className="px-6">
        <h2 className="text-2xl font-bold text-black80">Current {spec.tab.toLowerCase()}</h2>

        {loading ? (
          <p className="py-4 text-black80">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="py-4 text-black80">No {spec.noun}s yet. Add the first one below.</p>
        ) : (
          <ul className="divide-y">
            {rows.map((row) => {
              const id = Number(row[spec.idKey]);
              const { title, detail } = spec.summarize(row);

              return (
                <li key={id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-black80 truncate">{title}</p>
                    <p className="text-sm text-gray truncate">{detail}</p>
                  </div>

                  {confirmingId === id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-black80">Remove this {spec.noun}?</span>
                      <button
                        type="button"
                        onClick={() => void handleDelete(id)}
                        className="bg-wsu_red text-white text-sm px-3 py-1.5 rounded-md cursor-pointer hover:bg-crimson transition-colors"
                      >
                        Yes, remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="border text-black80 text-sm px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="bg-black90 text-white text-sm px-3 py-1.5 rounded-md cursor-pointer hover:bg-black80 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(id)}
                        className="border border-wsu_red text-wsu_red text-sm px-3 py-1.5 rounded-md cursor-pointer hover:bg-wsu_red hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Add / edit form */}
      <Card className="px-6">
        <h2 className="text-2xl font-bold text-black80">
          {editingId === null ? `Add a ${spec.noun}` : `Edit ${spec.noun}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {spec.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
              />
            ))}
          </div>

          {error && (
            <p role="alert" className="text-wsu_red font-medium">
              {error}
            </p>
          )}
          {notice && <p className="text-crimson font-medium">{notice}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-crimson text-white px-5 py-2 rounded-md cursor-pointer hover:bg-wsu_red disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : editingId === null ? `Add ${spec.noun}` : "Save changes"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="border text-black80 px-5 py-2 rounded-md cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

interface FormFieldProps {
  field: FieldSpec;
  value: string;
  onChange: (value: string) => void;
}

function FormField({ field, value, onChange }: FormFieldProps) {
  const id = `field-${field.name}`;
  const shared = {
    id,
    value,
    required: field.required,
    maxLength: field.maxLength,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className:
      "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crimson",
  };

  return (
    <div className={field.type === "textarea" ? "md:col-span-2" : undefined}>
      <label htmlFor={id} className="block font-medium text-black80 mb-1">
        {field.label}
        {field.required && <span className="text-wsu_red"> *</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={field.type} />
      )}

      {field.help && <p className="text-sm text-gray mt-1">{field.help}</p>}
    </div>
  );
}
