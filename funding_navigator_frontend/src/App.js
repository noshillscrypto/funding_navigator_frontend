import React, { useState } from "react";

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://fn-navigator-api-app.azurewebsites.net";

export default function App() {
  // form state
  const [values, setValues] = useState({
    prov: "BC",
    type: "profit",
    ccpc: "yes",
    tech: "ai",
    fte_idx: "1",          // "0"=0‑3, "1"=4‑20, "2"=21‑100, "3"=100+
    rev_idx: "0",          // "0"<1M, "1"=1‑10M, "2">10M
    budget_idx: "0",
    trl_idx: "1",          // 0=idea,1=prototype,2=pilot,3=scale
    compute: "no",
    partner: "no",
    start: "yes"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`${API_BASE}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      setResult(await r.json());
    } catch (err) {
      console.error(err);
      alert("API error – check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Funding Navigator</h1>

      {/* --- Core selects --- */}
      <label>Province
        <select name="prov" value={values.prov} onChange={handleChange}>
          {["BC","AB","SK","MB","ON","QC","NB","NS","PE","NL","YT","NT","NU"].map(p=>(
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>{" "}

      <label>Entity type
        <select name="type" value={values.type} onChange={handleChange}>
          <option value="profit">profit</option>
          <option value="nfp">nfp</option>
        </select>
      </label>{" "}

      <label>CCPC?
        <select name="ccpc" value={values.ccpc} onChange={handleChange}>
          <option value="yes">yes</option>
          <option value="no">no</option>
        </select>
      </label>{" "}

      <label>Technology
        <select name="tech" value={values.tech} onChange={handleChange}>
          {["ai","software","manuf","bio","clean"].map(t=>(
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      {/* --- New questions --- */}
      <div className="mt-4 space-x-2">
        <label>Employees (FTE)
          <select name="fte_idx" value={values.fte_idx} onChange={handleChange}>
            <option value="0">0‑3</option>
            <option value="1">4‑20</option>
            <option value="2">21‑100</option>
            <option value="3">100+</option>
          </select>
        </label>

        <label>Annual revenue
          <select name="rev_idx" value={values.rev_idx} onChange={handleChange}>
            <option value="0">&lt;$1 M</option>
            <option value="1">$1‑10 M</option>
            <option value="2">&gt;$10 M</option>
          </select>
        </label>

        <label>Project budget
          <select name="budget_idx" value={values.budget_idx} onChange={handleChange}>
            <option value="0">&lt;$100 k</option>
            <option value="1">$100‑500 k</option>
            <option value="2">&gt;$500 k</option>
          </select>
        </label>

        <label>TRL stage
          <select name="trl_idx" value={values.trl_idx} onChange={handleChange}>
            <option value="0">Idea</option>
            <option value="1">Prototype</option>
            <option value="2">Pilot</option>
            <option value="3">Scale</option>
          </select>
        </label>

        <label>Need HPC / GPU?
          <select name="compute" value={values.compute} onChange={handleChange}>
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </label>

        <label>Partner secured?
          <select name="partner" value={values.partner} onChange={handleChange}>
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </label>
      </div>

      <button onClick={submit} className="mt-4 border px-3 py-1">
        {loading ? "Checking…" : "Check Eligibility"}
      </button>

      {/* --- Results --- */}
      {result && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Eligible programs</h2>
          <ul className="list-disc ml-6">
            {result.eligible.map(p => <li key={p}>{p}</li>)}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Other programs to review</h2>
          <ul className="list-disc ml-6">
            {result.review.map(p => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}
    </main>
  );
}
