import React, { useEffect, useState } from "react";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import Label from "../../part/Label";
import FileUpload from "../../part/FileUpload";
import Icon from "../../part/Icon";
import { API_LINK } from "../../util/Constants";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "ID Lampiran": null,
    Lampiran: null,
    Karyawan: null,
    Status: null,
    Count: 0,
  },
];

export default function PengajuanDetail({ onChangePage, withID }) {
  console.log(JSON.stringify(withID));
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [lampiranCount, setLampiranCount] = useState(1);
  const [detail, setDetail] = useState(inisialisasiData);

  if (isLoading) return <Loading />;

  const handleTambahLampiran = () => {
    setLampiranCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const fetchDataUser = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "Pengajuans/GetDetailLampiran", {
          p1: 1,
          p2: "[ID Lampiran] ASC",
          p3: withID.Key,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil Detail Lampiran.");
        } else {
          const formattedData = data.map(item => ({
            ...item,
          }));
          console.log("for: " + JSON.stringify(formattedData));
          const promises = formattedData.map((value) => {
            const filePromises = [];

            if (value["Lampiran"]) {
              const filePromise = fetch(
                API_LINK +
                `Utilities/Upload/DownloadFile?namaFile=${encodeURIComponent(
                  value["Lampiran"]
                )}`
              )
                .then((response) => response.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  value.Lampiran = url;
                  return value;
                })
                .catch((error) => {
                  console.error("Error fetching file:", error);
                  return value;
                });
              filePromises.push(filePromise);
            }

            return Promise.all(filePromises).then((results) => {
              const updatedValue = results.reduce((acc, curr) => ({ ...acc, ...curr }), value);
              return updatedValue;
            });

          });

          Promise.all(promises)
            .then((updatedData) => {
              console.log("Updated data with blobs:", updatedData);
              setDetail(updatedData);
            })
            .catch((error) => {
              console.error("Error updating currentData:", error);
            });
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setDetail(null);
      }
    };

    fetchDataUser();
  }, []);

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Pengajuan Kelompok Keahlian
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Label title="Nama" data="Nicholas Saputra" />
              </div>
              <div className="col-lg-6">
                <Label title="Jabatan" data="UPT Manajemen Informatika" />
              </div>
              <div className="col-lg-12 my-3">
                <Label title="Kelompok Keahlian" data={withID.Nama} />
              </div>
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header fw-medium">
                    Lampiran Pendukung
                  </div>
                  <div className="card-body p-4">
                    {detail.map((item, index) => (
                      <Label
                        key={index}
                        title={`Lampiran ${index + 1}`}
                        data={item.Lampiran ? <a href={item.Lampiran} target="_blank" rel="noopener noreferrer">Tampilkan Berkas</a> : "Tidak ada lampiran"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("index")}
          />
        </div>
      </form>
    </>
  );
}
