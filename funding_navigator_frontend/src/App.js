import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "https://fn-navigator-api-app.azurewebsites.net";

const initial = {
  prov: "BC", type: "profit", ccpc: "yes",
  fte_idx: 2, rev_idx: 1, rd_idx: 2,
  tech: "ai", trl: "prototype", trl_idx: 1,
  budget_idx: 2, support: "grant", start: "3-12m",
  partner: true, compute: true
};

export default function App() {
  const [answers, setAnswers] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setAnswers(a => ({ ...a, [k]: e.target.type==="number" ? +v : v }));
  };

  const check = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const Field = ({label, name, options}) => (
    <label className="block my-2">
      {label}
      <select className="ml-2 border" value={answers[name]} onChange={update(name)}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-[#245266] mb-4">Funding Navigator</h1>
      <Field label="Province" name="prov" options={["BC","AB","ON","QC"]}/>
      <Field label="Entity type" name="type" options={["profit","non-profit","public"]}/>
      <Field label="CCPC?" name="ccpc" options={["yes","no"]}/>
      <Field label="Technology" name="tech" options={["ai","software","clean"]}/>
      <button onClick={check} className="mt-4 px-4 py-2 bg-[#245266] text-white rounded">
        {loading ? "Checking…" : "Check Eligibility"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Eligible programs</h2>
          <ul className="list-disc ml-6">
            {result.eligible.map(p=>(
              <li key={p.program_id}>{p.name} – {p.cap}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mt-4">Other programs to review</h2>
          <ul className="list-disc ml-6">
            {result.other.map(p=>(
              <li key={p.program_id}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
