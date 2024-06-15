import { useEffect, useRef, useState } from "react";
import { useLocation} from 'react-router-dom';
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
import axios from "axios";
import Swal from 'sweetalert2';
import AppContext_test from "./TestContext";

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 35px;
  left: 30%;
  transform: translateX(-50%);
  z-index: 999;
`;

export default function PengerjaanTest({ onChangePage, quizType, materiId }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [questionNumbers, setQuestionNumbers] = useState(0);
  const [IdQuiz, setIdQuiz] = useState();
  const [nilai, setNilai] = useState(0);
  const formDataRef = useRef({
    karyawanId:"1",
    quizId: AppContext_test.quizId,
    nilai: "", 
    status: "",
    answers: [],
    createdBy: "Fahriel",
  });
  
  useEffect(() => {
  }, [quizType, materiId]);
  const formUpdate = useRef({
    idMateri:AppContext_test.materiId,
    karyawanId: "1",
    totalProgress: "0", 
    statusMateri_PDF: "",
    statusMateri_Video: "",
    statusSharingExpert_PDF: "",
    statusSharingExpert_Video: "",
    createdBy: "Fahriel",
  });

  function convertEmptyToNull(obj) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = value === "" ? null : value;
    }
    return newObj;
  }
  
  const processedFormUpdate = convertEmptyToNull(formUpdate);
  // console.log(processedFormUpdate)
  const fileGambarRef = useRef(null);

  const userSchema = object({
    gambar: string(),
  });

  const handleSubmitConfirmation = () => {
    Swal.fire({
      title: 'Apakah anda yakin sudah selesai?',
      text: 'Jawaban akan disimpan dan tidak dapat diubah lagi.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, submit',
      cancelButtonText: 'Tidak',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleAdd();
        handleSubmitAction();
      }
    });
  };

  
  useEffect(() => {
    console.log("sidebar "+AppContext_test.timeRemaining)
    if (AppContext_test.timeRemaining == true){
        handleAdd();
        handleSubmitAction();
    }
  }, [AppContext_test.timeRemaining]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  function handleSubmitAction() {
    // window.location.href = ROOT_LINK + "/hasil_test";
    if (quizType == "Pretest"){
      onChangePage("pretest", true, materiId)
    } else if (quizType == "Posttest"){
      onChangePage("posttest", true, materiId)
    }
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
    // e.preventDefault();
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
    const totalNilai = answers.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.nilaiSelected;
    }, 0);
    formDataRef.current.nilai = totalNilai;
    formDataRef.current.answers = submittedAnswers;
    const response = await axios.post("http://localhost:8080/Quiz/SaveTransaksiQuiz", formDataRef.current);
    const saveProgress = await axios.post("http://localhost:8080/Materis/SaveProgresMateri", formUpdate.current);
  };

  const selectPreviousQuestion = () => {
    if (selectedQuestion > 1) {
      setSelectedQuestion(selectedQuestion - 1);
    } else {
      setSelectedQuestion(selectedQuestion - 1);
    }
    location.reload();
  };

  const selectNextQuestionOrSubmit = () => {
    if (selectedQuestion < questionNumbers) {
      setSelectedQuestion(selectedQuestion + 1);
    } else {
      handleSubmitConfirmation();

    }
  };

  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const handleValueAnswer = (urutan, idSoal, answer, nilaiSelected, index) => {
    setSelectedOption(answer);
    const updatedAnswers = [...answers];
    const submitAnswer = [...submittedAnswers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      (ans) => ans.idSoal === idSoal 
    );
    if (existingAnswerIndex !== -1) {
      updatedAnswers[existingAnswerIndex] = { urutan, idSoal, answer, nilaiSelected};
      submitAnswer[existingAnswerIndex] = { urutan };
    } else {
      updatedAnswers.push({ urutan, idSoal, answer, nilaiSelected});
      submitAnswer.push ([urutan, idSoal]) ;
    }
    setAnswers(updatedAnswers);
    setSubmittedAnswers(submitAnswer);
    AppContext_test.indexTest = index;
  };

  useEffect(() => {
    setAnswerStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[AppContext_test.indexTest - 1] = "answered";
      return newStatus;
    });
  }, [answers, AppContext_test.indexTest]);

  const FileCard = ({ fileName }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffe0e0', borderRadius: '10px', padding: '10px' }}>
        <img src="/path/to/file-icon.png" style={{ marginRight: '10px' }} />
        <span style={{ fontSize: '14px' }}>{fileName}</span>
      </div>
    );
  };

  const [answerStatus, setAnswerStatus] = useState([]);

  useEffect(() => {
    const initialAnswerStatus = Array(questionNumbers).fill(null);
    setAnswerStatus(initialAnswerStatus);
  }, [questionNumbers]);

  useEffect(() => {
    console.log(AppContext_test.quizId)
  }, [AppContext_test.quizId]);

  const [answerIsChecked, setAnswerIsChecked] = useState(false);

  const updateAnswerStatus = (index, isSelected) => {
    setAnswerStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = isSelected ? null : "answered";
      return newStatus;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:8080/Quiz/GetDataQuestion", {
          idMateri: AppContext_test.materiId,
          status: 'Aktif',
          quizType: quizType,
        });
        // console.log(materiId+quizType)
        const checkIsDone = await axios.post("http://localhost:8080/Quiz/GetDataResultQuiz", {
          materiId: AppContext_test.materiId,
          karyawanId: "1",
        });
        if (checkIsDone.data && Array.isArray(checkIsDone.data)) {
          if (checkIsDone.data.length == 0) {
          } else {
              // window.location.href = ROOT_LINK + "/hasil_test";
          }
        }

        if (response.data && Array.isArray(response.data)) {
          
          const questionMap = new Map();
          const transformedData = response.data.map((item) => {
            const { Soal, TipeSoal, Jawaban, UrutanJawaban, NilaiJawaban, ForeignKey, QuizId} = item;
            if (!questionMap.has(Soal)) {
              questionMap.set(Soal, true);
              if (TipeSoal === "Essay") {
                return {
                  type: "essay",
                  question: Soal,
                  correctAnswer: Jawaban,
                  answerStatus: "none",
                };
              } else {
                const options = response.data
                .filter(choice => choice.Key === item.Key)
                .map(choice => ({
                  value: choice.Jawaban, 
                  urutan: choice.UrutanJawaban,
                  nomorSoal: choice.Key,
                  nilai: choice.NilaiJawaban
                }));
                
                return {
                  type: "pilgan",
                  question: Soal,
                  options: options,
                  correctAnswer: options.find(option => option === Jawaban && NilaiJawaban !== "0"), 
                  urutan: UrutanJawaban,
                  answerStatus: "none",
                };
              }
            }
            AppContext_test.quizId = QuizId;
            return null;
          }).filter(item => item !== null);
          setQuestionNumbers(transformedData.length);
          
        console.log(checkIsDone)
          setCurrentData(transformedData);
          
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
  }, []);

  useEffect(() => {
  }, [IdQuiz]);


  useEffect(() => {
    document.documentElement.style.setProperty('--responsiveContainer-margin-left', '0vw');
    const sidebarMenuElement = document.querySelector('.sidebarMenu');
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add('sidebarMenu-hidden');
    }
  }, []);

  

  return (
    <>
      <div className="d-flex">
        <KMS_Sidebar
          questionNumbers={questionNumbers}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          answerStatus={answerStatus} 
          checkMainContent="test"
        />
        <div className="flex-fill p-3 d-flex flex-column" style={{marginLeft:"21vw"}}>
          <div className="mb-3" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}> 
            {currentData.map((item, index) => {
              const key = `${item.question}_${index}`;
              if (index + 1 !== selectedQuestion) return null;
              const currentIndex = index + 1;
              
              return (
                <div key={key} className="mb-3" style={{ display: 'inline-block', verticalAlign: 'top', minWidth: '300px', marginRight: '20px' }}>
                  {/* Soal */}
                  <div className="mb-3">
                    <h4>{item.question}</h4>
                  </div>

                  {/* Jawaban */}
                  {item.type === "essay" ? (
                    <KMS_Uploader />
                  ) : (
                    
                    <div className="d-flex flex-column">
                      {item.options.map((option, index) => {
                        const isCorrect = option === item.correctAnswer;
                        const isSelected = answers.some(
                          (ans) => ans.idSoal == option.nomorSoal && ans.urutan == option.urutan
                        );
                        
                        let borderColor1 = '';
                        let backgroundColor1 = '';
                        
                        if (isSelected) {
                          borderColor1 = isCorrect ? '#28a745' : '#dc3545';
                          backgroundColor1 = isCorrect ? '#e9f7eb' : '#ffe3e6';
                        } else if (isCorrect && isSelected) {
                          borderColor1 = '#28a745';
                          backgroundColor1 = '#e9f7eb';
                        }

                        return (
                          <div key={option.urutan} className="mt-4 mb-2" style={{ display: "flex", alignItems: "center" }}>
                            <input
                              type="radio"
                              id={`option-${option.urutan}`}
                              name={`question-${selectedQuestion}`}
                              onChange={() => handleValueAnswer(option.urutan, option.nomorSoal, option.value, option.nilai, currentIndex)}
                              checked={isSelected}
                              style={{ display: "none" }}
                            />
                            <label
                              htmlFor={`option-${option.urutan}`}
                              className={`btn btn-outline-primary ${isSelected ? 'active' : ''}`}
                              style={{
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {String.fromCharCode(65 + index)}
                            </label>
                            <span className="ms-2">{option.value}</span>
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
            <ButtonContainer >
              <Button 
                classType="secondary me-2 px-4 py-2" 
                label="Sebelumnya" 
                onClick={selectPreviousQuestion} 
              />
              <Button 
                classType="primary ms-2 px-4 py-2" 
                label={selectedQuestion < questionNumbers ? "Berikutnya" : "Selesai"} 
                onClick={selectNextQuestionOrSubmit} 
              />
              </ButtonContainer>
          </form>
        </div>
      </div>
    </>
  );
}