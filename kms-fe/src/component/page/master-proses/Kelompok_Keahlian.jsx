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
    "Nama KK": "Human Resource Management",
    "Prodi": "Manajemen Informatika",
    "Deskripsi KK": "Proses inspeksi, pembersihan dan pemodelan data dengan tujuan menemukan informasi yang berguna, menginformasikan kesimpulan dan mendukung pengam...",
    "Status KK": "Aktif",
  },
  {
    Key: 2,
    "Nama KK": "[Kelompok Keahlian]",
    "Prodi": "[Program Studi]",
    "Deskripsi KK": "[Deskripsi Kelompok Keahlian]",
    "Status KK": "Aktif",
  },
  {
    Key: 3,
    "Nama KK": "[Kelompok Keahlian]",
    "Prodi": "[Program Studi]",
    "Deskripsi KK": "[Deskripsi Kelompok Keahlian]",
    "Status KK": "Aktif",
  },
  {
    Key: 4,
    "Nama KK": "[Kelompok Keahlian]",
    "Prodi": "[Program Studi]",
    "Deskripsi KK": "[Deskripsi Kelompok Keahlian]",
    "Status KK": "Aktif",
  },
  // Tambahkan data contoh lebih banyak jika dibutuhkan
];

const dataFilterSort = [
  { Value: "[Key] asc", Text: "Key [↑]" },
  { Value: "[Key] desc", Text: "Key [↓]" },
  { Value: "[Nama KK] asc", Text: "Nama KK [↑]" },
  { Value: "[Nama KK] desc", Text: "Nama KK [↓]" },
  { Value: "[Prodi] asc", Text: "Prodi [↑]" },
  { Value: "[Prodi] desc", Text: "Prodi [↓]" },
];

const dataFilterJenis = [
  { Value: "Manajemen Informatika", Text: "Manajemen Informatika" },
  { Value: "Teknologi Rekayasa Logistik", Text: "Teknologi Rekayasa Logistik" },
  { Value: "Teknik Konstruksi Bangunan dan Gedung", Text: "Teknik Konstruksi Bangunan dan Gedung" },
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
    const newData = currentData.map((item) => {
      if (item.Key === key) {
        return {
          ...item,
          "Status KK": item["Status KK"] === "Aktif" ? "Tidak Aktif" : "Aktif",
        };
      }
      return item;
    });
    setCurrentData(newData);
  }

  useEffect(() => {
    setIsError(false);
    // Meniru panggilan API dengan timeout
    setTimeout(() => {
      // Filter data berdasarkan filter saat ini
      let filteredData = sampleData.filter((item) => {
        return (
          item["Nama KK"].toLowerCase().includes(currentFilter.query.toLowerCase()) &&
          (currentFilter.jenis === "" || item["Prodi"] === currentFilter.jenis)
        );
      });
      // Urutkan data berdasarkan urutan saat ini
      filteredData.sort((a, b) => {
        if (currentFilter.sort === "[Key] asc") {
          return a.Key - b.Key;
        } else if (currentFilter.sort === "[Key] desc") {
          return b.Key - a.Key;
        } else if (currentFilter.sort === "[Nama KK] asc") {
          return a["Nama KK"].localeCompare(b["Nama KK"]);
        } else if (currentFilter.sort === "[Nama KK] desc") {
          return b["Nama KK"].localeCompare(a["Nama KK"]);
        } else if (currentFilter.sort === "Prodi] asc") {
          return a["Prodi"].localeCompare(b["Prodi"]);
        } else if (currentFilter.sort === "[Prodi] desc") {
          return b["Prodi"].localeCompare(a["Prodi"]);
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
                <Input
                  ref={searchQuery}
                  forInput="pencarianProduk"
                  placeholder="Pencarian"
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
                    item["Status KK"] === "Aktif" && (
                      <div key={item.Key} className="col-lg-4 mb-4">
                        <div className="card">
                          <div className={`card-header d-flex justify-content-between align-items-center`} style={{ backgroundColor: '#67ACE9', color: 'white' }}>
                            <span>{item["Nama KK"]}</span>
                          </div>
                          <div className="card-body bg-white">
                            <h5 className="card-title">{item["Prodi"]}</h5>
                            <hr style={{ opacity: "0.1" }} />
                            <p className="card-text">{item["Deskripsi KK"]}</p>
                          </div>
                          <div className="card-footer d-flex justify-content-end bg-white">
                            <button className="btn btn-sm text-primary" onClick={() => onChangePage("index")}>
                              <i className="fas fa-paper-plane"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
            {!isLoading && (
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={sampleData.filter(item => item["Status KK"] === "Aktif").length}
                navigation={handleSetCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
