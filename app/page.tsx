"use client";
import { useMemo, useState } from "react";

type Gene = "CYP2C19" | "TPMT" | "DPYD" | "BRCA1" | "";
type Drug =
  | "Clopidogrel"
  | "Azathioprine"
  | "Fluorouracil (5-FU)"
  | "Capecitabine"
  | "No drug selected";

export default function Home() {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState<string>("");
  const [condition, setCondition] = useState("");
  const [drug, setDrug] = useState<Drug>("No drug selected");
  const [gene, setGene] = useState<Gene>("");
  const [phenotype, setPhenotype] = useState("");

  const recommendation = useMemo(() => {
    if (!drug || drug === "No drug selected") return null;

    if (drug === "Clopidogrel" && gene === "CYP2C19") {
      if (phenotype === "Poor metabolizer")
        return { level: "High risk", msg: "Reduced activation → lower efficacy expected.", rec: "Consider alternative antiplatelet therapy (per clinical guidelines)." };
      if (phenotype === "Intermediate metabolizer")
        return { level: "Moderate risk", msg: "Potentially reduced activation → efficacy may be lower.", rec: "Consider dose/therapy adjustment based on clinical context." };
      return { level: "Info", msg: "No major alert selected for this phenotype.", rec: "Proceed with standard care and monitoring." };
    }

    if (drug === "Azathioprine" && gene === "TPMT") {
      if (phenotype === "Low activity")
        return { level: "High risk", msg: "High toxicity risk (myelosuppression).", rec: "Avoid or use substantial dose reduction + close monitoring." };
      if (phenotype === "Intermediate activity")
        return { level: "Moderate risk", msg: "Increased toxicity risk possible.", rec: "Start with reduced dose and monitor blood counts closely." };
      return { level: "Info", msg: "No major alert selected for this phenotype.", rec: "Proceed with standard care and monitoring." };
    }

    if ((drug === "Fluorouracil (5-FU)" || drug === "Capecitabine") && gene === "DPYD") {
      if (phenotype === "Poor function")
        return { level: "High risk", msg: "Severe toxicity risk.", rec: "Avoid fluoropyrimidines or use drastically reduced dose with specialist oversight." };
      if (phenotype === "Intermediate function")
        return { level: "Moderate risk", msg: "Toxicity risk increased.", rec: "Consider dose reduction and enhanced monitoring." };
      return { level: "Info", msg: "No major alert selected for this phenotype.", rec: "Proceed with standard care and monitoring." };
    }

    if (gene === "BRCA1") {
      return { level: "Info", msg: "BRCA1 variants may indicate elevated cancer risk.", rec: "Recommend genetic counseling and guideline-based screening." };
    }

    return { level: "Info", msg: "No matching rule for the current selection.", rec: "Try selecting a gene/drug pair listed above." };
  }, [drug, gene, phenotype]);

  return (
    <main className="page">
      <div className="bgGlow" />

      <header className="header">
        <h1>Genomics-Based Precision Medicine Platform</h1>
        <p>
          Functional MVP (hackathon demo): clinician enters a drug + genetic marker (and phenotype).
          The system returns explainable risk alerts and therapy guidance.
        </p>

        <div className="btnRow">
          <button
            className="btn btnPrimary"
            onClick={() => {
              setPatientName("Demo Patient A");
              setAge("26");
              setCondition("High ferritin, low neutrophil (demo)");
              setDrug("Azathioprine");
              setGene("TPMT");
              setPhenotype("Intermediate activity");
            }}
          >
            Load demo patient
          </button>

          <button
            className="btn"
            onClick={() => {
              setPatientName("");
              setAge("");
              setCondition("");
              setDrug("No drug selected");
              setGene("");
              setPhenotype("");
            }}
          >
            Clear
          </button>
        </div>
      </header>

      <div className="layout">
        <section className="card">
          <h2>Clinician input</h2>

          <div className="grid2">
            <label>
              Patient name (optional)
              <input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="e.g., Patient A" />
            </label>

            <label>
              Age
              <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 52" inputMode="numeric" />
            </label>

            <label className="fullRow">
              Clinical condition (short)
              <input
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g., post-PCI / oncology / autoimmune"
              />
            </label>

            <label>
              Drug (example)
              <select value={drug} onChange={(e) => setDrug(e.target.value as Drug)}>
                <option>No drug selected</option>
                <option>Clopidogrel</option>
                <option>Azathioprine</option>
                <option>Fluorouracil (5-FU)</option>
                <option>Capecitabine</option>
              </select>
            </label>

            <label>
              Genetic marker
              <select
                value={gene}
                onChange={(e) => {
                  const g = e.target.value as Gene;
                  setGene(g);
                  setPhenotype("");
                }}
              >
                <option value="">Select gene</option>
                <option value="CYP2C19">CYP2C19</option>
                <option value="TPMT">TPMT</option>
                <option value="DPYD">DPYD</option>
                <option value="BRCA1">BRCA1</option>
              </select>
            </label>

            <label className="fullRow">
              Phenotype / Function (demo)
              <select
                value={phenotype}
                onChange={(e) => setPhenotype(e.target.value)}
                disabled={!gene || gene === "BRCA1"}
              >
                <option value="">Select phenotype</option>

                {gene === "CYP2C19" && (
                  <>
                    <option>Normal metabolizer</option>
                    <option>Intermediate metabolizer</option>
                    <option>Poor metabolizer</option>
                  </>
                )}

                {gene === "TPMT" && (
                  <>
                    <option>Normal activity</option>
                    <option>Intermediate activity</option>
                    <option>Low activity</option>
                  </>
                )}

                {gene === "DPYD" && (
                  <>
                    <option>Normal function</option>
                    <option>Intermediate function</option>
                    <option>Poor function</option>
                  </>
                )}
              </select>
            </label>
          </div>

          <div className="hintCard">
            <b>Supported demo rules:</b>
            <ul>
              <li>TPMT + Azathioprine (myelosuppression risk)</li>
              <li>CYP2C19 + Clopidogrel (reduced activation)</li>
              <li>DPYD + Fluorouracil/Capecitabine (toxicity risk)</li>
              <li>BRCA1 (risk info → counseling/screening)</li>
            </ul>
          </div>
        </section>

        <section className="card">
          <h2>Recommendation</h2>

          {recommendation ? (
            <div className="rec">
              <p><b>Risk level:</b> {recommendation.level}</p>
              <p><b>Why:</b> {recommendation.msg}</p>
              <p><b>Suggested action:</b> {recommendation.rec}</p>
              <p className="disclaimer">Demo only — not clinical advice.</p>
            </div>
          ) : (
            <div className="rec">
              <p className="muted">Select a drug + gene (and phenotype if available) to see decision support output.</p>
              <p className="disclaimer">Demo only — not clinical advice.</p>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .page{
          min-height:100vh;
          padding:24px;
          color:#e8eef7;
          background:#070a10;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          max-width: 980px;
          margin: 0 auto;
          position: relative;
        }
        .bgGlow{
          position:fixed;
          inset:0;
          pointer-events:none;
          background:
            radial-gradient(900px 500px at 20% 10%, rgba(120,95,255,0.28), transparent 60%),
            radial-gradient(700px 420px at 80% 20%, rgba(0,200,255,0.18), transparent 55%),
            radial-gradient(900px 600px at 60% 90%, rgba(255,77,109,0.10), transparent 60%),
            linear-gradient(180deg,#070a10 0%,#070a10 100%);
          filter:saturate(1.15);
        }
        .header h1{ margin:0 0 6px 0; font-size:28px; letter-spacing:.2px; }
        .header p{ margin:0 0 14px 0; color:#9aa7b6; line-height:1.5; max-width: 760px; }
        .btnRow{ display:flex; gap:10px; flex-wrap:wrap; margin: 12px 0 6px; }
        .btn{
          padding:10px 12px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color:#e8eef7;
          cursor:pointer;
          font-weight:700;
        }
        .btnPrimary{
          background: linear-gradient(90deg, rgba(0,200,255,.22), rgba(120,95,255,.22));
          border: 1px solid rgba(0,200,255,.22);
        }
        .layout{ display:grid; grid-template-columns: 1.2fr 0.8fr; gap:14px; margin-top: 14px; }
        .card{
          border-radius:16px;
          border:1px solid rgba(255,255,255,.12);
          background: rgba(15,20,27,.72);
          backdrop-filter: blur(10px);
          padding:16px;
        }
        .card h2{ margin:0 0 12px 0; font-size:18px; }
        .grid2{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
        .fullRow{ grid-column: 1 / -1; }
        label{ display:block; color:#cdd6e3; font-size:13px; }
        input, select{
          width:100%;
          margin-top:6px;
          padding:10px 12px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,.12);
          background: rgba(10,15,22,.9);
          color:#e8eef7;
          outline: none;
        }
        input:focus, select:focus{
          border-color: rgba(0,200,255,.35);
          box-shadow: 0 0 0 3px rgba(0,200,255,.12);
        }
        select:disabled{ opacity:.6; cursor:not-allowed; }
        .hintCard{
          margin-top:12px;
          padding:12px;
          border-radius:14px;
          border:1px dashed rgba(255,255,255,.16);
          background: rgba(10,15,22,.6);
          color:#9aa7b6;
          font-size: 13px;
        }
        .hintCard ul{ margin:8px 0 0; padding-left:18px; line-height:1.5; }
        .rec p{ margin:8px 0; }
        .muted{ color:#9aa7b6; }
        .disclaimer{ margin-top:12px; font-size:12px; color:#9aa7b6; }

        @media (max-width: 900px){
          .layout{ grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
