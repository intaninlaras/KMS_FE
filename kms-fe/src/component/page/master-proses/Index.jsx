import React, { useEffect, useRef, useState } from "react";
import { PAGE_SIZE } from "../../util/Constants";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import '@fortawesome/fontawesome-free/css/all.css';
import axios from "axios";
import SweetAlert from "../../util/SweetAlert";

// Definisikan beberapa data contoh untuk tabel
const sampleData = [
  {
    Key: 1,
    "Nama Materi": "Pemrograman 5",
    "Kelompok Keahlian": "Pemrograman",
    "Deskripsi Materi": "Pengenalan Bahasa Pemrograman PHP dan Framework Laravel",
    "Status Materi": "Aktif",
  },
  {
    Key: 2,
    "Nama Materi": "DDL & DML",
    "Kelompok Keahlian": "Basis Data",
    "Deskripsi Materi": "Pengenalan Query DDL dan DML pada DBMS SQL Server",
    "Status Materi": "Tidak Aktif",
  },
  {
    Key: 3,
    "Nama Materi": "Pengantar Informatika",
    "Kelompok Keahlian": "Informatika",
    "Deskripsi Materi": "Pengenalan Fitur dan Formula Dasar Pada Microsoft Excel",
    "Status Materi": "Aktif",
  },
  {
    Key: 4,
    "Nama Materi": "Router",
    "Kelompok Keahlian": "Jaringan Komputer",
    "Deskripsi Materi": "Dasar Pengenalan Router dan Cara Konfigurasi Router",
    "Status Materi": "Tidak Aktif",
  },
  // Tambahkan data contoh lebih banyak jika dibutuhkan
];

const dataFilterSort = [
  { Value: "key,asc", Text: "Key [↑]" },
  { Value: "key,desc", Text: "Key [↓]" },
  { Value: "namaMateri,asc", Text: "Nama Materi [↑]" },
  { Value: "namaMateri,desc", Text: "Nama Materi [↓]" },
  { Value: "kelompokKeahlian,asc", Text: "Kelompok Keahlian [↑]" },
  { Value: "kelompokKeahlian,desc", Text: "Kelompok Keahlian [↓]" },
];

const dataFilterJenis = [
  { Value: "Pemrograman", Text: "Pemrograman" },
  { Value: "Basis Data", Text: "Basis Data" },
  { Value: "Jaringan Komputer", Text: "Jaringan Komputer" },
  // Tambahkan jenis lainnya jika diperlukan
];

export default function MasterProsesIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState({});

  const searchQuery = useRef(null);
  const searchFilterSort = useRef(null);
  const searchFilterJenis = useRef(null);

  async function handleSetStatus(id) {
    setIsError(false);
    console.log("Index ID: " + id);
  
    SweetAlert(
      "Konfirmasi",
      "Apakah Anda yakin ingin mengubah status data Materi?",
      "warning",
      "Ya",
    ).then((confirmed) => {
      if (confirmed) {
        // Panggil endpoint API untuk mengubah status
        axios.post(`http://localhost:8080/Materis/setStatusMateri`, {
          idMateri: id,
        })
        .then((response) => {
          // Periksa respons dari endpoint API
          if (response.data === "SUCCESS") {
            // Jika berhasil, update status di state
            setStatus((prevStatus) => ({
              ...prevStatus,
              [id]: status[id] === "Aktif" ? "Tidak Aktif" : "Aktif",
            }));
            // Tampilkan pemberitahuan sukses
            SweetAlert(
              "Sukses",
              `Status data Materi berhasil diubah menjadi ${status[id] === "Aktif" ? "Tidak Aktif" : "Aktif"}`,
              "success"
            );
          } else {
            // Jika gagal, tampilkan pesan error
            setIsError(true);
            console.error("Failed to update status");
          }
        })
        .catch((error) => {
          // Tangani kesalahan dalam pemanggilan API
          setIsError(true);
          console.error("Error updating status:", error);
        })
        .finally(() => setIsLoading(false));
      } else {
        console.log("Operasi dibatalkan.");
      }
    });
  }
  

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter({
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
      jenis: searchFilterJenis.current.value,
    });
  }

  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "key,asc",
    jenis: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
  
      try {
        const response = await axios.post("http://localhost:8080/Materis/GetDataMateri", {
          page: '1',
          status: 'Aktif',
          query: '',
          orderby: 'Judul',
          sort: 'asc',
        });
  
        const promises = response.data.map(async (value) => {
          const gambarURL = await fetchGambar(value.Gambar);
          const fileURL = await fetchGambar(value.File);
          return { ...value, Gambar: gambarURL, File: fileURL };
        });
  
        const updatedData = await Promise.all(promises);
        setCurrentData(updatedData);
        setFilteredData(updatedData);
      } catch (error) {
        setIsError(true);
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  async function fetchGambar(filename) {
    if (!filename) return null; // Jika tidak ada nama file, kembalikan null
    try {
      const response = await fetch(
        `http://localhost:8080/Utilities/Upload/DownloadFile?namaFile=${encodeURIComponent(filename)}`
      );
      if (!response.ok) throw new Error("Gambar tidak ditemukan");
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching gambar:", error);
      return null;
    }
  }
  


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {isError && (
              <div className="flex-fill">
                <Alert
                  type="warning"
                  message="Terjadi kesalahan: Gagal mengambil data materi."
                />
              </div>
            )}
            <div className="flex-fill">
              <div className="input-group">
                <Button
                  iconName="add"
                  classType="success"
                  title="Tambah Materi"
                  label="Add Course"
                  onClick={() => onChangePage("pretestAdd")}
                />
                <Input
                  ref={searchQuery}
                  forInput="pencarianProduk"
                  placeholder="Search"
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
                    defaultValue="[Key] asc"
                  />
                  <DropDown
                    ref={searchFilterJenis}
                    forInput="ddJenis"
                    label="Kelompok Keahlian"
                    type="semua"
                    arrData={dataFilterJenis}
                    defaultValue=""
                  />
                </Filter>
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <Loading />
              ) : (
                <div className="row">
                  {filteredData.map((item) => (
                    <div key={item.Key} className="col-lg-6 mb-4">
                      <div className="card">
                        <div className={`card-header d-flex justify-content-between align-items-center`} style={{ backgroundColor: item.Status === "Aktif" ? '#67ACE9' : '#A6A6A6', color: 'white' }}>
                          <span>{item.Kategori}</span>
                        </div>
                        <div className="card-body bg-white d-flex">
                        <img
                          src={item.Gambar}
                          alt={item["Nama Materi"]}
                          className="img-thumbnail me-3"
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover', // Menambahkan gaya CSS object-fit
                          }}
                        />
                          <div>
                            <h5 className="card-title">{item.Judul}</h5>
                            <hr style={{ opacity: "0.1" }} />
                            <p className="card-text">{item.Keterangan}</p>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end bg-white">
                          <button className="btn btn-sm text-primary" title="Edit Materi" onClick={() => onChangePage("edit")}><i className="fas fa-edit"></i></button>
                          <button className="btn btn-sm text-primary" title="Detail Materi" onClick={() => onChangePage("detail")}><i className="fas fa-list"></i></button>
                          <button className="btn btn-circle" onClick={() => handleSetStatus(item.Key)}>
                            {item.Status === "Aktif" ? 
                              <i className="fas fa-toggle-on text-primary" style={{ fontSize: '20px' }}></i> : 
                              <i className="fas fa-toggle-off text-white" style={{ fontSize: '20px' }}></i>}
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!isLoading && (
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={sampleData.length}
                navigation={handleSetCurrentPage}
              />
            )}
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Back"
            onClick={() => onChangePage("kk")}
          />
        </div>
      </div>
    </>
  );
}