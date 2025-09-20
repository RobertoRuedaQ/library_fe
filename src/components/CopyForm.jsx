import { useState } from "react";

export default function CopyForm({ onSubmit, initialData = {} }) {
  const [condition, setCondition] = useState(initialData.condition || "");
  const [status, setStatus] = useState(initialData.status || "available");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ condition, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Condition"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
        <option value="maintenance">Maintenance</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
