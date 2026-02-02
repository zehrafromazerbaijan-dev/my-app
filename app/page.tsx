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
    // Minimal, explainable rule-based MVP for hackathon demo
    // (Not medical advice)
    if (!drug || drug === "No drug selected") return null;

    // CYP2C19 + Clopidogrel
    if (drug === "Clopidogrel" && gene === "CYP2C19") {
      if (phenotype === "Poor metabolizer") {
        return {
          level: "High risk",
          msg: "Reduced activation → lower efficacy expected.",
          rec: "Consider alternative antiplatelet therapy (per clinical guidelines).",
        };
      }
      if (phenotype === "Intermediate metabolizer") {
        return {
          level: "Moderate risk",
          msg: "Potentially reduced activation → efficacy may be lower.",
          rec: "Consider dose/therapy adjustment based on clinical context.",
        };
      }
      return {
        level: "Info",
        msg: "No major alert selected for this phenotype.",
        rec: "Proceed with standard care and monitoring.",
      };
    }

    // TPMT + Azathioprine
    if (drug === "Azathioprine" && gene === "TPMT") {
      if (phenotype === "Low activity") {
        return {
          level: "High risk",
          msg: "High toxicity risk (myelosuppression).",
          rec: "Avoid or use substantial dose reduction + close monitoring.",
        };
      }
      if (phenotype === "Intermediate activity") {
        return {
          level: "Moderate risk",
          msg: "Increased toxicity risk possible.",
          rec: "Start with reduced dose and monitor blood counts closely.",
        };
      }
      return {
        level: "Info",
        msg: "No major alert selected for this phenotype.",
        rec: "Proceed with standard care and monitoring.",
      };
    }

    // DPYD + Fluoropyrimidines
    if (
      (drug === "Fluorouracil (5-FU)" || drug === "Capecitabine") &&
      gene === "DPYD"
    ) {
      if (phenotype === "Poor function") {
        return {
          level: "High risk",
          msg: "Severe toxicity risk.",
          rec: "Avoid fluoropyrimidines or use drastically reduced dose with specialist oversight.",
        };
      }
      if (phenotype === "Intermediate function") {
        return {
          level: "Moderate risk",
          msg: "Toxicity risk increased.",
          rec: "Consider dose reduction and enhanced monitoring.",
        };
      }
      return {
        level: "Info",
        msg: "No major alert selected for this phenotype.",
        rec: "Proceed with standard care and monitoring.",
      };
    }

    // BRCA1 (risk info)
    if (gene === "BRCA1") {
      return {
        level: "Info",
        msg: "BRCA1 variants may indicate elevated cancer risk.",
        rec: "Recommend genetic counseling and guideline-based screening.",
      };
    }

    return {
      level: "Info",
      msg: "No matching rule for the current selection.",
      rec: "Try selecting a gene/drug pair listed above.",
    };
  }, [drug, gene, phenotype]);

  return (
    <main style={{ fontFamily: "Arial", padding: 28, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Genomics-Based Precision Medicine Platform</h1>
      <p style={{ marginTop: 0, color: "#333", lineHeight: 1.6 }}>
        Functional MVP (hackathon demo): clinician enters patient context + a genetic marker.
        The system returns explainable alerts and therapy guidance.
      </p>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 18,
          marginTop: 16,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Clinician input</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Patient name (optional)
            <input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g., Patient A"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </label>

          <label>
            Age
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 52"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
            Clinical condition (short)
            <input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., post-PCI antiplatelet therapy / oncology / autoimmune"
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </label>

          <label>
            Drug (example)
            <select
              value={drug}
              onChange={(e) => setDrug(e.target.value as Drug)}
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            >
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
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            >
              <option value="">Select gene</option>
              <option value="CYP2C19">CYP2C19</option>
              <option value="TPMT">TPMT</option>
              <option value="DPYD">DPYD</option>
              <option value="BRCA1">BRCA1</option>
            </select>
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
            Phenotype / Function (demo)
            <select
              value={phenotype}
              onChange={(e) => setPhenotype(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 6 }}
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
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 18,
          marginTop: 16,
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Recommendation</h2>

        {recommendation ? (
          <>
            <p style={{ margin: "8px 0" }}>
              <b>Risk level:</b> {recommendation.level}
            </p>
            <p style={{ margin: "8px 0" }}>
              <b>Why:</b> {recommendation.msg}
            </p>
            <p style={{ margin: "8px 0" }}>
              <b>Suggested action:</b> {recommendation.rec}
            </p>
            <p style={{ marginTop: 14, fontSize: 12, color: "#555" }}>
              *Demo disclaimer: This MVP is for hackathon demonstration and does not replace clinical judgment.
            </p>           

          </>
        ) : (
          <p style={{ color: "#555"}}>
            Select a drug + gene (and phenotype if available) to see the decision support output.
          </p>
        )}
      </div>
    </main>
  );
}
