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
import Cookies from "js-cookie";
import { decryptId } from "../../util/Encryptor";

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
  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;

  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listNamaFile, setListNamaFile] = useState([]);
  const [detail, setDetail] = useState(inisialisasiData);
  const [userData, setUserData] = useState({
    Role: "",
    Nama: "",
    kry_id: "",
  });

  const getUserKryID = async () => {
    setIsLoading(true);
    setIsError((prevError) => ({ ...prevError, error: false }));

    try {
      while (true) {
        let data = await UseFetch(API_LINK + "Utilities/GetUserLogin", {
          param: activeUser,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil data.");
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setUserData(data[0]);
          setIsLoading(false);
          break;
        }
      }
    } catch (error) {
      setIsLoading(true);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
    }
  };

  useEffect(() => {
    getUserKryID();
  }, []);

  const getListLampiran = async () => {
    setIsError((prevError) => ({ ...prevError, error: false }));
    setIsLoading(true);

    try {
      while (true) {
        let data = await UseFetch(API_LINK + "Pengajuans/GetDetailLampiran", {
          page: 1,
          sort: "[ID Lampiran] ASC",
          akk_id: withID.Key,
        });

        if (data === "ERROR") {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil Detail Lampiran."
          );
        } else if (data.length === 0) {
          setListNamaFile([]);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListNamaFile(data);
          const formattedData = data.map((item) => ({
            ...item,
          }));
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
              const updatedValue = results.reduce(
                (acc, curr) => ({ ...acc, ...curr }),
                value
              );
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

          setIsLoading(false);
          break;
        }
      }
    } catch (error) {
      setDetail(null);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
    }
  };

  useEffect(() => {
    getListLampiran();
  }, [withID]);

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <form>
          <div className="card">
            <div className="card-header bg-primary fw-medium text-white">
              Pengajuan Kelompok Keahlian
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-6">
                  <Label title="Nama" data={userData.Nama} />
                </div>
                <div className="col-lg-6">
                  <Label title="Jabatan" data={userData.Role} />
                </div>
                <div className="col-lg-6 my-3">
                  <Label
                    title="Kelompok Keahlian"
                    data={withID["Nama Kelompok Keahlian"]}
                  />
                </div>
                <div className="col-lg-6 my-3">
                  <Label title="Status" data={withID.Status === "Menunggu Acc" ? "Menunggu Persetujuan" : withID.Status} />
                </div>
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header fw-medium">
                      Lampiran Pendukung
                    </div>
                    <div className="card-body p-4">
                      {detail?.map((item, index) => (
                        <Label
                          key={index}
                          title={`Lampiran ${index + 1}`}
                          data={
                            item.Lampiran ? (
                              <a
                                href={item.Lampiran}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {/* {listNamaFile[index]?.Lampiran} */}
                                Lampiran {index + 1} {withID["Nama Kelompok Keahlian"]}
                              </a>
                            ) : (
                              "Tidak ada lampiran"
                            )
                          }
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
      )}
    </>
  );
}
