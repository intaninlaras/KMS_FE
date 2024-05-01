import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK, ROOT_LINK } from "../../util/Constants";
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
import profilePicture from "../../../assets/tes.jpg";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Kode Test": null,
    "Nama Test": null,
    "Alamat Test": null,
    Status: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Kode Test] asc", Text: "Kode Test [↑]" },
  { Value: "[Kode Test] desc", Text: "Kode Test [↓]" },
  { Value: "[Nama Test] asc", Text: "Nama Test [↑]" },
  { Value: "[Nama Test] desc", Text: "Nama Test [↓]" },
];

const dataFilterStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function MasterTestIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Kode Test] asc",
    status: "Aktif",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
        status: searchFilterStatus.current.value,
      };
    });
  }

  function handleSetStatus(id) {
    setIsLoading(true);
    setIsError(false);
    UseFetch(API_LINK + "MasterTest/SetStatusTest", {
      idTest: id,
    })
      .then((data) => {
        if (data === "ERROR" || data.length === 0) setIsError(true);
        else {
          SweetAlert(
            "Sukses",
            "Status data Test berhasil diubah menjadi " + data[0].Status,
            "success"
          );
          handleSetCurrentPage(currentFilter.page);
        }
      })
      .then(() => setIsLoading(false));
  }

  function handleDetailAction() {
    window.location.href = ROOT_LINK + "/master_test";
  }

  useEffect(() => {
    setIsError(false);
    UseFetch(API_LINK + "MasterTest/GetDataTest", currentFilter)
      .then((data) => {
        if (data === "ERROR") 
        //Harusnya true
        setIsError(false);
        else if (data.length === 0) setCurrentData(inisialisasiData);
        else {
          const formattedData = data.map((value) => {
            return {
              ...value,
              Aksi: ["Toggle", "Detail", "Edit"],
              Alignment: [
                "center",
                "center",
                "left",
                "left",
                "center",
                "center",
              ],
            };
          });
          setCurrentData(formattedData);
        }
      })
      .then(() => setIsLoading(false));
  }, [currentFilter]);

  const circleStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: 'lightgray',
    marginRight: '20px'
  };

  const dummyData = [
    {
      Key: 1,
      No: 1,
      TanggalUjian: '01-04-2024',
      Persentase: '75%',
      StatusTest: 'Tidak Lulus',
      Aksi: ['Detail'],
      Alignment: ['center', 'center', 'center', 'center', 'center'], 
    },
    {
      Key: 2,
      No: 2,
      TanggalUjian: '02-04-2024',
      Persentase: '90%',
      StatusTest: 'Lulus',
      Aksi: ['Detail'],
      Alignment: [ 'center', 'center', 'center', 'center', 'center'], 
    },
    {
      Key: 3,
      No: 3,
      TanggalUjian: '03-04-2024',
      Persentase: '60%',
      StatusTest: 'Tidak Lulus',
      Aksi: ['Detail'],
      Alignment: [ 'center', 'center', 'center', 'center', 'center'], 
    },
  ];
  
  return (
    <>
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data Test."
            />
          </div>
        )}
        <div className="flex-fill">
          
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Loading />
          ) : (
            <>
            <div className="d-flex align-items-center mb-5">
              <div className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center" style={circleStyle}>
                <img 
                  src={profilePicture}
                  alt="Profile Picture"
                  className="align-self-start" 
                  style={{ width: '450%', height: 'auto', position: 'relative', right: '30px', bottom:'40px'}}
                />  
              </div> 
              <h6 className="mb-0">Fahriel Dwifaldi - 03 Agustus 2022</h6>
            </div>
            <div className="text-center" style={{marginBottom: '100px'}}>
              <h2 className="font-weight-bold mb-4 primary">Pre Test - Pemrograman 1</h2>
              <p className="mb-5" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '60px' }}>
                Test ini terdiri dari 10 soal, minimal score kelulusan untuk mendapatkan sertifikat adalah 80%, dan anda hanya memiliki waktu 30 menit untuk mengerjakan seluruh soal yang ada, dimulai ketika klik tombol “Mulai Pre Test” di bawah ini.
              </p>
              <Button
                classType="primary ms-2 px-4 py-2"
                type="submit"
                label="MULAI PRE-TEST"
              />
            </div>

             {/*Post Test*/}
             <hr />
              <div>
                <h3 className="font-weight-bold">Riwayat</h3>
                {/* <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ textAlign: 'center', width: 'auto' }}>No</th>
                      <th scope="col" style={{ textAlign: 'center', width: 'auto' }}>Tanggal Ujian</th>
                      <th scope="col" style={{ textAlign: 'center', width: 'auto' }}>Persentase</th>
                      <th scope="col" style={{ textAlign: 'center', width: 'auto' }}>Status</th>
                      <th scope="col" style={{ textAlign: 'center', width: 'auto' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData.map((data, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{data.No}</td>
                        <td style={{ textAlign: 'center' }}>{data.TanggalUjian}</td>
                        <td style={{ textAlign: 'center' }}>{data.Persentase}</td>
                        <td style={{ textAlign: 'center' }}>{data.Status}</td>
                        <td style={{ textAlign: 'center' }}>{data.Aksi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
                <Table
                  data={dummyData}
                  onToggle={handleSetStatus}
                  onDetail={handleDetailAction}
                  onEdit={onChangePage}
                />
              </div>
          </>
          )}
        </div>
      </div>
    </>
  );
}
