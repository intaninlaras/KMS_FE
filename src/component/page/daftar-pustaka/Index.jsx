import { useEffect, useRef, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import Image from "../../../assets/images.jpg";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import axios from "axios";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import Loading from "../../part/Loading";
import CardPustaka from "../../part/CardPustaka";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Cookies from "js-cookie";
import { decryptId } from "../../util/Encryptor";
import SweetAlert from "../../util/SweetAlert";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Kelompok Keahlian": null,
    Judul: null,
    File: null,
    Keterangan: null,
    "Kata Kunci": null,
    Gambar: null,
    Uploader: null,
    Creadate: null,
    Status: "Aktif",
    Count: 0,
  },
];

export default function MasterDaftarPustakaIndex({ onChangePage, withID }) {
  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;
  // console.log(activeUser);
  // console.log("ID: "+withID);
  // const buttonLabel = withMenu === "kelola" ? "Tambah" : "Kelola";
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [listKK, setListKK] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    status: "Aktif",
    sort: "Judul ASC",
    kk: "",
  });

  useEffect(() => {
    console.log("filter : "+JSON.stringify(currentFilter));
  })

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();
  const searchFilterKK = useRef();

  const dataFilterSort = [
    { Value: "[Judul] ASC", Text: "Judul Pustaka [↑]" },
    { Value: "[Judul] DESC", Text: "Judul Pustaka [↓]" },
  ];

  const dataFilterKeke = [
    { Value: "Pemrograman", Text: "Pemrograman" },
    { Value: "Data Analyst", Text: "Data Analyst" },
    { Value: "Perangkat Lunak", Text: "Perangkat Lunak" },
    { Value: "Lainnya", Text: "Lainnya" },
  ];

  const dataFilterStatus = [
    { Value: "Aktif", Text: "Aktif" },
    { Value: "Tidak Aktif", Text: "Tidak Aktif" },
  ];

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        status: searchFilterStatus.current.value,
        sort: searchFilterSort.current.value,
        kk: searchFilterKK.current.value,
      };
    });
  }

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSetStatus(id) {
    setIsError(false);
    console.log("Index ID: " + id);

    SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin mengubah status data Pustaka?",
      "warning",
      "Ya",
    ).then((confirmed) => {
      if (confirmed) {
        UseFetch(API_LINK + "Pustakas/SetStatusPustaka", {
          idPustaka: id,
        })
          .then((data) => {
            if (data === "ERROR" || data.length === 0) setIsError(true);
            else {
              SweetAlert(
                "Sukses",
                "Status data Pustaka berhasil diubah menjadi " + data[0].Status,
                "success"
              );
              handleSetCurrentPage(currentFilter.page);
            }
          })
          .then(() => setIsLoading(false));
      } else {
        console.log("Operasi dibatalkan.");
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      // console.log("Filter: " + JSON.stringify(currentFilter));
      try {
        const data = await UseFetch(
          API_LINK + "Pustakas/GetDataPustaka",
          currentFilter
        );
        // console.log("Fetched data:", data);

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
          }));
          // console.log("Formatted data:", formattedData);

          const promises = formattedData.map((value) => {
            const filePromises = [];

            if (value["Gambar"]) {
              const gambarPromise = fetch(
                API_LINK +
                `Utilities/Upload/DownloadFile?namaFile=${encodeURIComponent(
                  value["Gambar"]
                )}`
              )
                .then((response) => response.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  // console.log("Gambar URL:", url);
                  value.gbr = value.Gambar;
                  value.Gambar = url; // Simpan URL blob di objek value
                  return value;
                  // return { ...value, Gambar: url };
                })
                .catch((error) => {
                  console.error("Error fetching gambar:", error);
                  return value;
                });
              filePromises.push(gambarPromise);
            }

            if (value["File"]) {
              const filePromise = fetch(
                API_LINK +
                `Utilities/Upload/DownloadFile?namaFile=${encodeURIComponent(
                  value["File"]
                )}`
              )
                .then((response) => response.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  // console.log("File URL:", url);
                  value.fls = value.File;
                  value.File = url;
                  return value;
                  // return { ...value, File: url };
                })
                .catch((error) => {
                  console.error("Error fetching file:", error);
                  return value;
                });
              filePromises.push(filePromise);
            }

            return Promise.all(filePromises).then((results) => {
              // console.log("Contents of filePromises:", filePromises);
              console.log("Results of fetching files:", results);
              const updatedValue = results.reduce((acc, curr) => ({ ...acc, ...curr }), value);
              // console.log("Updated value with blobs:", updatedValue);
              return updatedValue;
            });

          });

          Promise.all(promises)
            .then((updatedData) => {
              console.log("Updated data with blobs:", updatedData);
              setCurrentData(updatedData);
            })
            .catch((error) => {
              // console.error("Error updating currentData:", error);
            });
        }
      } catch (error) {
        setIsError(true);
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  useEffect(() => {
    const fetchDataKK = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "KKs/GetDataKK", {
          page: 1,
          query: "",
          sort: "[Nama Kelompok Keahlian] asc",
          status: "Aktif",
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else {
          // Mengubah data menjadi format yang diinginkan
          const formattedData = data.map(item => ({
            Value: item["Nama Kelompok Keahlian"],
            Text: item["Nama Kelompok Keahlian"]
          }));
          setListKK(formattedData);
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListKK([]);
      }
    };

    fetchDataKK();

  }, []);

  return (
    <>
      <div className="d-flex flex-column">
        {/* Tombol Tambah */}
        <div className="flex-fill">
          <div className="input-group">
            <Button
              iconName="add"
              classType="success"
              label={"Tambah"}
              onClick={() => onChangePage("add")}
            />
            <Input
              ref={searchQuery}
              forInput="pencarianAlatMesin"
              placeholder="Cari"
            />
            <Button
              iconName="search"
              classType="primary px-4"
              title="Cari"
              onClick={handleSearch}
            />
            <Filter>
              <DropDown
                ref={searchFilterSort}
                forInput="ddUrut"
                label="Urut Berdasarkan"
                type="none"
                arrData={dataFilterSort}
                defaultValue="[Nama Alat/Mesin] asc"
              />
              <DropDown
                ref={searchFilterKK}
                forInput="ddJenis"
                label="Kelompok Keahlian"
                type="semua"
                arrData={listKK}
                defaultValue=""
              />
              <DropDown
                ref={searchFilterStatus}
                forInput="ddStatus"
                label="Status"
                type="none"
                arrData={dataFilterStatus}
                defaultValue="Aktif"
              />
            </Filter>
          </div>{isLoading ? (
            <Loading />
          ) : (
            <div className="row" style={{
              maxWidth: "100%"
            }}>
              {/* Mapping data buku untuk membuat komponen Card */}
              <CardPustaka
                pustakas={currentData}
                onDetail={onChangePage}
                onEdit={onChangePage}
                uploader={activeUser}
                onStatus={handleSetStatus}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}