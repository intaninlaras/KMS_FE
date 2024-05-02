import React, { useState, useEffect } from "react";

export default function KMS_Sidebar({ questionNumbers, selectedQuestion, setSelectedQuestion }) {
  const [remainingTime, setRemainingTime] = useState(1800);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-end h-100 pt-2 overflow-y-auto">
      <div className="card mb-3 p-3 mx-auto" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: "fit-content" }}>
          <p className="m-0">Waktu Tersisa: {formatTime(remainingTime)}</p>
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
