import { useState, useEffect } from "react";
import Button from "../../part/Button";
import Alert from "../../part/Alert";
import { Stepper } from 'react-form-stepper';

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
            const imageElement = document.getElementById("image");
            const videoElement = document.getElementById("video");
            
            if (imageElement && videoElement) {
                const imageHeight = imageElement.clientHeight;
                const videoHeight = videoElement.clientHeight;
                const maxHeight = Math.max(imageHeight, videoHeight);
                setPdfHeight(`${maxHeight}px`);
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
                <div>Loading...</div>
            ) : (
                <form>
                    <div>
                        <Stepper
                            steps={[
                                { label: 'Pretest', onClick: () => onChangePage("pretestAdd") },
                                { label: 'Materi', onClick: () => onChangePage("courseAdd") },
                                { label: 'Sharing Expert', onClick: () => onChangePage("sharingAdd") },
                                { label: 'Forum', onClick: () => onChangePage("forumAdd") },
                                { label: 'Post Test', onClick: () => onChangePage("posttestAdd") }
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
                            <h3 className="card-title">{withID.Judul}</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
                        <img
                            id="image"
                            src={withID.Gambar}
                            alt="gambar"
                            className="img-fluid"
                            style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
                        />
                        {withID.File_video && isValidUrl(withID.File_video) ? (
                            <video
                                id="video"
                                controls
                                width="100%"
                                height="auto"
                                style={{ marginBottom: "10px" }}
                            >
                                <source src={withID.File_video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <p>Video tidak tersedia atau URL tidak valid.</p>
                        )}
                    </div>
                    <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
                        <object
                            data={withID.File_pdf}
                            type="application/pdf"
                            width="100%"
                            style={{ height: pdfHeight }}
                        >
                            <p>Maaf, browser Anda tidak mendukung Preview File. Silakan <a href={withID.File_pdf}>unduh File</a> untuk melihatnya.</p>
                        </object>
                    </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <h4 className="mb-3 mt-0">Deskripsi</h4>
                                    <p className="pb-3">{withID.Keterangan}</p>
                                    <h4 className="mb-3 mt-0">Pengenalan</h4>
                                    <p className="pb-3">{withID.Pengenalan}</p>
                                    <h4 className="mb-3 mt-0">Kata Kunci</h4>
                                    <p className="text-dark fw-medium mb-0">
                                        {Array.isArray(withID["Kata Kunci"])
                                            ? withID["Kata Kunci"].join(", ")
                                            : withID["Kata Kunci"]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end my-4 mx-1">
                        <Button
                            classType="btn btn-outline-secondary me-2 px-4 py-2"
                            label="Kembali"
                            onClick={() => onChangePage("index")}
                        />
                    </div>
                </form>
            )}
        </>
    );
}
