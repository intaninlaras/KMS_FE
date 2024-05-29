import React, { useEffect, useState } from "react";
import { API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import DropDown from "../../part/Dropdown";
import Filter from "../../part/Filter";
import CardKonfirmasi from "../../part/CardKonfirmasi";
import Icon from "../../part/Icon";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function KonfrimasiAnggotaIndex({ onChangePage }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [listAnggota, setListAnggota] = useState([]);

  const getListKK = async () => {
    setIsError({ error: false, message: "" });
    setIsLoading(true);

    try {
      let data = await UseFetch(API_LINK + "KKs/GetDataKKbyProdi");

      if (data === "ERROR") {
        throw new Error(
          "Terjadi kesalahan: Gagal mengambil daftar Kelompok Keahlian."
        );
      } else if (data.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await getListKK(); // Retry if no data
      } else {
        setCurrentData(data);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      setIsError({ error: true, message: e.message });
    }
  };

  const getListAnggota = async (idKK, index) => {
    try {
      while (true) {
        let data = await UseFetch(API_LINK + "AnggotaKK/GetAnggotaKK", {
          page: 1,
          query: "",
          sort: "[Nama Anggota] ASC",
          status: "",
          kke_id: idKK,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar anggota.");
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListAnggota((prevListAnggota) => {
            const newListAnggota = [...prevListAnggota];
            newListAnggota[index] = data[0] === "data kosong" ? [] : data;
            return newListAnggota;
          });
          break;
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: e.message,
      }));
    }
  };

  useEffect(() => {
    getListKK();
  }, []);

  useEffect(() => {
    if (currentData.length > 0) {
      currentData.forEach((val, index) => {
        getListAnggota(val.Key, index);
      });
    }
  }, [currentData]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="d-flex flex-column">
          {isError.error && (
            <div className="flex-fill">
              <Alert type="danger" message={isError.message} />
            </div>
          )}
          <div className="flex-fill">
            <div className="container">
              <div className="row mt-3 gx-4">
                {currentData
                  .filter((value) => {
                    return value.Status === "Aktif";
                  })
                  .map((value, index) => (
                    <CardKonfirmasi
                      key={value.Key}
                      data={value}
                      anggotas={listAnggota[index] || []}
                      onChangePage={onChangePage}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
