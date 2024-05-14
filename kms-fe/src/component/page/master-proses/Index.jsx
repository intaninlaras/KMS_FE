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
  { Value: "[Key] asc", Text: "Key [↑]" },
  { Value: "[Key] desc", Text: "Key [↓]" },
  { Value: "[Nama Materi] asc", Text: "Nama Materi [↑]" },
  { Value: "[Nama Materi] desc", Text: "Nama Materi [↓]" },
  { Value: "[Kelompok Keahlian] asc", Text: "Kelompok Keahlian [↑]" },
  { Value: "[Kelompok Keahlian] desc", Text: "Kelompok Keahlian [↓]" },
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
  const [filteredData, setFilteredData] = useState([]); // Gunakan state data yang difilter
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Key] asc",
    jenis: "",
  });
  const [toggleStatus, setToggleStatus] = useState({});

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterJenis = useRef();

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

  function toggleTampilkan(key) {
    setToggleStatus((prevStatus) => ({
      ...prevStatus,
      [key]: !prevStatus[key], // Mengubah status toggle saat tombol di klik
    }));
  }

  useEffect(() => {
    setIsError(false);
    // Meniru panggilan API dengan timeout
    setTimeout(() => {
      // Filter data berdasarkan filter saat ini
      let filteredData = sampleData.filter((item) => {
        return (
          item["Nama Materi"].toLowerCase().includes(currentFilter.query.toLowerCase()) &&
          (currentFilter.jenis === "" || item["Kelompok Keahlian"] === currentFilter.jenis)
        );
      });
      // Urutkan data berdasarkan urutan saat ini
      filteredData.sort((a, b) => {
        if (currentFilter.sort === "[Key] asc") {
          return a.Key - b.Key;
        } else if (currentFilter.sort === "[Key] desc") {
          return b.Key - a.Key;
        } else if (currentFilter.sort === "[Nama Materi] asc") {
          return a["Nama Materi"].localeCompare(b["Nama Materi"]);
        } else if (currentFilter.sort === "[Nama Materi] desc") {
          return b["Nama Materi"].localeCompare(a["Nama Materi"]);
        } else if (currentFilter.sort === "[Kelompok Keahlian] asc") {
          return a["Kelompok Keahlian"].localeCompare(b["Kelompok Keahlian"]);
        } else if (currentFilter.sort === "[Kelompok Keahlian] desc") {
          return b["Kelompok Keahlian"].localeCompare(a["Kelompok Keahlian"]);
        }
      });

      setCurrentData(sampleData); // Simpan semua data
      setFilteredData(filteredData); // Simpan data yang difilter
      setIsLoading(false);
    }, 500); // Meniru penundaan pemuatan
  }, [currentFilter]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {isError && (
              <div className="flex-fill">
                <Alert
                  type="warning"
                  message="Terjadi kesalahan: Gagal mengambil data produk."
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
                    <div key={item.Key} className="col-lg-4 mb-4">
                      <div className="card">
                        <div className={`card-header d-flex justify-content-between align-items-center`} style={{ backgroundColor: item["Status Materi"] === "Aktif" ? '#67ACE9' : '#A6A6A6', color: 'white' }}>

                          <span>{item["Kelompok Keahlian"]}</span>
                          <button 
                            className="btn btn-circle"
                            onClick={() => toggleTampilkan(item.Key)} // Menggunakan fungsi toggleTampilkan untuk mengubah status materi
                          >
                            {toggleStatus[item.Key] ? <i className="fas fa-toggle-on text-white" style={{ fontSize: '20px' }}></i> : <i className="fas fa-toggle-off text-white" style={{ fontSize: '20px' }}></i>}
                          </button>
                        </div>
                        <div className="card-body bg-white">
                          <h5 className="card-title">{item["Nama Materi"]}</h5>
                          <hr style={{ opacity: "0.1" }} />
                          <p className="card-text">{item["Deskripsi Materi"]}</p>
                        </div>
                        <div className="card-footer d-flex justify-content-end bg-white">
                          <button className="btn btn-sm text-primary" title="Edit Materi" onClick={() => onChangePage("edit")}><i className="fas fa-edit"></i></button>
                          <button className="btn btn-sm text-primary" title="Detail Materi" onClick={() => onChangePage("detail")}><i className="fas fa-list"></i></button>
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
