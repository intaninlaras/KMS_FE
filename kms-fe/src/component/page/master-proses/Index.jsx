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

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Nama Materi": null,
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

const dataFilterSort = [
  { Value: "[Judul] ASC", Text: "Nama Materi [↑]" },
  { Value: "[Judul] DESC", Text: "Nama Materi [↓]" },
];

const dataFilterJenis = [
  { Value: "Pemrograman", Text: "Pemrograman" },
  { Value: "Basis Data", Text: "Basis Data" },
  { Value: "Jaringan Komputer", Text: "Jaringan Komputer" },
  // Tambahkan jenis lainnya jika diperlukan
];

const dataFilterStatus = [
  
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function MasterProsesIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([inisialisasiData]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "JUDUL",
    status: "Aktif",
    order: "asc",
    
  });

  const searchQuery = useRef(null);
  const searchFilterSort = useRef(null);
  const searchFilterStatus = useRef(null);

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    const searchTerm = searchQuery.current.value.toLowerCase();
    setCurrentFilter({
      ...currentFilter,
      query: searchTerm,
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

  function handleStatusChange(event) {
    const { value } = event.target;
    setCurrentFilter({
      ...currentFilter,
      status: value,
    });
  }

  function handleSortChange(event) {
    const { value } = event.target;
    const [sort, order] = value.split(" ");
    setCurrentFilter({
      ...currentFilter,
      sort,
      order,
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
        UseFetch(API_LINK + "Materis/SetStatusMateri", {
          idMateri: id,
        })
          .then((data) => {
            if (data === "ERROR" || data.length === 0) setIsError(true);
            else {
              SweetAlert(
                "Sukses",
                "Status data Materi berhasil diubah menjadi " + data[0].Status,
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

    try {
      const response = await axios.post("http://localhost:8080/Materis/GetDataMateri", {
        page: currentFilter.page,
        status: currentFilter.status,
        query: currentFilter.query, // Kirim nilai pencarian ke server
        orderby: 'Judul',
        sort: currentFilter.order,
      });

      if (response.data && Array.isArray(response.data)) {
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
                  forInput="pencarianMateri"
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
                    defaultValue="[Judul] ASC"
                    onChange={handleSortChange}
                  />
                  <DropDown
                    ref={searchFilterStatus}
                    forInput="ddStatus"
                    label="Status"
                    type="semua"
                    arrData={dataFilterStatus}
                    defaultValue="Aktif"
                    onChange={handleStatusChange}
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
                          <img src={"/DD.jpg"} alt={item["Nama Materi"]} className="img-thumbnail me-3" style={{ width: '150px', height: 'auto' }} />
                          <div>
                          <h5 className="card-title">{item.Judul}</h5>
                          <hr style={{ opacity: "0.1" }} />
                          <p className="card-text">{item.Keterangan}</p>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end bg-white">
                          <button className="btn btn-sm text-primary" title="Edit Materi" onClick={() => onChangePage("edit")}><i className="fas fa-edit"></i></button>
                          <button className="btn btn-sm text-primary" title="Detail Materi" onClick={() => onChangePage("detail")}><i className="fas fa-list"></i></button>
                          
                          <button 
                            className="btn btn-circle"
                            onClick={() => handleSetStatus(item.Key)}
                          >
                            {item.Status === "Aktif" ? <i className="fas fa-toggle-on text-primary" style={{ fontSize: '20px' }}></i> : <i className="fas fa-toggle-off text-grey" style={{ fontSize: '20px' }}></i>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
           
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
