import React, { useRef, useState } from "react";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import { Stepper } from 'react-form-stepper';
import * as XLSX from 'xlsx';


export default function MasterPreTestAdd({ onChangePage }) {
  const [formContent, setFormContent] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});
  // const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const addQuestion = (questionType) => {
    const newQuestion = {
      type: questionType,
      text: `Question ${formContent.length + 1}`,
      options: [],
      point: 0,
      correctAnswer: "", // Inisialisasi correctAnswer sebagai string kosong
    };
    setFormContent([...formContent, newQuestion]);
    setSelectedOptions([...selectedOptions, ""]);
  };

  const handleQuestionTypeChange = (e, index) => {
    const { value } = e.target;
    const updatedFormContent = [...formContent];
    updatedFormContent[index] = {
      ...updatedFormContent[index],
      type: value,
      options: value === "essay" ? [] : updatedFormContent[index].options,
    };
    setFormContent(updatedFormContent);
  };

  const handleOptionChange = (e, index) => {
    const { value } = e.target;

    // Update correctAnswer pada formContent
    const updatedFormContent = [...formContent];
    updatedFormContent[questionIndex].correctAnswer = value;
    setFormContent(updatedFormContent);

    // Update selectedOptions untuk radio button yang dipilih
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index] = value;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleOptionLabelChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const updatedFormContent = [...formContent];
    updatedFormContent[questionIndex].options[optionIndex].label = value;
    setFormContent(updatedFormContent);
  };

  const handleAddOption = (index) => {
    const updatedFormContent = [...formContent];
    if (updatedFormContent[index].type === "multiple_choice") {
      updatedFormContent[index].options.push({ label: "", value: "" });
      setFormContent(updatedFormContent);
    }
  };

  const handleChangeQuestion = (index) => {
    const updatedFormContent = [...formContent];
    const question = updatedFormContent[index];

    if (question.type === "essay") {
      // Simpan jawaban benar untuk pertanyaan essay ke state
      setCorrectAnswers((prevCorrectAnswers) => ({
        ...prevCorrectAnswers,
        [index]: question.correctAnswer,
      }));
    } 

    const newType =
      question.type !== "answer"
        ? question.options.length > 0
          ? "answer"
          : "answer"
        : question.options.length > 0
        ? "multiple_choice"
        : "essay";

    updatedFormContent[index] = {
      ...question,
      type: newType,
    };

    setFormContent(updatedFormContent);
  };

  const handleDuplicateQuestion = (index) => {
    const duplicatedQuestion = { ...formContent[index] };
    setFormContent((prevFormContent) => {
      const updatedFormContent = [...prevFormContent];
      updatedFormContent.splice(index + 1, 0, duplicatedQuestion);
      return updatedFormContent;
    });
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelectedOptions = [...prevSelectedOptions];
      updatedSelectedOptions.splice(index + 1, 0, selectedOptions[index]);
      return updatedSelectedOptions;
    });
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedFormContent = [...formContent];
    updatedFormContent[questionIndex].options.splice(optionIndex, 1);
    setFormContent(updatedFormContent);
  };

  const handleDeleteQuestion = (index) => {
    const updatedFormContent = [...formContent];
    updatedFormContent.splice(index, 1);
    setFormContent(updatedFormContent);
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions(updatedSelectedOptions);
    // Hapus correctAnswer dari state saat pertanyaan dihapus
    const updatedCorrectAnswers = { ...correctAnswers };
    delete updatedCorrectAnswers[index];
    setCorrectAnswers(updatedCorrectAnswers);
  };
  const parseExcelData = (data) => {
    const questions = data.map((row, index) => {
      // Skip header row (index 0) and the row below it (index 1)
      if (index < 2) return null; 
  
      const options = row[3] ? row[3].split(',') : [];
      return {
        text: row[1],
        type: row[2].toLowerCase() === 'essay' ? 'essay' : 'multiple_choice', 
        options: options.map((option, idx) => ({ label: option, value: String.fromCharCode(65 + idx) })),
        point: row[4],
        correctAnswer: row[5],
      };
    }).filter(Boolean); // Filter out null values
  
    const initialSelectedOptions = questions.map((question, index) => {
      if (question.type === 'multiple_choice') {
        // Temukan indeks jawaban benar di dalam options
        const correctIndex = question.options.findIndex((option) => option.value === question.correctAnswer);

        if (correctIndex !== -1) {
          // Jika jawaban benar ditemukan, pilih radio button tersebut
          return question.options[correctIndex].value;
        } else {
          // Jika jawaban benar tidak ditemukan, tetapkan nilai kosong
          return ""; 
        }
      } else {
        // Tidak ada pilihan awal untuk pertanyaan Essay
        return ""; 
      }
    });

    setSelectedOptions(initialSelectedOptions);
    setFormContent(questions);
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const handleUploadFile = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        parseExcelData(parsedData);
      };
      reader.readAsBinaryString(selectedFile);
    } else {
      alert("Pilih file Excel terlebih dahulu!");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    // Logika untuk pengiriman data ke server
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template.xlsx'; // Path to your template file in the public directory
    link.download = 'template.xlsx';
    link.click();
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <style>
        {`
          .form-check input[type="radio"] {
            transform: scale(1.5);
            border-color: #000;
          }
          .file-name {
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            max-width: 100%;
          }
          .option-input {
            background: transparent;
            border: none;
            outline: none;
            border-bottom: 1px solid #000;
            margin-left: 20px;
          }
          .form-check {
            margin-bottom: 8px;
          }
          .question-input {
            margin-bottom: 12px;
          }
        `}
      </style>
      <form onSubmit={handleAdd}>
        <div>
          <Stepper
            steps={[
              { label: 'Pretest', onClick:() => onChangePage("pretestAdd")},
              { label: 'Course' ,onClick:() => onChangePage("courseAdd")},
              { label: 'Sharing Expert',onClick:() => onChangePage("sharingAdd")},
              { label: 'Forum' ,onClick:() => onChangePage("forumAdd") },
              { label: 'Post Test',onClick:() => onChangePage("posttestAdd") }
            ]}
            activeStep={0} 
            styleConfig={{
              activeBgColor: '#67ACE9',
              activeTextColor: '#FFFFFF',
              completedBgColor: '#67ACE9',
              completedTextColor: '#FFFFFF',
              inactiveBgColor: '#E0E0E0',
              inactiveTextColor: '#000000',
              size: '2em',
              circleFontSize: '1rem',
              labelFontSize: '0.875rem',
              borderRadius: '50%',
              fontWeight: 500
            }}
            connectorStyleConfig={{
              completedColor: '#67ACE9',
              activeColor: '#67ACE9',
              disabledColor: '#BDBDBD',
              size: 1,
              stepSize: '2em',
              style: 'solid'
            }}
          />
        </div>
        <div className="card">
          <div className="card-header bg-outline-primary fw-medium text-black">
            Add New Pre Test
          </div>
          <div className="card-body p-4">
            <div className="row mb-4">
              <div className="col-lg-6">
                <Input
                  type="time"
                  forInput="namaProduk"
                  label="Timer"
                  isRequired
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="number"
                  label="Minimum score"
                  isRequired
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className="mb-2">
               
              </div>
              <div className="col-lg-4">
                <Button
                  onClick={() => addQuestion("essay")}
                  iconName="plus"
                  classType="primary btn-sm px-3 py-1"
                />
                <input 
                  type="file" 
                  id="fileInput" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                />
               <Button
                  iconName="upload"
                  classType="primary btn-sm mx-2 px-3 py-1"
                  onClick={() => document.getElementById('fileInput').click()} // Memicu klik pada input file
                />
                 {/* Tampilkan nama file yang dipilih */}
                 {selectedFile && <span>{selectedFile.name}</span>} 
                
              </div>
              <div className="p-2">
                <Button
                  iconName="upload"
                  classType="primary btn-sm px-3 py-1"
                  onClick={handleUploadFile} 
                  label="Unggah File" 
                />
                
                  <Button
                  iconName="download"
                  label="Download Template"
                  classType="warning btn-sm px-3 py-1 mx-2"
                  onClick={handleDownloadTemplate}
                  
                />
              </div>
               
            </div>
            {formContent.map((question, index) => (
              <div key={index} className="card mb-4">
                <div className="card-header bg-white fw-medium text-black d-flex justify-content-between align-items-center">
                  <span>Question</span>
                  <span>Point: {question.point}</span> 
                  <div className="col-lg-2">
                  <select className="form-select" aria-label="Default select example" 
                        value={question.type} 
                        onChange={(e) => handleQuestionTypeChange(e, index)}>
                  <option value="essay">Essay</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
                  </div>
                </div>
                <div className="card-body p-4">
                  {question.type === "answer" ? (
                    <div className="row">
                      <div className="col-lg-12 question-input">
                        <Input
                          type="text"
                          forInput={`pertanyaan_${index}`}
                          value={question.text}
                          onChange={(e) => {
                            const updatedFormContent = [...formContent];
                            updatedFormContent[index].text = e.target.value;
                            setFormContent(updatedFormContent);
                          }}
                        />
                      </div>
                      <div className="col-lg-12">
                        <div className="form-check">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} >
                               <input
                                type="radio"
                                id={`option_${index}_${optionIndex}`}
                                name={`option_${index}`}
                                value={option.value}
                                // Checked hanya jika value di selectedOptions sama dengan value dari option
                                checked={selectedOptions[index] === option.value} 
                                onChange={(e) => handleOptionChange(e, index)}
                                style={{ marginRight: '5px' }}
                              />
                              <label htmlFor={`option_${index}_${optionIndex}`}>{option.label}</label>
                            </div>
                          ))}
                        </div>

                        {/* Tampilkan input Correct Answer hanya jika tipe pertanyaan adalah essay */}
                        {question.options.length === 0 && (
                          <Input
                            type="text"
                            label="Correct Answer"
                            value={correctAnswers[index] || ""} 
                            onChange={(e) => {
                              const updatedCorrectAnswers = { ...correctAnswers };
                              updatedCorrectAnswers[index] = e.target.value;
                              setCorrectAnswers(updatedCorrectAnswers);
                              // Update juga correctAnswer pada formContent
                              const updatedFormContent = [...formContent];
                              updatedFormContent[index].correctAnswer = e.target.value;
                              setFormContent(updatedFormContent);
                            }}
                          />
                        )}

                        <Input
                          type="number"
                          label="Point"
                          value={question.point}
                          onChange={(e) => {
                            const updatedFormContent = [...formContent];
                            updatedFormContent[index].point = e.target.value;
                            setFormContent(updatedFormContent);
                          }}
                        />
                        <Button
                          classType="primary btn-sm ms-2 px-3 py-1"
                          label="Done"
                          onClick={() => handleChangeQuestion(index)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-lg-12 question-input">
                        <Input
                          type="text"
                          forInput={`pertanyaan_${index}`}
                          value={question.text}
                          onChange={(e) => {
                            const updatedFormContent = [...formContent];
                            updatedFormContent[index].text = e.target.value;
                            setFormContent(updatedFormContent);
                          }}
                        />
                      </div>

                      {/* Tampilkan tombol gambar dan PDF hanya jika type = essay */}
                      {question.type === "essay" && (
                        <div className="col-lg-2 d-flex align-items-center"> 
                          <input 
                            type="file" 
                            id={`fileInput_${index}`} 
                            style={{ display: 'none' }} 
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                          />
                          <Button 
                            iconName="picture" 
                            classType="btn-sm ms-2 px-3 py-1" 
                            onClick={() => document.getElementById(`fileInput_${index}`).click()}
                          />
                          <Button 
                            iconName="file-pdf" 
                            classType="btn-sm ms-2 px-3 py-1" 
                            onClick={() => document.getElementById(`fileInput_${index}`).click()}
                          />
                          <span className="file-name">{selectedFile && selectedFile.name}</span> 
                        </div>
                      )}
                      {question.type === "multiple_choice" && (
                        <div className="col-lg-12">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="form-check">
                                <input
                                    type="radio"
                                    id={`option_${index}_${optionIndex}`}
                                    name={`option_${index}`}
                                    value={option.value}
                                    checked={selectedOptions[index] === option.value} // Memeriksa apakah nilai opsi ini sudah ada di selectedOptions
                                    onChange={(e) => handleOptionChange(e, index)} // Menggunakan fungsi handleOptionChange saat radio button dipilih
                                    style={{ marginRight: '5px' }}
                                />
                                <input
                                    type="text"
                                    value={option.label}
                                    onChange={(e) => handleOptionLabelChange(e, index, optionIndex)}
                                    className="option-input"
                                    readOnly={question.type === "answer"}
                                />
                                <Button
                                    iconName="delete"
                                    classType="btn-sm ms-2 px-2 py-0"
                                    onClick={() => handleDeleteOption(index, optionIndex)}
                                />
                            </div>
                        ))}

                          {question.type === "multiple_choice" && (
                            <Button
                              onClick={() => handleAddOption(index)}
                              iconName="add"
                              classType="success btn-sm ms-2 px-3 py-1"
                              label="New Option"
                            />
                          )}  
                        </div>
                      )}
                      <div className="d-flex justify-content-between my-2 mx-1">
                        <div>
                          <Button
                            iconName="check"
                            classType="primary btn-sm ms-1 px-2 py-1"
                            label="Answer Key"
                            onClick={() => handleChangeQuestion(index)}
                          />
                        </div>
                        <div>
                          <Button
                            iconName="trash"
                            classType="btn-sm ms-2 px-3 py-1"
                            onClick={() => handleDeleteQuestion(index)}
                          />
                          <Button
                            iconName="duplicate"
                            classType="btn-sm ms-2 px-3 py-1"
                            onClick={() => handleDuplicateQuestion(index)}
                          />
                          <Button
                            iconName="menu-dots-vertical"
                            classType="btn-sm ms-2 px-3 py-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Back"
            onClick={() => onChangePage("index")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Save"
            onClick={() => onChangePage("courseAdd")}
          />
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Next"
            onClick={() => onChangePage("courseAdd")}
          />
        </div>
      </form>
    </>
  );
}