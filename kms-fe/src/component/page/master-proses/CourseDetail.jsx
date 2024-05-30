import { useState } from "react";
import Button from "../../part/Button";

export default function MasterMateriDetail({ onChangePage, withID }) {
    const [isError, setIsError] = useState({ error: false, message: "" });
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <div className="card" style={{ borderColor: "#67ACE9" }}>
                <div className="card-header fw-medium text-white" style={{ backgroundColor: "#67ACE9" }}>
                    <h3 className="card-title">{withID.Judul}</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
                            <img
                                src={withID.Gambar}
                                alt="gambar"
                                className="img-fluid"
                                style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
                            />
                            <h4 className="mt-3">Video</h4>
                            {withID.File_vidio && (
                                <video controls width="100%" height="auto">
                                    <source src={withID.File_vidio} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                        <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
                            <h4 className="mt-3">PDF</h4>
                            {withID.File_pdf && (
                                <embed
                                    src={withID.File_pdf}
                                    type="application/pdf"
                                    width="100%"
                                    height="auto"
                                />
                            )}
                        </div>
                    </div>
                    <div className="row mt-3">
                    <div className="col-md-12">
                            {/* <h1 className="mb-3 mt-0 text-center">{withID.Judul}</h1> */}
                            <h4 className="mb-3 mt-0">Deskripsi</h4>
                            <p className="pb-3">{withID.Keterangan}</p>
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
                    classType="btn btn-outline-secondary me-2 px-4 py-2"
                    label="Kembali"
                    onClick={() => onChangePage("index")}
                />
            </div>
        </>
    );
}
