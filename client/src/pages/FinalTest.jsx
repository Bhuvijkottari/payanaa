import React, { useEffect, useState, useRef } from "react";
import questionsData from "../assets/questions.json"; // adjust path if needed
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ATTEMPT_KEY_PREFIX = "payaamn_attempts_";
const RESULTS_KEY_PREFIX = "payaamn_results_";

export default function FinalTest() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [name, setName] = useState("");
  const [attemptNo, setAttemptNo] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(25).fill(null)); // selected index per question
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(null);
  const [pass, setPass] = useState(false);
  const [violation, setViolation] = useState(false);
  const watermarkRef = useRef(null);
  const [waterPos, setWaterPos] = useState({ top: "10%", left: "10%" });
  const [showCertificateBox, setShowCertificateBox] = useState(false);

  useEffect(() => {
    // move watermark every 3s if test running
    let t;
    if (inProgress) {
      t = setInterval(() => {
        const top = `${10 + Math.floor(Math.random() * 70)}%`;
        const left = `${10 + Math.floor(Math.random() * 70)}%`;
        setWaterPos({ top, left });
      }, 3000);
    }
    return () => clearInterval(t);
  }, [inProgress]);

  useEffect(() => {
    // block context menu & some keys (best effort)
    const onContext = (e) => inProgress && e.preventDefault();
    const onKey = (e) => {
      if (!inProgress) return;
      // block print/save/devtools shortcuts (best-effort)
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s")) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("contextmenu", onContext);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("keydown", onKey);
    };
  }, [inProgress]);

  useEffect(() => {
    // visibility change -> immediate violation/submit
    const onVis = () => {
      if (!inProgress) return;
      if (document.hidden) {
        // Tab switched or minimized
        setViolation(true);
        // auto-submit
        submitTest("tab-switch");
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [inProgress, answers, currentIndex]);

  const startTest = async () => {
    if (!name.trim()) return alert("தயவு செய்து உங்கள் பெயரை உள்ளிடவும் (Enter your name).");
    // attempts stored per name key
    const key = ATTEMPT_KEY_PREFIX + name.trim();
    const attemptsUsed = parseInt(localStorage.getItem(key) || "0", 10);
    if (attemptsUsed >= 3) {
      return alert("மன்னிக்கவும் — நீங்கள் மூன்று முறைகளை ஏற்கனவே பயன்படுத்திவிட்டீர்கள்.");
    }
    // increment attempt
    localStorage.setItem(key, String(attemptsUsed + 1));
    setAttemptNo(attemptsUsed + 1);

    // go fullscreen (best-effort)
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.warn("Fullscreen request denied or not supported.", e);
    }

    setShowInstructions(false);
    setInProgress(true);
    setCurrentIndex(0);
    setAnswers(Array(25).fill(null));
    setFinished(false);
    setScore(null);
    setPass(false);
    setViolation(false);
  };

  const selectOption = (qIndex, optIndex) => {
    if (!inProgress || finished) return;
    const copy = [...answers];
    copy[qIndex] = optIndex;
    setAnswers(copy);
  };

  const nextQ = () => {
    if (answers[currentIndex] === null) {
      return alert("முன்னே செல்க: குறைந்தது ஒரு தேர்வைத் தேர்ந்தெடுக்கவும் (Please choose an option).");
    }
    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      // last -> submit
      submitTest("finished");
    }
  };

  const prevQ = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  const submitTest = (reason = "manual") => {
    if (!inProgress || finished) return;
    setInProgress(false);
    setFinished(true);

    // compute score
    let correctCount = 0;
    questionsData.forEach((q, i) => {
      if (answers[i] !== null && answers[i] === q.answerIndex) correctCount++;
    });
    const totalScore = correctCount * 2;
    setScore(totalScore);
    setPass(totalScore > 25);

    // save attempt result to localStorage
    const resultKey = RESULTS_KEY_PREFIX + name.trim();
    const existing = JSON.parse(localStorage.getItem(resultKey) || "[]");
    const attemptRecord = {
      attemptNo,
      timestamp: new Date().toISOString(),
      answers,
      score: totalScore,
      pass: totalScore > 25,
      reason
    };
    existing.push(attemptRecord);
    localStorage.setItem(resultKey, JSON.stringify(existing));

    // exit fullscreen (best-effort)
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    // if passed -> prepare certificate
    if (totalScore > 25) {
      setShowCertificateBox(true);
    }
  };

  // Certificate generation using html2canvas + jsPDF
  const generateCertificate = async () => {
    const el = document.getElementById("certificateBox");
    if (!el) return alert("Certificate element not found.");
    try {
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${name}_Payaamn_Certificate.pdf`);
    } catch (err) {
      console.error(err);
      alert("Certificate generation failed.");
    }
  };

  const quitAndReset = () => {
    // exit fullscreen
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setShowInstructions(true);
    setInProgress(false);
    setFinished(false);
    setAnswers(Array(25).fill(null));
    setCurrentIndex(0);
    setScore(null);
    setPass(false);
    setViolation(false);
  };

  // UI helpers
  const q = questionsData[currentIndex];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Embedded styling: neon gaming theme */}
      <style>{`
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:9999;
        }
        .modal {
          background: linear-gradient(135deg,#0f172a,#001219);
          padding: 22px; border-radius: 12px; width: 92%; max-width: 920px; color: #fff;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.06);
        }
        h2.glow { color: #fff; text-shadow: 0 0 8px #ff0080, 0 0 16px #40e0d0; }
        .btn {
          background: linear-gradient(90deg,#ff0080,#ff8c00);
          color: #fff; padding: 10px 14px; border-radius: 10px; border: none; cursor:pointer; font-weight:600;
          box-shadow: 0 6px 18px rgba(255,140,0,0.12);
        }
        .btn.secondary {
          background: linear-gradient(90deg,#111827,#374151);
        }
        .question-card {
          background: linear-gradient(135deg,#061826, #052b3a);
          padding: 18px; border-radius: 12px; color: #fff; margin-bottom: 14px;
          box-shadow: 0 6px 30px rgba(2,6,23,0.6);
        }
        .option {
          background: linear-gradient(90deg,#0f172a,#0b1220);
          border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor:pointer; border:1px solid rgba(255,255,255,0.04);
        }
        .option.selected { outline: 2px solid #ff8c00; box-shadow: 0 8px 24px rgba(255,140,0,0.12);}
        .progress {
          height: 10px; background: rgba(255,255,255,0.08); border-radius: 8px; overflow:hidden; margin-bottom: 12px;
        }
        .progress > div { height:100%; background: linear-gradient(90deg,#40e0d0,#ff0080); transition: width .4s ease; }
        .watermark {
          position: fixed; z-index: 9998; pointer-events: none; opacity: 0.12; font-weight:700;
          color: #fffbdd; font-size: 18px; text-shadow: 0 0 8px #000;
        }
        .cert {
          width: 900px; height: 600px; padding: 40px; background: linear-gradient(135deg,#fff7ed,#fffaf0); color: #0b1220;
          border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align:center;
        }
      `}</style>

      {/* Instructions modal */}
      {showInstructions && (
        <div className="overlay">
          <div className="modal">
            <h2 className="glow">Final Test Instructions</h2>
            <ol style={{ lineHeight: 1.8, marginTop: 12 }}>
              <li>25 கேள்விகள் — ஒவ்வொன்றுக்கும் 2 மதிப்பெண் (மொத்தம் 50).</li>
              <li>1–10: எழுத்துகள் | 11–20: சொற்களின் பொருள் | 21–25: கட்டுரை வாசித்து கேள்விகளுக்கு பதில்.</li>
              <li>மொத்த மூன்று (3) முயற்சிகள் மட்டுமே. முயற்சிகள் முடிந்தால் மறுபடி முயற்சி செய்ய முடியாது.</li>
              <li>டெஸ்ட் தொடங்கும் போது தானியங்கி முழுநீச்சல் (fullscreen) முறைஇல் செல்லும்.</li>
              <li>டேப் ஸ்விட்சிங் (tab switch) அல்லது பக்கம் மறைப்பது கண்டறியப்பட்டால் டெஸ்ட் உடனடியாக சமர்ப்பிக்கப்படும் மற்றும் அந்த முயற்சி செலவாகும்.</li>
              <li>ஸ்கிரீன்ஷாட்/ஸ்கிரீன் ரெகார்டிங் தடுப்பது impossible (வெளிப்புற அமைப்புகளால்) — watermark இருக்கும் மற்றும் இது ஒரு தடுப்பு.</li>
              <li>50 இல் 26 அல்லது அதற்கு மேல் பெறுமானம் பெற்றால் தேர்ச்சி (pass) வழங்கப்படும் மற்றும் Payaamn சான்றிதழ் உருவாக்கப்படும்.</li>
            </ol>

            <div style={{ marginTop: 14 }}>
              <label style={{ display: "block", marginBottom: 8 }}>உங்கள் பெயர் (Your name):</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="உங்கள் பெயரை எழுதி Start பட்டனை அழுத்தவும்"
                style={{
                  padding: "10px 12px",
                  width: "100%",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.12)",
                  marginBottom: 10,
                  background: "#071027",
                  color: "#fff"
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" onClick={startTest}>Start Test (Start & Go Fullscreen)</button>
                <button className="btn secondary" onClick={() => { setShowInstructions(false); }}>Preview UI (No fullscreen)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watermark */}
      {inProgress && (
        <div
          ref={watermarkRef}
          className="watermark"
          style={{ top: waterPos.top, left: waterPos.left }}
        >
          {name} • {new Date().toLocaleString()}
        </div>
      )}

      {/* Test area */}
      <div style={{ padding: 22, maxWidth: 1100, margin: "24px auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Final Test — Payaamn</h2>
            <div style={{ color: "#94a3b8", marginTop: 6 }}>
              Attempt: {attemptNo || "-"} {inProgress ? "| In progress" : finished ? "| Finished" : ""}
            </div>
          </div>
          <div>
            <button className="btn secondary" onClick={() => {
              if (!inProgress) quitAndReset();
              else if (confirm("Test is running. Are you sure you want to quit? This attempt will be submitted.")) submitTest("quit");
            }}>{inProgress ? "Submit Now" : "Back"}</button>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 10 }}>
          <div className="progress">
            <div style={{ width: `${((currentIndex + 1) / questionsData.length) * 100}%` }} />
          </div>
          <div style={{ color: "#94a3b8", marginTop: 6 }}>
            Question {currentIndex + 1} of {questionsData.length}
          </div>
        </div>

        {/* If not started and we dismissed instructions preview */}
        {!inProgress && !finished && !showInstructions && (
          <div style={{ padding: 18, background: "#04121a", borderRadius: 10, color: "#fff" }}>
            Click <strong>Start Test</strong> from instructions to begin (full-screen & rules).
            <div style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => setShowInstructions(true)}>Open Instructions</button>
            </div>
          </div>
        )}

        {/* Question card */}
        {(inProgress || finished) && (
          <div className="question-card">
            <div style={{ fontSize: 18, marginBottom: 12 }}>
              <strong>{q.type.toUpperCase()}:</strong>&nbsp;
              <span style={{ fontSize: 22 }}>{q.prompt}</span>
            </div>

            <div>
              {q.options.map((opt, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <div
                    key={idx}
                    className={`option ${isSelected ? "selected" : ""}`}
                    onClick={() => selectOption(currentIndex, idx)}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong>&nbsp; {opt}
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <div>
                <button className="btn secondary" onClick={prevQ} disabled={currentIndex === 0}>Prev</button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={nextQ}>{currentIndex === questionsData.length - 1 ? "Finish" : "Next"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Result screen */}
        {finished && (
          <div style={{ marginTop: 18, padding: 18, background: "#021124", borderRadius: 10 }}>
            <h3>Test Complete</h3>
            <p>Score: <strong>{score}</strong> / 50 — {pass ? <span style={{ color: "#34d399" }}>PASS</span> : <span style={{ color: "#fb7185" }}>FAIL</span>}</p>
            <div style={{ display: "flex", gap: 10 }}>
              {pass && <button className="btn" onClick={generateCertificate}>Download Certificate</button>}
              <button className="btn secondary" onClick={() => {
                // allow user to view answers (simple)
                const correctCount = questionsData.reduce((acc, q, i) => acc + ((answers[i] === q.answerIndex) ? 1 : 0), 0);
                alert(`Correct answers: ${correctCount}/${questionsData.length}\nAttempts used: ${localStorage.getItem(ATTEMPT_KEY_PREFIX + name)}`);
              }}>View Summary</button>
            </div>
          </div>
        )}

        {/* Certificate hidden DOM box (styled) */}
        {showCertificateBox && (
          <div id="certificateBox" style={{ marginTop: 20, display: "none" }}>
            <div className="cert" id="cert-inner" style={{ background: "#fffaf0", color: "#0b1220" }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>Payana Certificate of Completion</div>
              <div style={{ marginTop: 18, fontSize: 20 }}>This certifies that</div>
              <div style={{ marginTop: 8, fontSize: 34, fontWeight: 800 }}>{name}</div>
              <div style={{ marginTop: 12, fontSize: 18 }}>has successfully passed the tamil Final Test</div>
              <div style={{ marginTop: 16, fontSize: 20 }}>Score: {score} / 50</div>
              <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", width: "100%", padding: "0 60px" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700 }}>Payaamn</div>
                  <div style={{ fontSize: 12 }}>www.payaamn.example</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>Date</div>
                  <div style={{ fontSize: 12 }}>{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
