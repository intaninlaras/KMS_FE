import React, { useState } from "react";

export default function KMS_Sidebar({ questionNumbers, selectedQuestion, setSelectedQuestion }) {
  return (
    <div className="border-end h-100 pt-2 overflow-y-auto">
      <div className="card mb-3 p-3 mx-auto" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: "fit-content" }}>
        <p className="m-0">Waktu Tersisa: 00:29:29</p>
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex">
          {questionNumbers.slice(0, 5).map((number) => (
            <button
              key={number}
              className={`btn btn-outline-secondary mb-2 me-2 ${
                number + 1 === selectedQuestion ? "active" : ""
              }`}
              style={{ width: "40px", height: "40px", marginRight: "30px" }}
              onClick={() => setSelectedQuestion(number + 1)}
            >
              {number + 1}
            </button>
          ))}
        </div>
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} className="d-flex">
            {questionNumbers.slice(row * 5 + 5, row * 5 + 10).map((number) => (
              <button
                key={number}
                className={`btn btn-outline-secondary mb-2 me-2 ${
                  number + 1 === selectedQuestion ? "active" : ""
                }`}
                style={{ width: "40px", height: "40px", marginRight: "30px" }}
                onClick={() => setSelectedQuestion(number + 1)}
              >
                {number + 1}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
