import { useRef, useState } from "react";
import Button from "../../part/Button";
// import Image from "../../../assets/images.jpg";
// import File from "../../../assets/KMS_PoltekAstra.pdf";
// import Video from "../../../assets/Video.mp4";

export default function MasterDaftarPustakaDetail({ onChangePage, withID }) {
    const [isError, setIsError] = useState({ error: false, message: "" });
    const [isLoading, setIsLoading] = useState(true);
    console.log("DA: "+withID);

    return (
        <>
            <div className="card"
                style={{ borderColor: "#67ACE9" }}
            >
                <div className="card-header fw-medium text-white"
                    style={{ backgroundColor: "#67ACE9" }}
                >
                    {/* <h3 className="card-title">{withID.Judul}</h3> */}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3 d-flex align-items-center justify-content-center">
                            <img
                                src={withID.Gambar}
                                alt="gambar"
                                className="img-fluid"
                                style={{ width: "300px", height: "400px" }}
                            />
                        </div>
                        {/* Preview PDF */}
                        <div className="mt-0 col-lg-9 mb-2">
                            {/* <h4 className="mb-3">Pratinjau PDF</h4> */}
                            {/* Ganti "file.pdf" dengan sumber PDF yang sesuai */}
                            <object data={withID.File} type="application/pdf" width="100%" height="500">
                                {/* <p>Maaf, browser Anda tidak mendukung Preview File. Silakan <a href={Video}>unduh File</a> untuk melihatnya.</p> */}
                            </object>
                        </div>
                        <hr />
                        <div className="col-md-9">
                            <h1 className="mb-3 mt-0">{withID.Judul}</h1>
                            <h4 className="mb-3 mt-0">Deskripsi</h4>
                            <p className="pb-3">{withID.Keterangan}</p>
                            <p className="text-dark fw-medium mb-0">[ Kata kunci ] </p>
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