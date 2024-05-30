import { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import { object, string } from "yup";
import { API_LINK, ROOT_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import KMS_Sidebar from '../../backbone/KMS_SideBar';
import Sidebar from '../../backbone/SideBar';
import styled from 'styled-components';
import KMS_Uploader from "../../part/KMS_Uploader";
import KMS_Rightbar from "../../backbone/KMS_RightBar";
import axios from "axios";

export default function MasterTestHasilTest({ onChangePage, CheckDataReady, materiId }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [marginRight, setMarginRight] = useState("48vh");

  const location = useLocation();
  console.log(location)
  
  function handlePreTestClick_close() {
    setMarginRight("0vh");
  }

  function handlePreTestClick_open() {
    setMarginRight("48vh");
  }

  function lihatHasil() {
    // onChangePage('detailtest')
    window.location.href = ROOT_LINK + "/detail_test";
  }

  function bacaMateri() {
    // onChangePage('materipdf')
    
    window.location.href = ROOT_LINK + "/sharing_expert/materi_pdf";
  }

  function formattingDate (rawDate) {
    let parsedDate = new Date(rawDate);
    let options = { day: 'numeric', month: 'long', year: 'numeric' };
    let formattedDate = new Intl.DateTimeFormat('id-ID', options).format(parsedDate);
    return formattedDate;
  };

  
  useEffect(() => {
    let isMounted = true; 
    // if (!CheckDataReady) return; 
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:8080/Quiz/GetDataResultQuiz", {
          quizId: "1",
          karyawanId: "1",
          tipeQuiz: "Pretest"
        });
        
        console.log(response.data+"ds")
        
        if (isMounted) { 
          if (response.data && Array.isArray(response.data)) {
            if (response.data.length === 0) {
                // window.location.href = ROOT_LINK + "/pretest";
            } else {
                setCurrentData(response.data);
            }
          } else {
            throw new Error("Data format is incorrect");
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
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup flag
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--responsiveContainer-margin-left', '0vw');
    const sidebarMenuElement = document.querySelector('.sidebarMenu');
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add('sidebarMenu-hidden');
    }
  }, []);
  return (
    <>
    
      {currentData.map((item) => (
        <div key={item.Key} style={{marginRight: marginRight}}>
          <KMS_Rightbar handlePreTestClick_close={handlePreTestClick_close} handlePreTestClick_open={handlePreTestClick_open}/>
          <div 
          style={{ 
            display: 'flex-start', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontFamily: 'sans-serif' 
          }}
          >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <div 
              style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: 'lightgray', 
                marginRight: '10px' 
              }}
            ></div>
            <div style={{ fontSize: '14px', color: 'gray' }}>{item.CreatedBy} - {formattingDate(item.CreatedDate)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', marginBottom: '20px' }}>
              Selamat!, kamu mendapatkan nilai:
            </div>
            <div
              style={{ 
                width: '150px', 
                height: '150px', 
                borderRadius: '50%', 
                border: '2px solid lightgray', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 30px' 
              }}
            >
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{item.Nilai}</div>
            </div>
            <div style={{ marginBottom: '10px' }}>Pre Test - Pemrograman 1</div>
            <div style={{ fontSize: '14px', marginBottom: '20px' }}>
              Anda telah berhasil mengerjakan Pre Test, silahkan baca materi yang telah disediakan dan kerjakan Post Test.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                classType="secondary me-2 px-4 py-2" 
                label="Lihat Hasil" 
                onClick={lihatHasil}
              />
              <Button 
                classType="primary ms-2 px-4 py-2"
                label="Baca Materi"
                onClick={bacaMateri}
              />
            </div>
          </div>
          </div>
        </div>
        ))}
    </>
  );
}