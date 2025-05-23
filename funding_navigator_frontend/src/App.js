import React, { useState } from "react";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://fn-navigator-api-app.azurewebsites.net";

function App() {
  const [answers, setAnswers] = useState({
    prov: "BC",
    type: "profit",
    ccpc: "yes",
    fte_idx: 1,
    rev_idx: 1,
    rd_idx: 1,
    tech: "ai",
    trl: "idea",
    trl_idx: 1,
    budget_idx: 1,
    support: "grant",
    start: "<3m",
    partner: false,
    compute: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (name) => (e) => {
    const { type, checked, value } = e.target;
    setAnswers((a) => ({
      ...a,
      [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectOptions = {
    prov: ["BC", "ON", "QC", "AB", "MB", "NS", "NB", "NL", "PE", "SK", "NT", "YT", "NU"],
    type: ["profit", "nonprofit", "public"],
    ccpc: ["yes", "no"],
    tech: ["ai", "dpa", "manuf", "idm", "other"],
    trl: ["idea", "prototype", "pilot", "production"],
    support: ["grant", "loan", "tax_credit"],
    start: ["<3m", "3-12m", "1-3y", "3+y"],
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Funding Navigator</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(selectOptions).map((field) => (
          <label key={field} className="block my-2">
            {field}
            <select
              name={field}
              value={answers[field]}
              onChange={update(field)}
              className="ml-2 border"
            >
              {selectOptions[field].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        ))}
        {["fte_idx", "rev_idx", "rd_idx", "trl_idx", "budget_idx"].map((field) => (
          <label key={field} className="block my-2">
            {field}
            <input
              type="number"
              name={field}
              min={0}
              value={answers[field]}
              onChange={update(field)}
              className="ml-2 border w-20"
            />
          </label>
        ))}
        <label className="block my-2">
          partner
          <input
            type="checkbox"
            name="partner"
            checked={answers.partner}
            onChange={update("partner")}
            className="ml-2"
          />
        </label>
        <label className="block my-2">
          compute
          <input
            type="checkbox"
            name="compute"
            checked={answers.compute}
            onChange={update("compute")}
            className="ml-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Checking..." : "Check Eligibility"}
        </button>
      </form>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Eligible Programs</h2>
          <ul className="list-disc ml-6">
            {result.eligible.map((p) => (
              <li key={p.program_id}>{p.name}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mt-4">Other Programs to Review</h2>
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

export default App;
