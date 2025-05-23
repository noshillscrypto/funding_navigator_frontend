import React, { useState } from "react";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://fn-navigator-api-app.azurewebsites.net";

/* ---------- defaults that satisfy every required backend field ---------- */
const initial = {
  prov: "BC",
  type: "profit",
  ccpc: "yes",
  amount: 0,          // NEW – backend requires this
  fte_idx: 2,
  rev_idx: 1,
  rd_idx: 2,
  tech: "ai",
  trl: "prototype",
  trl_idx: 1,
  budget_idx: 2,
  support: "grant",
  start: "3-12m",
  partner: true,
  compute: true,
};

export default function App() {
  const [answers, setAnswers] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => {
    const { type, checked, value } = e.target;
    // cast numbers so the backend gets numbers, not strings
    const cast = type === "number" ? +value : type === "checkbox" ? checked : value;
    setAnswers((a) => ({ ...a, [k]: cast }));
  };

  const check = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- tiny helpers ---------- */
  const Select = ({ label, name, options }) => (
    <label className="block my-2">
      {label}
      <select
        className="ml-2 border"
        value={answers[name]}
        onChange={update(name)}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );

  const NumberInput = ({ label, name, min = 0, step = 1 }) => (
    <label className="block my-2">
      {label}
      <input
        type="number"
        className="ml-2 border px-1 w-28"
        min={min}
        step={step}
        value={answers[name]}
        onChange={update(name)}
      />
    </label>
  );

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-[#245266] mb-4">
        Funding Navigator
      </h1>

      <Select label="Province" name="prov" options={["BC", "AB", "ON", "QC"]} />
      <Select
        label="Entity type"
        name="type"
        options={["profit", "non-profit", "public"]}
      />
      <Select label="CCPC?" name="ccpc" options={["yes", "no"]} />
      <Select label="Technology" name="tech" options={["ai", "software", "clean"]} />
      {/* NEW – amount expected by backend */}
      <NumberInput label="Funding amount ($)" name="amount" min={0} step={1000} />

      <button
        onClick={check}
        className="mt-4 px-4 py-2 bg-[#245266] text-white rounded"
        disabled={loading}
      >
        {loading ? "Checking…" : "Check Eligibility"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Eligible programs</h2>
          <ul className="list-disc ml-6">
            {result.eligible.map((p) => (
              <li key={p.program_id}>
                {p.name} – {p.cap}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Other programs to review</h2>
          <ul className="list-disc ml-6">
            {result.other.map((p) => (
              <li key={p.program_id}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
