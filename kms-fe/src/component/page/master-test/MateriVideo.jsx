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
import SideBar from "../../backbone/SideBar";
import KMS_VideoPlayer from "../../backbone/KMS_VideoPlayer";
import KMS_Rightbar from "../../backbone/KMS_RightBar";
// import KMS_SB_RightBar from '../../backbone/KMS_SB_RightBar';

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
  const [marginRight, setMarginRight] = useState("40vh");

  function handlePreTestClick_close() {
    setMarginRight("0vh");
  }

  function handlePreTestClick_open() {
    setMarginRight("40vh");
  }

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

  function onStartTest() {
    window.location.href = ROOT_LINK + "/master_test/soal-test";
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
    width: "50px",
    height: "50px",
    backgroundColor: "lightgray",
    marginRight: "20px",
  };

  const dummyData = [
    {
      Key: 1,
      No: 1,
      TanggalUjian: "01-04-2024",
      Persentase: "75%",
      StatusTest: "Tidak Lulus",
      Aksi: ["Detail"],
      Alignment: ["center", "center", "center", "center", "center"],
    },
    {
      Key: 2,
      No: 2,
      TanggalUjian: "02-04-2024",
      Persentase: "90%",
      StatusTest: "Lulus",
      Aksi: ["Detail"],
      Alignment: ["center", "center", "center", "center", "center"],
    },
    {
      Key: 3,
      No: 3,
      TanggalUjian: "03-04-2024",
      Persentase: "60%",
      StatusTest: "Tidak Lulus",
      Aksi: ["Detail"],
      Alignment: ["center", "center", "center", "center", "center"],
    },
  ];

  const videoUrl = 'https://youtu.be/5Hd1kBQV_PY?si=UU1es2CSjuPo86lk';

  return (
    <>
      <div className="d-flex flex-column">
        <KMS_Rightbar handlePreTestClick_close={handlePreTestClick_close} handlePreTestClick_open={handlePreTestClick_open}/>
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data Test."
            />
          </div>
        )}
        <div className="flex-fill"></div>
        <div className="mt-0">
          {/* {isLoading ? (
            <Loading />
          ) : ( */}
            <>
              <div style={{ marginRight: marginRight, height: '70vh'}}>
                <div className="d-flex align-items-center mb-5" style={{ width: '100%', height:'100%'}}>
                  <KMS_VideoPlayer videoFileName={videoUrl} />
                </div>
              </div>
            </>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
