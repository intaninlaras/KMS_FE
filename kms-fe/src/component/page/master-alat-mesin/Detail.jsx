import { useEffect, useRef, useState } from "react";
import { API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterAlatMesinDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    namaAlatMesin: "",
    jenis: "",
    gambarAlatMesin: "",
    deskripsi: "",
    statusAlatMesin: "",
  });

  useEffect(() => {
    setIsError((prevError) => {
      return { ...prevError, error: false };
    });
    UseFetch(API_LINK + "MasterAlatMesin/DetailAlatMesin", {
      id: withID,
    })
      .then((data) => {
        if (data === "ERROR" || data.length === 0) {
          setIsError((prevError) => {
            return {
              ...prevError,
              error: true,
              message: "Terjadi kesalahan: Gagal mengambil data alat/mesin.",
            };
          });
        } else formDataRef.current = { ...formDataRef.current, ...data[0] };
      })
      .then(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
          Detail Data Alat/Mesin
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-3">
              <Label
                forLabel="namaAlatMesin"
                title="Nama Alat/Mesin"
                data={formDataRef.current.namaAlatMesin}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="jenis"
                title="Jenis"
                data={formDataRef.current.jenis}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="gambarAlatMesin"
                title="Gambar Alat/Mesin"
                data={
                  formDataRef.current.gambarAlatMesin.replace("-", "") ===
                  "" ? (
                    "-"
                  ) : (
                    <a
                      href={FILE_LINK + formDataRef.current.gambarAlatMesin}
                      className="text-decoration-none"
                      target="_blank"
                    >
                      Unduh berkas
                    </a>
                  )
                }
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="deskripsi"
                title="Deskripsi"
                data={formDataRef.current.deskripsi}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="statusAlatMesin"
                title="Status"
                data={formDataRef.current.statusAlatMesin}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="float-end my-4 mx-1">
        <Button
          classType="secondary px-4 py-2"
          label="KEMBALI"
          onClick={() => onChangePage("index")}
        />
      </div>
    </>
  );
}
