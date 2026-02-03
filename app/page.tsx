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
    </main>
  );
}
