import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
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

const responsiveContainer = styled.div`
  margin-left: 0;
`;

export default function PengerjaanTest({ onChangePage }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listProvinsi, setListProvinsi] = useState({});
  const [listKabupaten, setListKabupaten] = useState({});
  const [listKecamatan, setListKecamatan] = useState({});
  const [listKelurahan, setListKelurahan] = useState({});


  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

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
  const dummyData = [
    {
      type: "pilgan",
      question: "Berapa jumlah provinsi di Indonesia?",
      options: ["30", "32", "34", "36"],
      correctAnswer: "34",
      answeredOption: "34",
      answerStatus: "correct",
    },
    {
      type: "essay",
      question: "Siapakah penemu relativitas umum?",
      options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Stephen Hawking"],
      correctAnswer: "Albert Einstein",
    },
    {
      question: "Apa warna bendera Indonesia?",
      options: ["Merah-Putih", "Hijau-Kuning", "Biru-Putih", "Hitam-Kuning"],
      correctAnswer: "Merah-Putih",
      answeredOption: "Merah-Putih",
      answerStatus: "incorrect",
    },
    {
      question: "Apa ibukota Amerika Serikat?",
      options: ["Washington D.C.", "New York City", "Los Angeles", "Chicago"],
      correctAnswer: "Washington D.C.",
      answeredOption: "New York City",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa jumlah planet dalam tata surya?",
      options: ["7", "8", "9", "10"],
      correctAnswer: "8",
      answeredOption: "8",
      answerStatus: "incorrect",
    },
    {
      question: "Siapakah penemu relativitas umum?",
      options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Stephen Hawking"],
      correctAnswer: "Albert Einstein",
      answeredOption: "Albert Einstein",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa banyak huruf dalam alfabet Inggris?",
      options: ["24", "25", "26", "27"],
      correctAnswer: "26",
      answeredOption: "26",
      answerStatus: "incorrect",
    },
    {
      question: "Siapakah penulis 'Pride and Prejudice'?",
      options: ["Jane Austen", "Emily Brontë", "Charlotte Brontë", "Virginia Woolf"],
      correctAnswer: "Jane Austen",
      answeredOption: "Charlotte Brontë",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa banyak warna dalam pelangi?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "7",
      answeredOption: "7",
      answerStatus: "incorrect",
    },
    {
      question: "Apa nama ilmuwan yang menemukan hukum gravitasi?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
      correctAnswer: "Isaac Newton",
      answeredOption: "Galileo Galilei",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa banyak gigi manusia dewasa?",
      options: ["28", "30", "32", "34"],
      correctAnswer: "32",
      answeredOption: "32",
      answerStatus: "incorrect",
    },
    {
      question: "Siapakah penulis '1984'?",
      options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "F. Scott Fitzgerald"],
      correctAnswer: "George Orwell",
      answeredOption: "George Orwell"
    },
    {
      question: "Berapa banyak benua di dunia?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
      answeredOption: "7",
      answerStatus: "incorrect",
    },
    {
      question: "Apa nama senjata tradisional Jepang?",
      options: ["Katana", "Wakizashi", "Naginata", "Tanto"],
      correctAnswer: "Katana",
      answeredOption: "Katana",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa banyak musim di sebagian besar belahan bumi?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
      answeredOption: "4",
      answerStatus: "incorrect",
    },
    {
      question: "Siapakah presiden pertama Amerika Serikat?",
      options: ["George Washington", "Thomas Jefferson", "John Adams", "Abraham Lincoln"],
      correctAnswer: "George Washington",
      answeredOption: "George Washington",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa banyak mata uang yang beredar di dunia?",
      options: ["100", "150", "180", "200"],
      correctAnswer: "180",
      answeredOption: "180",
      answerStatus: "incorrect",
    },
    {
      question: "Apa nama sungai terpanjang di dunia?",
      options: ["Nil", "Amazon", "Yangtze", "Mississippi"],
      correctAnswer: "Nil",
      answeredOption: "Nil",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa banyak hari dalam satu tahun kabisat?",
      options: ["365", "366", "367", "368"],
      correctAnswer: "366",
      answeredOption: "366",
      answerStatus: "incorrect",
    },
    {
      question: "Siapakah penulis 'Hamlet'?",
      options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare",
      answeredOption: "William Shakespeare",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa umur alam semesta?",
      options: ["13.7 Miliar tahun", "15 Miliar tahun", "20 Miliar tahun", "25 Miliar tahun"],
      correctAnswer: "13.7 Miliar tahun",
      answeredOption: "13.7 Miliar tahun",
      answerStatus: "incorrect",
    },
    {
      question: "Apa nama benua terbesar di dunia?",
      options: ["Asia", "Afrika", "Amerika", "Eropa"],
      correctAnswer: "Asia",
      answeredOption: "Asia",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa jumlah gigi pada anak-anak?",
      options: ["20", "22", "24", "26"],
      correctAnswer: "20",
      answeredOption: "20",
      answerStatus: "incorrect",
    },
    {
      question: "Siapakah penulis 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "F. Scott Fitzgerald", "Ernest Hemingway", "J.D. Salinger"],
      correctAnswer: "Harper Lee",
      answeredOption: "Harper Lee",
      answerStatus: "incorrect",
    },
    {
      question: "Berapa banyak negara di dunia?",
      options: ["190", "195", "200", "205"],
      correctAnswer: "195",
      answeredOption: "195",
      answerStatus: "incorrect",
    },
    {
      question: "Apa nama ilmuwan yang menemukan radioaktivitas?",
      options: ["Marie Curie", "Albert Einstein", "Isaac Newton", "Galileo Galilei"],
      correctAnswer: "Marie Curie",
      answeredOption: "Marie Curie",
      answerStatus: "none",
    },
    {
      type: "essay",
      question: "Apa nama tokoh fiksi terkenal dalam novel 'The Lord of the Rings'?",
      options: ["Frodo Baggins", "Gandalf", "Aragorn", "Legolas"],
      correctAnswer: "Frodo Baggins",
      answeredOption: "Frodo Baggins",
      answerStatus: "none",
    },
    {
      type: "pilgan",
      question: "Siapakah penemu telepon?",
      options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Albert Einstein"],
      correctAnswer: "Alexander Graham Bell",
      answeredOption: "Thomas Edison",
      answerStatus: "none",
    },
    {
      question: "Apa nama ibukota Jepang?",
      options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
      correctAnswer: "Tokyo",
      answeredOption: "Hiroshima",
      answerStatus: "none",
    },
    {
      question: "Berapa jumlah surat dalam alfabet Arab?",
      options: ["26", "28", "30", "32"],
      correctAnswer: "28",
      answeredOption: "28",
      answerStatus: "none",
    },
  ];

  const selectPreviousQuestion = () => {
    if (selectedQuestion > 1) {
      setSelectedQuestion(selectedQuestion - 1);
    } else {
      setSelectedQuestion(selectedQuestion + dummyData.length - 1);
    }
  };

  const selectNextQuestion = () => {
    if (selectedQuestion < dummyData.length) {
      setSelectedQuestion(selectedQuestion + 1);
    } else {
      setSelectedQuestion(selectedQuestion - dummyData.length + 1);
    }
  };
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const FileCard = ({ fileName }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffe0e0', borderRadius: '10px', padding: '10px' }}>
        <img src="/path/to/file-icon.png" style={{ marginRight: '10px' }} />
        <span style={{ fontSize: '14px' }}>{fileName}</span>
      </div>
    );
  };

  const answerStatus = dummyData.map((item) =>
    item.answeredOption === item.correctAnswer ? "correct" : "incorrect"
  );
  
  return (
    <>
      <div className="d-flex">
      <KMS_Sidebar
          questionNumbers={questionNumbers}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          answerStatus={answerStatus} 
          checkMainContent="detail_test"
        />
        <div className="flex-fill p-3 d-flex flex-column"  style={{marginLeft:"21vw"}}>
          <div className="mb-3" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}> 
            {dummyData.map((data, index) => {
              if (index + 1 !== selectedQuestion) return null;
             
              return (
                <div key={index} className="mb-3" style={{ display: 'inline-block', verticalAlign: 'top', minWidth: '300px', marginRight: '20px' }}>
                  {/* Soal */}
                  <div className="mb-3">
                    <h4>{data.question}</h4>
                  </div>

                  {/* Jawaban */}
                  {data.type === "essay" ? (
                    <FileCard fileName="Jawaban.docx" />
                  ) : (
                    
                    <div className="d-flex flex-column">
                      {data.options.map((option, index) => {
                        const isCorrect = option === data.correctAnswer;
                        const isSelected = data.answeredOption ? option === data.answeredOption : false; 
                        let borderColor1 = 'lightgray';
                        let backgroundColor1 = 'white';
                        
                        if (isSelected) {
                          borderColor1 = isCorrect ? '#28a745' : '#dc3545';
                          backgroundColor1 = isCorrect ? '#e9f7eb' : '#ffe3e6';
                        } else if (isCorrect) {
                          borderColor1 = '#28a745';
                          backgroundColor1 = '#e9f7eb';
                        }

                        return (
                          <div 
                          key={option} 
                          className="mt-4 mb-2"
                          style={{ display: 'flex', alignItems: 'center'}} 
                        >
                          <button
                            className="btn btn-outline-primary"
                            style={{ width: "40px", height: "40px", borderColor:borderColor1, backgroundColor:backgroundColor1, color: borderColor1}}
                          >
                            {String.fromCharCode(65 + index)}
                          </button>
                          <span className="ms-2">{option}</span>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAdd}>
            <div className="float-start my-4 mx-1 " >
              <Button 
                classType="secondary me-2 px-4 py-2" 
                label="Previous" 
                onClick={selectPreviousQuestion} 
              />
              <Button 
                classType="primary ms-2 px-4 py-2" 
                label="Next" 
                onClick={selectNextQuestion} 
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}