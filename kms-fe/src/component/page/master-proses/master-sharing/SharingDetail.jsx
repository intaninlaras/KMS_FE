import React, { useState, useEffect } from "react";
import Button from "../../../part/Button";
import Alert from "../../../part/Alert";
import { Stepper } from "react-form-stepper";
import AppContext_test from "../MasterContext";
import Loading from "../../../part/Loading";

export default function DetailSharingExpert({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true); // Set initial loading to true
  const [pdfHeight, setPdfHeight] = useState("500px");

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    const calculatePdfHeight = () => {
      const videoElement = document.getElementById("video");

      if (videoElement) {
        const videoHeight = videoElement.clientHeight;
        setPdfHeight(`${videoHeight}px`);
      }
    };

    calculatePdfHeight();

    window.addEventListener("resize", calculatePdfHeight);

    return () => {
      window.removeEventListener("resize", calculatePdfHeight);
    };
  }, []);

  if (isLoading) return <Loading />;

  const hasVideo = withID.Sharing_video;
  const hasPDF = withID.Sharing_pdf;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form>
        <div>
          <Stepper
            steps={[
              { label: 'Materi', onClick: () => onChangePage("courseAdd") },
              { label: 'Pretest', onClick: () => onChangePage("pretestAdd") },
              { label: "Sharing Expert", onClick: () => onChangePage("sharingDetail") },
              { label: "Forum", onClick: () => onChangePage("forumDetail") },
              { label: "Post Test", onClick: () => onChangePage("posttestDetail") },
            ]}
            activeStep={2}
            styleConfig={{
              activeBgColor: "#67ACE9",
              activeTextColor: "#FFFFFF",
              completedBgColor: "#67ACE9",
              completedTextColor: "#FFFFFF",
              inactiveBgColor: "#E0E0E0",
              inactiveTextColor: "#000000",
              size: "2em",
              circleFontSize: "1rem",
              labelFontSize: "0.875rem",
              borderRadius: "50%",
              fontWeight: 500,
            }}
            connectorStyleConfig={{
              completedColor: "#67ACE9",
              activeColor: "#67ACE9",
              disabledColor: "#BDBDBD",
              size: 1,
              stepSize: "2em",
              style: "solid",
            }}
          />
        </div>

        {hasVideo || hasPDF ? (
          <div className="row">
            {hasPDF ? (
              <div className="col-lg-12">
                <div className="card mt-4" style={{ borderColor: "#67ACE9" }}>
                  <div className="card-header fw-medium text-white" style={{ backgroundColor: "#67ACE9" }}>
                    <h5 className="card-title">Sharing Expert (PDF)</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <object
                        data={withID.Sharing_pdf}
                        type="application/pdf"
                        width="100%"
                        height={pdfHeight}
                        style={{ maxHeight: "70vh", marginBottom: "20px" }}
                      >
                        <p>
                          Maaf, browser Anda tidak mendukung preview file. Silakan{" "}
                          <a href={withID.Sharing_pdf}>unduh file</a> untuk melihatnya.
                        </p>
                      </object>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {hasVideo ? (
              <div className="col-lg-12">
                <div className="card mt-4" style={{ borderColor: "#67ACE9" }}>
                  <div className="card-header fw-medium text-white" style={{ backgroundColor: "#67ACE9" }}>
                    <h5 className="card-title">Sharing Expert Video</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <video
                        id="video"
                        controls
                        width="100%"
                        height="auto"
                        style={{ maxWidth: "100%", marginBottom: "20px" }}
                      >
                        <source src={withID.Sharing_video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="card" style={{ borderColor: "#67ACE9" }}>
            <div className="card-header fw-medium text-white" style={{ backgroundColor: "#67ACE9" }}>
              Detail Sharing Expert
            </div>
            <div className="card-body">
              <Alert type="info" message={(
                <span>
                  Data Sharing Expert belum ditambahkan. <a onClick={() => onChangePage("sharingAddNot", AppContext_test.DetailMateri)} className="text-primary">Tambah Data</a>
                </span>
              )} />
              {/* <div className="alert alert-warning" role="alert">
              </div> */}
            </div>
          </div>
        )}

        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("pretestDetail", AppContext_test.DetailMateri)}
          />
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("forumDetail", AppContext_test.DetailMateri)}
          />
        </div>
      </form>
    </>
  );
}
