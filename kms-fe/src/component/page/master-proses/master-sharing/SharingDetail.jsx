import { useState, useEffect } from "react";
import Button from "../../../part/Button";
import Alert from "../../../part/Alert";
import { Stepper } from 'react-form-stepper';
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
    console.log("Video URL: ", withID.Sharing_video);
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
  }, [withID.Sharing_video]);

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
              { label: 'Pretest', onClick: () => onChangePage("pretestDetail") },
              { label: 'Materi', onClick: () => onChangePage("courseDetail") },
              { label: 'Sharing Expert', onClick: () => onChangePage("sharingDetail") },
              { label: 'Forum', onClick: () => onChangePage("forumDetail") },
              { label: 'Post Test', onClick: () => onChangePage("posttestDetail") }
            ]}
            activeStep={2}
            styleConfig={{
              activeBgColor: '#67ACE9',
              activeTextColor: '#FFFFFF',
              completedBgColor: '#67ACE9',
              completedTextColor: '#FFFFFF',
              inactiveBgColor: '#E0E0E0',
              inactiveTextColor: '#000000',
              size: '2em',
              circleFontSize: '1rem',
              labelFontSize: '0.875rem',
              borderRadius: '50%',
              fontWeight: 500
            }}
            connectorStyleConfig={{
              completedColor: '#67ACE9',
              activeColor: '#67ACE9',
              disabledColor: '#BDBDBD',
              size: 1,
              stepSize: '2em',
              style: 'solid'
            }}
          />
        </div>

        <div className="card mt-4">
          <div className="card-header bg-outline-primary fw-medium text-black">
            Detail Sharing Expert
          </div>
          <div className="card-body p-4">
            {hasVideo || hasPDF ? (
              <div className="row">
                <div className="col-lg-6">
                  {hasVideo ? (
                    <video
                      id="video"
                      controls
                      width="100%"
                      height="auto"
                      style={{ marginBottom: "10px" }}
                    >
                      <source src={withID.Sharing_video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p>Video tidak tersedia atau URL tidak valid.</p>
                  )}
                </div>
                <div className="col-lg-6">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    {hasPDF ? (
                      <object
                        data={withID.Sharing_pdf}
                        type="application/pdf"
                        width="100%"
                        style={{ height: pdfHeight }}
                      >
                        <p>Maaf, browser Anda tidak mendukung Preview File. Silakan <a href={withID.Sharing_pdf}>unduh File</a> untuk melihatnya.</p>
                      </object>
                    ) : (
                      <p>PDF tidak tersedia atau URL tidak valid.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning" role="alert">
                Tidak ada data sharing yang tersedia.
              </div>
            )}
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("materiDetail", AppContext_test.DetailMateri)}
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
