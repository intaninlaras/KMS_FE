import { useRef, useState, useEffect } from "react";
import Button from "../../part/Button";
import FilePreview from "../../part/FilePreview";

export default function MasterDaftarPustakaDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [fileExtension, setFileExtension] = useState("");

  useEffect(() => {
    if (withID.fls) {
      let fileExt = withID.fls.split('.').pop().toLowerCase();
      setFileExtension(fileExt);
    }
  }, [withID])

  useEffect(() => {
    console.log(fileExtension)
  }, [fileExtension])

  return (
    <>
      {fileExtension === 'pdf' || fileExtension === 'mp4' ? (
        <div className="card" style={{ borderColor: "#67ACE9" }}>
          <div
            className="card-header fw-medium text-white"
            style={{ backgroundColor: "#67ACE9" }}
          >{withID.Judul}</div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-3 d-flex align-items-center justify-content-center">
                <img
                  src={withID.Gambar}
                  alt="gambar"
                  className="img-fluid"
                  style={{
                    width: "300px",
                    height: "500px",
                    marginBottom: "10px",
                  }}
                />
              </div>
              <div className="mt-0 col-lg-9 mb-2">
                <object
                  data={withID.File}
                  type={fileExtension === 'pdf' ? "application/pdf" : "application/mp4"}
                  width="100%"
                  height="500"
                >
                </object>
              </div>
              <hr />
              <div className="col-md-12">
                <h1 className="mb-3 mt-0 text-center">{withID.Judul}</h1>
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
      ) : (
        <div className="card" style={{ borderColor: "#67ACE9" }}>
          <div
            className="card-header fw-medium text-white"
            style={{ backgroundColor: "#67ACE9" }}
          >{withID.Judul}</div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-3 d-flex align-items-center justify-content-center">
                <img
                  src={withID.Gambar}
                  alt="gambar"
                  className="img-fluid"
                  style={{
                    width: "300px",
                    marginBottom: "10px",
                  }}
                />
              </div>
              <div className="mt-0 col-lg-9 mb-2">
                <h1 className="mb-3 mt-0">{withID.Judul}</h1>
                <h4 className="mb-3 mt-0">Deskripsi</h4>
                <p className="pb-3">{withID.Keterangan}</p>
                <p className="mt-3">Pratinjau untuk file {fileExtension} tidak didukung. Silahkan <a href={withID.File} download>unduh file</a> untuk melihatnya.</p>
                <p className="text-dark fw-medium mb-0">Kata kunci </p>
                <span className="mb-3">
                  {Array.isArray(withID["Kata Kunci"])
                    ? withID["Kata Kunci"].join(", ")
                    : withID["Kata Kunci"]}
                </span>
                {/* <FilePreview file={withID.file} orginalFileName={withID.fls} /> */}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="float-end my-4 mx-1">
        <Button
          classType="btn btn-secondary me-2 px-4 py-2"
          label="Kembali"
          onClick={() => onChangePage("index")}
        />
      </div>
    </>
  );
}
