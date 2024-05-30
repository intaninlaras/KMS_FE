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
                        <div className="col-lg-3 d-flex flex-column align-items-center justify-content-center">
                            <img
                                src={withID.Gambar}
                                alt="gambar"
                                className="img-fluid"
                                style={{ width: "300px", height: "auto", marginBottom: "10px" }}
                            />
                            {withID.File_vidio && (
                                <div className="mb-3">
                                    <video controls width="100%" height="250">
                                        <source src={withID.File_vidio} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            {withID.File_pdf && (
                                <div className="mt-3">
                                    <embed
                                        src={withID.File_pdf}
                                        type="application/pdf"
                                        width="100%"
                                        height="250"
                                    />
                                    <p className="mt-2 text-muted">
                                        Maaf, browser Anda tidak mendukung Preview File. Silakan unduh File untuk melihatnya.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-9">
                            <h1 className="mb-3 mt-0 text-center">{withID.Judul}</h1>
                            <h4 className="mb-3 mt-0">Deskripsi</h4>
                            <p className="pb-3">{withID.Keterangan}</p>
                            <p className="text-dark fw-medium mb-0">Kata kunci</p>
                            <span>
                                {Array.isArray(withID["Kata Kunci"])
                                    ? withID["Kata Kunci"].join(", ")
                                    : withID["Kata Kunci"]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="float-end my-4 mx-1">
                <Button
                    classType="btn btn-outline-secondary me-2 px-4 py-2"
                    label="Kembali"
                    onClick={() => onChangePage("index")}
                />
            </div>
        </>
    );
}
