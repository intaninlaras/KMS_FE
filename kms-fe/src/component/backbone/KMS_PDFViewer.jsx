import React, { useState, useEffect } from "react";
import { PAGE_SIZE, API_LINK, ROOT_LINK } from "../util/Constants";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Alert from "../part/Alert";
import Loading from "../part/Loading";

export default function KMS_PDFViewer({ pdfFileName }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

//   useEffect(() => {
//     if (pdfUrl) {
//       setIsLoading(false);
//     } else {
//       setIsError(true);
//       setIsLoading(false);
//     }
//   }, [pdfUrl]);
useEffect(() => {
    if (pdfFileName) {
      const url = `/${pdfFileName}`;
      setPdfUrl(url);
      setIsLoading(false);
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  }, [pdfFileName]);

  return (
    <>
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data PDF."
            />
          </div>
        )}
        <div className="flex-fill">
          {pdfUrl && (
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
            <div style={{ height: '750px' }}>
                <Viewer 
                    fileUrl={pdfUrl} 
                    plugins={[defaultLayoutPluginInstance]}
                />
            </div>
            </Worker>
          )}
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {!pdfUrl && (
                <div className="alert alert-warning">
                  PDF tidak tersedia
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
