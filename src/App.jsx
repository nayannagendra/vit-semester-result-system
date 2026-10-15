
import { useState } from "react";
import "./App.css";

const subjects = [
  "Web Technologies",
  "Data Structures and Algorithms",
  "Computer Networks",
  "Data Science",
];

const emptyMarks = subjects.map(() => ({ mse: "", ese: "" }));

function App() {
  const [student, setStudent] = useState({
    name: "",
    prn: "",
    branch: "Computer Science and Engineering",
    semester: "5",
  });

  const [marks, setMarks] = useState(emptyMarks);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  function updateStudent(event) {
    const { name, value } = event.target;
    setStudent((previous) => ({ ...previous, [name]: value }));
    setResult(null);
  }

  function updateMarks(index, field, value) {
    setMarks((previous) =>
      previous.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
    setResult(null);
  }

  function calculateResult(event) {
    event.preventDefault();

    const newErrors = {};

    if (!student.name.trim()) {
      newErrors.name = "Please enter the student name.";
    }

    if (!student.prn.trim()) {
      newErrors.prn = "Please enter the PRN or roll number.";
    }

    marks.forEach((item, index) => {
      if (item.mse === "" || item.ese === "") {
        newErrors[index] = "Please enter both MSE and ESE marks.";
        return;
      }

      const mse = Number(item.mse);
      const ese = Number(item.ese);

      if (
        !Number.isInteger(mse) ||
        !Number.isInteger(ese) ||
        mse < 0 ||
        mse > 30 ||
        ese < 0 ||
        ese > 100
      ) {
        newErrors[index] =
          "MSE must be 0–30 and ESE must be 0–100. Use whole numbers.";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setResult(null);
      return;
    }

    const calculatedSubjects = marks.map((item, index) => {
      const mse = Number(item.mse);
      const ese = Number(item.ese);
      const finalMarks = mse + ese * 0.7;

      return {
        name: subjects[index],
        mse,
        ese,
        finalMarks,
        passed: finalMarks >= 40,
      };
    });

    const total = calculatedSubjects.reduce(
      (sum, item) => sum + item.finalMarks,
      0
    );

    setResult({
      subjects: calculatedSubjects,
      total,
      percentage: (total / 400) * 100,
      passed: calculatedSubjects.every((item) => item.passed),
    });
  }

  function resetForm() {
    setStudent({
      name: "",
      prn: "",
      branch: "Computer Science and Engineering",
      semester: "5",
    });
    setMarks(subjects.map(() => ({ mse: "", ese: "" })));
    setErrors({});
    setResult(null);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="college-brand">
           <img
             src="/vit-logo.png"
             alt="VIT Pune Logo"
             className="college-logo"
           />
          <div className="college-details">
            <h2>Vishwakarma Institute of Technology, Pune</h2>
            <p>ENGINEERING ACADEMIC PORTAL</p>
          </div>
        </div>
        <span className="portal-label">STUDENT RESULTS</span>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <span className="eyebrow">ACADEMIC SERVICES / RESULTS</span>
          <h1>Semester Result System</h1>
          <p>
            Enter your academic details and marks to generate
            a subject-wise semester result.
          </p>
        </section>

        <form onSubmit={calculateResult} noValidate>
          <section className="card">
            <div className="section-title">
              <span className="step-number">01</span>
              <div>
                <h2>Student Information</h2>
                <p>Enter the details for this semester.</p>
              </div>
            </div>

            <div className="form-grid">
              <label>
                Student Name <span className="required">*</span>
                <input
                  name="name"
                  value={student.name}
                  onChange={updateStudent}
                  placeholder="Enter full name"
                />
                {errors.name && <small className="error">{errors.name}</small>}
              </label>

              <label>
                PRN / Roll Number <span className="required">*</span>
                <input
                  name="prn"
                  value={student.prn}
                  onChange={updateStudent}
                  placeholder="Enter PRN or roll number"
                />
                {errors.prn && <small className="error">{errors.prn}</small>}
              </label>

              <label>
                Engineering Branch
                <select
                  name="branch"
                  value={student.branch}
                  onChange={updateStudent}
                >
                  <option>Computer Science and Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics and Telecommunication</option>
                  <option>Artificial Intelligence and Data Science</option>
                  <option>Mechanical Engineering</option>
                </select>
              </label>

              <label>
                Semester
                <select
                  name="semester"
                  value={student.semester}
                  onChange={updateStudent}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="card">
            <div className="section-title">
              <span className="step-number">02</span>
              <div>
                <h2>Subject-wise Marks</h2>
                <p>
                  Enter MSE out of 30 and ESE out of 100 for each subject.
                </p>
              </div>
            </div>

            <div className="marks-table">
              <div className="table-header">
                <span>Subject Name</span>
                <span>MSE / 30</span>
                <span>ESE / 100</span>
              </div>

              {subjects.map((subject, index) => (
                <div className="subject-row" key={subject}>
                  <div className="subject-name">
                    <span className="subject-code">0{index + 1}</span>
                    <span>{subject}</span>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    value={marks[index].mse}
                    onChange={(event) =>
                      updateMarks(index, "mse", event.target.value)
                    }
                    placeholder="0–30"
                    aria-label={`${subject} MSE`}
                  />

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={marks[index].ese}
                    onChange={(event) =>
                      updateMarks(index, "ese", event.target.value)
                    }
                    placeholder="0–100"
                    aria-label={`${subject} ESE`}
                  />

                  {errors[index] && (
                    <small className="error row-error">{errors[index]}</small>
                  )}
                </div>
              ))}
            </div>

            <div className="formula-note">
              <span>ⓘ</span>
              <p>
                <strong>Calculation:</strong> Final marks = MSE + (ESE × 0.70).
                Each final subject score is out of 100. This demo uses 40/100
                as a sample passing threshold, not an official college rule.
              </p>
            </div>

            <div className="button-row">
              <button className="calculate-btn" type="submit">
                Calculate Semester Result <span>→</span>
              </button>
              <button className="reset-btn" type="button" onClick={resetForm}>
                Reset Form
              </button>
            </div>
          </section>
        </form>

        {result && (
          <section className="card result-card">
            <div className="result-heading">
              <div>
                <span className="eyebrow">RESULT GENERATED</span>
                <h2>Semester Marksheet</h2>
                <p>
                  {student.name} · {student.prn}
                </p>
                <p>
                  {student.branch} · Semester {student.semester}
                </p>
              </div>
              <span className={`result-status ${result.passed ? "pass" : "fail"}`}>
                {result.passed ? "PASS" : "FAIL"}
              </span>
            </div>

            <div className="summary-grid">
              <div className="summary-box">
                <span>Total Marks</span>
                <strong>{result.total.toFixed(2)} / 400</strong>
              </div>
              <div className="summary-box">
                <span>Percentage</span>
                <strong>{result.percentage.toFixed(2)}%</strong>
              </div>
              <div className="summary-box">
                <span>Subjects Passed</span>
                <strong>
                  {result.subjects.filter((item) => item.passed).length} / 4
                </strong>
              </div>
            </div>

            <div className="result-table">
              <div className="result-table-header">
                <span>Subject</span>
                <span>MSE</span>
                <span>ESE</span>
                <span>Final</span>
              </div>

              {result.subjects.map((item) => (
                <div className="result-table-row" key={item.name}>
                  <span>{item.name}</span>
                  <span>{item.mse}</span>
                  <span>{item.ese}</span>
                  <strong>{item.finalMarks.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <p className="disclaimer">
              This is a student assignment prototype, not an official VIT Pune
              marksheet.
            </p>
            <button className="reset-btn print-btn" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
          </section>
        )}
      </main>

      <footer className="footer">
        <strong>VIT PUNE</strong> · React Semester Result System · Academic Project
      </footer>
    </div>
  );
}

export default App;
