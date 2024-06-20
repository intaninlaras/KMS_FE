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
  transform: translateX(-37%);
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
  const [timeRemaining, setTimeRemaining] = useState(false);
  const formDataRef = useRef({
    karyawanId:"1",
    quizId: AppContext_test.quizId,
    nilai: "", 
    status: "Not Reviewed",
    answers: [],
    createdBy: "Fahriel",
  });
  const [formDataRef2, setFormData2] = useState([]);
  
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
  const fileInputRef = useRef(null);

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
    if (timeRemaining == true){
        handleAdd();
        handleSubmitAction();
    }
  }, [timeRemaining]);

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


  const handleFileChange = async (ref, extAllowed, fileUpload, currentIndex, id_question) => {
    handleValueAnswer("", "", "", "", currentIndex, fileUpload, id_question);
  };

  const handleAdd = async (e) => {
    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    const totalNilai = answers.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.nilaiSelected;
    }, 0);
    formDataRef.current.nilai = totalNilai;
    formDataRef.current.answers = submittedAnswers;
    console.log("Form data yang akan dikirim ke API: ", formDataRef.current);

    try {
      const response1 = await axios.post(
        "http://localhost:8080/Quiz/SaveTransaksiQuiz",
        formDataRef.current
      );
      if (response1.data) {
        const response2 = await axios.post(
          "http://localhost:8080/Materis/SaveProgresMateri",
          formUpdate.current
        );

      } else {
        console.error("API pertama tidak mengembalikan respons 'OK'");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const retryRequest = async (url, data, maxRetries = 100, delay = 50) => {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        const response = await axios.post(url, data);
        return response.data;
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          throw new Error("Max retries reached");
        }
        console.log(`Attempt ${attempts} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const selectPreviousQuestion = () => {
    if (selectedQuestion > 1) {
      setSelectedQuestion(selectedQuestion - 1);
    } else {
      setSelectedQuestion(selectedQuestion + questionNumbers - 1);
    }
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

  useEffect(() => {
  }, [AppContext_test.arrayAnswerQuiz]);

  // const handleValueAnswer = (urutan, idSoal, answer, nilaiSelected, index, event) => {
  //   setSelectedOption(answer);
  //   const updatedAnswers = [...answers];
  //   const submitAnswer = [...submittedAnswers];
  //   const existingAnswerIndex = updatedAnswers.findIndex(ans => ans.idSoal === idSoal);
  //   let isPilgan = null;
  //   if (event != undefined || event != null){
  //     isPilgan = event;
  //     idSoal = index;
  //   }

  //   if (existingAnswerIndex !== -1) {
  //     updatedAnswers[existingAnswerIndex] = { urutan, idSoal, answer, nilaiSelected };
  //     submitAnswer[existingAnswerIndex] = { urutan, idSoal, isPilgan };
  //   } else {
  //     updatedAnswers.push({ urutan, idSoal, answer, nilaiSelected });
  //     submitAnswer.push({ urutan, idSoal , isPilgan });
  //   }
  //   console.log(idSoal)

  //   setAnswers(updatedAnswers);
  //   setSubmittedAnswers(submitAnswer);
  //   AppContext_test.indexTest = index;
  // };
  const handleValueAnswer = (urutan, idSoal, answer, nilaiSelected, index, file, id_question) => {
    setSelectedOption(answer);
    const updatedAnswers = [...answers];
    const submitAnswer = [...submittedAnswers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      (ans) => ans.idSoal === idSoal 
    );
    if (file != undefined || file != null){
      const uploadPromises = [];
      uploadPromises.push(
        UploadFile(file.target).then((data) => {
          if (existingAnswerIndex !== -1) {
            updatedAnswers[existingAnswerIndex] = {urutan,idSoal,answer,nilaiSelected};
            submitAnswer[existingAnswerIndex] = {urutan};
          } else {
            updatedAnswers.push({urutan,idSoal,answer,nilaiSelected});
            submitAnswer.push ([urutan,id_question,data.newFileName]) ;
          }
        })
      )
    }else{
      if (existingAnswerIndex !== -1) {
        updatedAnswers[existingAnswerIndex] = {urutan,idSoal,answer,nilaiSelected};
        submitAnswer[existingAnswerIndex] = {urutan};
      } else {
        updatedAnswers.push({urutan,idSoal,answer,nilaiSelected});
        submitAnswer.push ([urutan,idSoal]) ;
      }
    }
      idSoal = index;

    setAnswers(updatedAnswers);
    setSubmittedAnswers(submitAnswer);
    AppContext_test.indexTest = index;
  };
  
  useEffect(() => {
  }, [submittedAnswers]);

  useEffect(() => {
    setAnswerStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[AppContext_test.indexTest - 1] = "answered";
      return newStatus;
    });
  }, [answers, AppContext_test.indexTest]);


  const [answerStatus, setAnswerStatus] = useState([]);

  useEffect(() => {
    const initialAnswerStatus = Array(questionNumbers).fill(null);
    setAnswerStatus(initialAnswerStatus);
  }, [questionNumbers]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:8080/Quiz/GetDataQuestion", {
          idMateri: AppContext_test.materiId,
          status: 'Aktif',
          quizType: quizType,
        });
        const checkIsDone = await axios.post("http://localhost:8080/Quiz/GetDataResultQuiz", {
          materiId: AppContext_test.materiId,
          karyawanId: "1",
        });
        if (checkIsDone.data && Array.isArray(checkIsDone.data)) {
          if (checkIsDone.data.length == 0) {
          } else {
          }
        }

        if (response.data && Array.isArray(response.data)) {
          
          AppContext_test.quizId = response.data[0].ForeignKey;
          const questionMap = new Map();
          const transformedData = response.data.map((item) => {
            const { Soal, TipeSoal, Jawaban, UrutanJawaban, NilaiJawaban, ForeignKey, Key} = item;
            if (!questionMap.has(Soal)) {
              questionMap.set(Soal, true);
              if (TipeSoal === "Essay") {
                return {
                  type: "Essay",
                  question: Soal,
                  correctAnswer: Jawaban,
                  answerStatus: "none",
                  id: Key,
                };
              } else if (TipeSoal === "Praktikum"){
                return {
                  type: "Praktikum",
                  question: Soal,
                  correctAnswer: Jawaban,
                  answerStatus: "none",
                  id: Key,
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
                  type: "Pilgan",
                  question: Soal,
                  options: options,
                  correctAnswer: options.find(option => option === Jawaban && NilaiJawaban !== "0"), 
                  urutan: UrutanJawaban,
                  answerStatus: "none",
                  id: Key,
                };
              }
            }
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
    formDataRef.current.quizId = AppContext_test.quizId
  }, [AppContext_test.quizId]);


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
        setTimeRemaining={setTimeRemaining}
      />
      <div className="flex-fill p-3 d-flex flex-column" style={{ marginLeft: "21vw" }}>
        <div className="mb-3 d-flex flex-wrap" style={{ overflowX: 'auto' }}>
          {currentData.map((item, index) => {
            const key = `${item.question}_${index}`;
            if (index + 1 !== selectedQuestion) return null;
            const currentIndex = index + 1;

            return (
              <div key={key} className="mb-3" style={{ display: 'block', minWidth: '300px', marginRight: '20px' }}>
                {/* Soal */}
                <div className="mb-3">
                  <h4 style={{ wordWrap: 'break-word', overflowWrap: 'break-word', textAlign:'justify' }}>{item.question}</h4>
                </div>

                {/* Jawaban */}
                {item.type === "Praktikum" ? (
                  <FileUpload
                    forInput="jawaban_file"
                    label="Jawaban (.zip)"
                    formatFile=".zip"
                    onChange={(event) => handleFileChange(fileInputRef, "zip", event, index + 1, item.id)}
                  />
                ) : item.type === "Essay" ? (
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
                          <span className="ms-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{option.value}</span>
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
          <div className="float-start my-4 mx-1">
            <ButtonContainer>
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
          </div>
        </form>
      </div>
    </div>
  </>
);

}