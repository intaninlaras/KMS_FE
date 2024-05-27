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
import CardMateri from "../../part/CardMateri";

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
  const [status, setStatus] = useState({});
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
    const searchTerm = searchQuery.current.value.toLowerCase();
    setCurrentFilter({
      ...currentFilter,
      query: searchTerm,
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
  }, [currentFilter]);
  
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
                  {currentData.map((item) => (
                    <CardMateri
                      key={item.Key}
                      item={item}
                      onChangePage={onChangePage}
                      handleSetStatus={handleSetStatus}
                    />
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