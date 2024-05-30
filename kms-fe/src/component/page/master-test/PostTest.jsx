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
import KMS_Rightbar from "../../backbone/KMS_RightBar";

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
  const [marginRight, setMarginRight] = useState("48vh");

  function handlePreTestClick_close() {
    setMarginRight("0vh");
  }

  function handlePreTestClick_open() {
    setMarginRight("48vh");
  }

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((PostvFilter) => {
      return {
        ...PostvFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((PostvFilter) => {
      return {
        ...PostvFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
        status: searchFilterStatus.current.value,
      };
    });
  }

  
  useEffect(() => {
    document.documentElement.style.setProperty('--responsiveContainer-margin-left', '0vw');
    const sidebarMenuElement = document.querySelector('.sidebarMenu');
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add('sidebarMenu-hidden');
    }
  }, []);

  function handleStartPostTest() {
    const quizType = "Posttest"; // Ganti dengan nilai yang sesuai
    const quizId = "2"; // Ganti dengan nilai yang sesuai
    const newUrl = `${ROOT_LINK}/master_test/soal-postTest?quizType=${encodeURIComponent(quizType)}&quizId=${encodeURIComponent(quizId)}`;
    window.location.href = newUrl;
  }

  function handleDetailAction() {
    window.location.href = ROOT_LINK + "/master_test";
  }


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
        <KMS_Rightbar handlePreTestClick_close={handlePreTestClick_close} handlePreTestClick_open={handlePreTestClick_open}/>
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
          {/* {isLoading ? (
            <Loading />
          ) : ( */}
            <>
            <div style={{ marginRight: marginRight }}>
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
                <h2 className="font-weight-bold mb-4 primary">Post Test - Pemrograman 1</h2>
                <p className="mb-5" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '60px' }}>
                This test consists of 10 questions, the minimum passing score to get a certificate is 80%, and you only have 30 minutes to do all the questions, starting when you click the “Start Post Test” button below.
                </p>
                <Button
                  classType="primary ms-2 px-4 py-2"
                  label="MULAI POST-TEST"
                  onClick={() => handleStartPostTest()}
                /><div>
              </div>
              </div>

              {/*Post Test*/}
              <hr />
                <div>
                  <h3 className="font-weight-bold">Riwayat</h3>
                  <Table
                    data={dummyData}
                    // onToggle={handleSetStatus}
                    onDetail={handleDetailAction}
                    // onEdit={onChangePage}
                  />
                </div>
              </div>
          </>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
