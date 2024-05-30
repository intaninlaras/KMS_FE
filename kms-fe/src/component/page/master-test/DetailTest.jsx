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
import axios from "axios";

const ButtonContainer = styled.div`
    position: fixed;
    bottom: 35px;
    left: 30%;
    transform: translateX(-50%);
    z-index: 999;
  `;

export default function PengerjaanTest({ onChangePage }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [questionNumbers, setQuestionNumbers] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState();
  const [answerStatus, setAnswerStatus] = useState([]);

  const selectPreviousQuestion = () => {
    if (selectedQuestion > 1) {
      setSelectedQuestion(selectedQuestion - 1);
    } else {
      setSelectedQuestion(selectedQuestion + totalQuestion - 1);
    }
  };

  const selectNextQuestion = () => {
    if (selectedQuestion < totalQuestion) {
      setSelectedQuestion(selectedQuestion + 1);
    } else {
      setSelectedQuestion(selectedQuestion - totalQuestion + 1);
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
  
  useEffect(() => {
    document.documentElement.style.setProperty('--responsiveContainer-margin-left', '0vw');
    const sidebarMenuElement = document.querySelector('.sidebarMenu');
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add('sidebarMenu-hidden');
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch questions data
        const questionResponse = await axios.post("http://localhost:8080/Quiz/GetDataQuestion", {
          quizId: '1',
          status: 'Aktif',
          quizType: '',
        });

        // Fetch user answers data
        const answerResponse = await axios.post("http://localhost:8080/Quiz/GetDataResultQuiz", {
          quizId: '1',
          userId: '1', 
          tipeQuiz: "Pretest",
        });

        if (questionResponse.data && Array.isArray(questionResponse.data) &&
            answerResponse.data && Array.isArray(answerResponse.data)) {
          
          const questionMap = new Map();
          let resultJawabanPengguna = [];
          
          answerResponse.data.map((answer) => {
            resultJawabanPengguna = answer.JawabanPengguna;
          });

          const parsedArray = JSON.parse(resultJawabanPengguna);

          const jawabanPengguna = {
              value: [],
              soal: []
          };

          // Melakukan iterasi pada array dan memisahkan nilai dan soal
          for (let i = 0; i < parsedArray.length; i++) {
              jawabanPengguna.value.push(parsedArray[i][0]);
              jawabanPengguna.soal.push(parsedArray[i][1]);
          }

          const transformedData = questionResponse.data.map((item) => {
            const { Soal, TipeSoal, Jawaban, UrutanJawaban, NilaiJawaban, ForeignKey, Key, JawabanPengguna} = item;
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
                const options = questionResponse.data
                  .filter(choice => choice.Key === item.Key)
                  .map(choice => ({
                    value: choice.Jawaban,
                    urutan: choice.UrutanJawaban,
                    nomorSoal: choice.Key,
                    nilai: choice.NilaiJawaban,
                  }));
                return {
                  type: "pilgan",
                  question: Soal,
                  options: options,
                  correctAnswer: options.find(option => option.value === Jawaban && option.nilai !== "0"),
                  urutan: UrutanJawaban,
                  nilaiJawaban: NilaiJawaban,
                  jawabanPengguna_value: jawabanPengguna.value,
                  jawabanPengguna_soal: jawabanPengguna.soal,
                };
              }
            }
            return null;
          }).filter(item => item !== null);
          setTotalQuestion(transformedData.length)
          setQuestionNumbers(transformedData.length);
          setCurrentData(transformedData);
          
          updateAnswerStatus(transformedData, jawabanPengguna);
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

  const updateAnswerStatus = (questions, jawabanPengguna) => {
    const statusArray = questions.map((question, index) => {
      if (question.type === "essay") {
        return "none";
      } else {
        const userAnswerIndex = jawabanPengguna.soal.indexOf(index + 1);
        const userAnswer = jawabanPengguna.value[userAnswerIndex];
        const correctOption = question.options.find(option => option.nilai == 25);

        if (userAnswer === correctOption.urutan) {
          return "correct";
        } else {
          return "incorrect";
        }
      }
    });
    setAnswerStatus(statusArray);
  };  

  const processOptions = (nomorSoal, jawabanPengguna_soal) => {
    let fix_jawabanPengguna_soal;
    let i = 0;
    for (i = 0; i <= jawabanPengguna_soal.length; i++) {
      if (nomorSoal == jawabanPengguna_soal[i]){
        break;
      }
    }
    return i ;
  };

  useEffect(() => {
    const cekQuestion = (nomorSoal, jawabanPengguna_soal) => {

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
          checkMainContent="detail_test"
        />
        <div className="flex-fill p-3 d-flex flex-column"  style={{marginLeft:"21vw"}}>
          <div className="mb-3" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}> 
            {currentData.map((item, index) => {
              if (index + 1 !== selectedQuestion) return null;
             
              return (
                <div key={index} className="mb-3" style={{ display: 'inline-block', verticalAlign: 'top', minWidth: '300px', marginRight: '20px' }}>
                  {/* Soal */}
                  <div className="mb-3">
                    <h4>{item.question}</h4>
                  </div>

                  {/* Jawaban */}
                  {item.type === "essay" ? (
                    <FileCard fileName="Jawaban.docx" />
                  ) : (
                    
                    <div className="d-flex flex-column">
                      {item.options.map((option, index) => {
                        let i = 1;
                        i = processOptions(option.nomorSoal, item.jawabanPengguna_soal);
                        const isSelected = option.urutan == item.jawabanPengguna_value[i] ? true : false; 
                        const isCorrect = option.nilai == 25 ? true : false;
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
                          key={option.urutan} 
                          className="mt-4 mb-2"
                          style={{ display: 'flex', alignItems: 'center'}} 
                        >
                          <button
                            className="btn btn-outline-primary"
                            style={{ width: "40px", height: "40px", borderColor:borderColor1, backgroundColor:backgroundColor1, color: borderColor1}}
                          >
                            {String.fromCharCode(65 + index)}
                          </button>
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

          <form>
            <div className="float-start my-4 mx-1 " >
              <ButtonContainer>
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
              </ButtonContainer>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}