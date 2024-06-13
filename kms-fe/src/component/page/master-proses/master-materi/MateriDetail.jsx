import { useState, useEffect } from "react";
import Button from "../../../part/Button";
import Alert from "../../../part/Alert";
import { Stepper } from 'react-form-stepper';
import AppContext_test from "../MasterContext";
import Loading from "../../../part/Loading";

export default function MasterMateriDetail({ onChangePage, withID }) {
    const [isError, setIsError] = useState({ error: false, message: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [pdfHeight, setPdfHeight] = useState("500px");

    useEffect(() => {
        // Simulate a loading effect
        setTimeout(() => setIsLoading(false), 1000);
    }, []);

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    useEffect(() => {
        console.log("Video URL: ", withID.File_video);
        // Calculate the maximum height of the PDF viewer when image and video are loaded
        const calculatePdfHeight = () => {
            const videoElement = document.getElementById("video");
            
            if (videoElement) {
                const videoHeight = videoElement.clientHeight;
                setPdfHeight(`${videoHeight}px`);
            }
        };

        calculatePdfHeight();

        // Re-calculate height when window is resized
        window.addEventListener("resize", calculatePdfHeight);

        return () => {
            window.removeEventListener("resize", calculatePdfHeight);
        };
    }, [withID.File_video]);

    return (
        <>
            {isError.error && (
                <div className="flex-fill">
                    <Alert type="danger" message={isError.message} />
                </div>
            )}

            {isLoading ? (
                <div> <Loading /></div>
            ) : (
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
                            activeStep={1}
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

                    <div className="card mt-4" style={{ borderColor: "#67ACE9" }}>
                        <div className="card-header fw-medium text-white" style={{ backgroundColor: "#67ACE9" }}>
                            {/* <h3 className="card-title">{withID.Judul}</h3> */}
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 d-flex align-items-center justify-content-center">
                                    <img
                                        src={withID.Gambar}
                                        alt="gambar"
                                        className="img-fluid"
                                        style={{ width: "300px", height: "500px", marginBottom:"10px" }}
                                    />
                                </div>
                                {withID.File_pdf && (
                                    <div className="mt-0 col-lg-9 mb-2">
                                        {/* <h4 className="mb-3">Pratinjau PDF</h4> */}
                                        <object data={withID.File_pdf} type="application/pdf" width="100%" height="500">
                                            <p>Maaf, browser Anda tidak mendukung Preview File. Silakan <a href={withID.File_pdf}>unduh File</a> untuk melihatnya.</p>
                                        </object>
                                    </div>
                                )}
                                {withID.File_video && isValidUrl(withID.File_video) && (
                                    <div className={`mt-0 col-lg-9 mb-2 d-flex mx-auto text-center`}>
                                        <video
                                            id="video"
                                            controls
                                            width="100%"
                                            height="500"
                                            style={{ marginBottom: "10px" }}
                                        >
                                            <source src={withID.File_video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}
                                <hr />
                                <div className="col-md-9">
                                    <h1 className="mb-3 mt-0">{withID.Judul}</h1>
                                    <h4 className="mb-3 mt-0">Deskripsi</h4>
                                    <p className="pb-3">{withID.Keterangan}</p>
                                    <p className="text-dark fw-medium mb-0">Pengenalan</p>
                                    <p className="pb-3">{withID.Pengenalan}</p>
                                    <p className="text-dark fw-medium mb-0">Kata kunci </p>
                                    <span>
                                        {Array.isArray(withID["Kata Kunci"])
                                            ? withID["Kata Kunci"].join(", ")
                                            : withID["Kata Kunci"]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="float my-4 mx-1">
                        <Button
                            classType="outline-secondary me-2 px-4 py-2"
                            label="Kembali"
                            onClick={() => onChangePage("pretestDetail",AppContext_test.DetailMateri)}
                        />
                        
                        <Button
                            classType="dark ms-3 px-4 py-2"
                            label="Berikutnya"
                            onClick={() => onChangePage("sharingDetail", AppContext_test.DetailMateri)}
                        />
                    </div>
                </form>
            )}
        </>
    );
}
