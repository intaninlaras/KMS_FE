import { useEffect, useRef, useState } from "react";
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

export default function PengerjaanTest({ onChangePage }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listProvinsi, setListProvinsi] = useState({});
  const [listKabupaten, setListKabupaten] = useState({});
  const [listKecamatan, setListKecamatan] = useState({});
  const [listKelurahan, setListKelurahan] = useState({});
  const [marginRight, setMarginRight] = useState("40vh");

  function handlePreTestClick_close() {
    setMarginRight("0vh");
  }

  function handlePreTestClick_open() {
    setMarginRight("40vh");
  }



  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  function lihatHasil() {
    window.location.href = ROOT_LINK + "/detail_test";
  }

  function bacaMateri() {
    window.location.href = ROOT_LINK + "/baca_materi";
  }

  const handleFileChange = async (ref, extAllowed) => {
    const { name, value } = ref.current;
    const file = ref.current.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop();
    const validationError = await validateInput(name, value, userSchema);
    let error = "";

    if (fileSize / 1024576 > 10) error = "berkas terlalu besar";
    else if (!extAllowed.split(",").includes(fileExt))
      error = "format berkas tidak valid";

    if (error) ref.current.value = "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: error,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("Nomor Soal:", selectedQuestion);
    console.log("Jawaban Terpilih:", selectedAnswer);
    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => {
        return { ...prevError, error: false };
      });
      setErrors({});

      const uploadPromises = [];

      if (fileNPWPRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileNPWPRef.current).then(
            (data) => (formDataRef.current["berkasNPWPPelanggan"] = data.Hasil)
          )
        );
      }

      Promise.all(uploadPromises).then(() => {
        UseFetch(
          API_LINK + "MasterPelanggan/CreatePelanggan",
          formDataRef.current
        )
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data pelanggan.",
                };
              });
            } else {
              SweetAlert(
                "Sukses",
                "Data pelanggan berhasil disimpan",
                "success"
              );
              onChangePage("index");
            }
          })
          .then(() => setIsLoading(false));
      });
    }
  };

  if (isLoading) return <Loading />;
  const questionNumbers = Array.from(Array(30).keys());

  return (
    <>
    <div style={{marginRight: marginRight}}>
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
        <div style={{ fontSize: '14px', color: 'gray' }}>Intan Larasati - May 13, 2024</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          Congratulations, you got the score:
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
          <div style={{ fontSize: '48px', fontWeight: 'bold' }}>80</div>
        </div>
        <div style={{ marginBottom: '10px' }}>Pre Test - Pemrograman 1</div>
        <div style={{ fontSize: '14px', marginBottom: '20px' }}>
          You have successfully done the Pre Test, please read the material provided and do the Post Test.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            classType="secondary me-2 px-4 py-2" 
            label="View Results" 
            onClick={lihatHasil}
          />
          <Button 
            classType="primary ms-2 px-4 py-2"
            label="Read Course"
            onClick={bacaMateri}
          />
        </div>
      </div>
    </div>
    </div>
    </>
  );
}