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
import SideBar from "../../backbone/SideBar";
import axios from "axios";
import "../../../custom_index.css";
export default function MasterTestIndex({ onChangePage, CheckDataReady, materiId }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    // onChangePage('test')
    // window.location.href = ROOT_LINK + "/soal_pretest";
    const quizType = "PreTest"; // Ganti dengan nilai yang sesuai
    const quizId = "1"; // Ganti dengan nilai yang sesuai
    const newUrl = `${ROOT_LINK}/master_test/soal-postTest?quizType=${encodeURIComponent(quizType)}&quizId=${encodeURIComponent(quizId)}`;
    window.location.href = newUrl;
  }

  
  useEffect(() => {
    document.documentElement.style.setProperty('--responsiveContainer-margin-left', '0vw');
    const sidebarMenuElement = document.querySelector('.sidebarMenu');
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add('sidebarMenu-hidden');
    }
  }, []);

  useEffect(() => {
    let isMounted = true; 
    // if (!CheckDataReady) return; 
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:8080/Quiz/GetDataResultQuiz", {
          quizId: "1",
          karyawanId: "1",
          tipeQuiz: "Pretest",
        });
        
        if (isMounted) { 
          if (response.data) {
              if (Array.isArray(response.data)) {
              if (response.data.length == 0) {
                
              } else {
                // onChangePage("hasiltest", true, response.data[0].IdQuiz);
                window.location.href = ROOT_LINK + "/hasil_test";
              }
              return;
            } else {
              console.error("Data is not an array:", response.data);
            }
          } else {
            console.error("Response data is undefined or null");
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsError(true);
          console.error("Fetch error:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("Loading finished");
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup flag
    };
  }, []);


  const circleStyle = {
    width: "50px",
    height: "50px",
    backgroundColor: "lightgray",
    marginRight: "20px",
  };

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
        <div className="mt-3">
          {/* {isLoading ? (
            <Loading />
          ) : ( */}
            <>
              <div style={{ marginRight: marginRight }}>
                <div
                  className="d-flex align-items-center mb-5"
                  >
                  <div
                    className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                    style={circleStyle}
                  >
                    <img
                      className="align-self-start"
                      style={{
                        width: "450%",
                        height: "auto",
                        position: "relative",
                        right: "30px",
                        bottom: "40px",
                      }}
                    />
                  </div>
                  <h6 className="mb-0">Fahriel Dwifaldi - 03 Agustus 2022</h6>
                </div>
                <div className="text-center" style={{ marginBottom: "100px" }}>
                  <h2 className="font-weight-bold mb-4 primary">
                    Pre Test - Pemrograman 1
                  </h2>
                  <p
                    className="mb-5"
                    style={{
                      maxWidth: "600px",
                      margin: "0 auto",
                      marginBottom: "60px",
                    }}
                  >
                    Tes ini terdiri dari 10 soal, nilai kelulusan minimal untuk mendapatkan sertifikat adalah 80%, 
                    dan Anda hanya memiliki waktu 30 menit untuk mengerjakan semua soal, dimulai saat Anda mengklik tombol
                    "Mulai Pre Test" di bawah ini.
                  </p>
                  <Button
                    classType="primary ms-2 px-4 py-2"
                    label="Mulai Pre-Test"
                    onClick={onStartTest}
                  />
                  <div></div>
                </div>
              </div>
            </>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
