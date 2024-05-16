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


  const searchQuery = useRef(null);
  const searchFilterSort = useRef(null);
  const searchFilterJenis = useRef(null);

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
      sort: 'ASC',
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
          orderby:'Judul',
          sort: 'asc',
        });

        if (response.data && Array.isArray(response.data)) {
          console.log(JSON.stringify(response.data));
          setCurrentData(response.data);
          setFilteredData(response.data);
        } else {
          throw new Error("Data format is incorrect");
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
                    <div key={item.Key} className="col-lg-4 mb-4">
                      <div className="card">
                        <div className={`card-header d-flex justify-content-between align-items-center`} style={{ backgroundColor: item.Status === "Aktif" ? '#67ACE9' : '#A6A6A6', color: 'white' }}>

                          <span>{item.Kategori}</span>
                          <button 
                            className="btn btn-circle"
                            onClick={() => toggleTampilkan(item.Key)} // Menggunakan fungsi toggleTampilkan untuk mengubah status materi
                          >
                            {filteredData[item.Key] ? <i className="fas fa-toggle-on text-white" style={{ fontSize: '20px' }}></i> : <i className="fas fa-toggle-off text-white" style={{ fontSize: '20px' }}></i>}
                          </button>
                        </div>
                        <div className="card-body bg-white">
                          <h5 className="card-title">{item.Judul}</h5>
                          <hr style={{ opacity: "0.1" }} />
                          <p className="card-text">{item.Keterangan}</p>
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
