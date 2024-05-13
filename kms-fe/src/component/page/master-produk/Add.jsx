import React, { useRef, useState } from "react";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import { Stepper } from 'react-form-stepper';

export default function MasterProdukAdd({ onChangePage }) {
  const [formContent, setFormContent] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customOptionLabels, setCustomOptionLabels] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});

  const addQuestion = (questionType) => {
    const newQuestion = {
      type: questionType,
      text: `Question ${formContent.length + 1}`,
      options: [],
      point: 0,
    };
    setFormContent([...formContent, newQuestion]);
    setSelectedOptions([...selectedOptions, ""]);
    setCustomOptionLabels([...customOptionLabels, ""]);
  };

  const handleQuestionTypeChange = (e, index) => {
    const { value } = e.target;
    const updatedFormContent = [...formContent];
    const question = updatedFormContent[index];

    if (value === "essay") {
      // Mengubah pertanyaan menjadi tipe essay
      updatedFormContent[index] = {
        ...question,
        type: "essay",
        options: [], // Hapus opsi jika pertanyaan adalah essay
      };
      setSelectedOptions((prevSelectedOptions) => {
        const updatedOptions = [...prevSelectedOptions];
        updatedOptions[index] = ""; // Reset opsi yang dipilih
        return updatedOptions;
      });
      setCustomOptionLabels((prevCustomOptionLabels) => {
        const updatedLabels = [...prevCustomOptionLabels];
        updatedLabels[index] = ""; // Reset label khusus
        return updatedLabels;
      });
    } else if (value === "multiple_choice") {
      // Mengubah pertanyaan menjadi tipe multiple_choice
      updatedFormContent[index] = {
        ...question,
        type: "multiple_choice",
      };
    }

    setFormContent(updatedFormContent);
  };

  const handleOptionChange = (e, index) => {
    const { value } = e.target;
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index] = value;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleCustomOptionLabelChange = (e, index) => {
    const { value } = e.target;
    const updatedCustomOptionLabels = [...customOptionLabels];
    updatedCustomOptionLabels[index] = value;
    setCustomOptionLabels(updatedCustomOptionLabels);
  };

  const handleOptionLabelChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const updatedFormContent = [...formContent];
    updatedFormContent[questionIndex].options[optionIndex].label = value;
    setFormContent(updatedFormContent);
  };

  const handleAddOption = (index) => {
    const updatedFormContent = [...formContent];
  
    // Tambahkan pengecekan apakah tipe pertanyaan adalah "multiple_choice"
    if (updatedFormContent[index].type === "multiple_choice") {
      updatedFormContent[index].options.push({ label: "", value: "" });
      setFormContent(updatedFormContent);
    }
  };
  
  const handleChangeQuestion = (index) => {
    const updatedFormContent = [...formContent];
    const question = updatedFormContent[index];
    const updatedSelectedOptions = [...selectedOptions];
    const updatedCustomOptionLabels = [...customOptionLabels];
  
    if (question.type === "essay") {
      // Menambahkan jawaban benar untuk pertanyaan essay ke dalam state
      setCorrectAnswers((prevCorrectAnswers) => ({
        ...prevCorrectAnswers,
        [index]: question.correctAnswer || "", // default value untuk jawaban benar
      }));
    }
  
    if (question.type !== "answer") {
      const answerQuestion = {
        type: "answer",
        text: question.text,
        options: question.options,
        point: question.point,
        correctAnswer: question.correctAnswer || "", // Menyimpan jawaban benar jika ada
      };
      updatedFormContent.splice(index, 1, answerQuestion);
      updatedSelectedOptions.splice(index, 1, "");
      updatedCustomOptionLabels.splice(index, 1, "");
    } else {
      const questionType = question.options ? "multiple_choice" : "essay";
      const questionItem = {
        type: questionType,
        text: question.text,
        options: question.options || [],
        point: question.point,
        correctAnswer: question.correctAnswer || "", // Menyimpan jawaban benar jika ada
      };
      updatedFormContent.splice(index, 1, questionItem);
      updatedSelectedOptions.splice(index, 1, "");
      updatedCustomOptionLabels.splice(index, 1, "");
    }
  
    setFormContent(updatedFormContent);
    setSelectedOptions(updatedSelectedOptions);
    setCustomOptionLabels(updatedCustomOptionLabels);
  };

  const handleDuplicateQuestion = (index) => {
    const duplicatedQuestion = { ...formContent[index] };
    setFormContent((prevFormContent) => {
      const updatedFormContent = [...prevFormContent];
      updatedFormContent.splice(index + 1, 0, duplicatedQuestion);
      return updatedFormContent;
    });
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index + 1, 0, selectedOptions[index]);
    setSelectedOptions(updatedSelectedOptions);
    const updatedCustomOptionLabels = [...customOptionLabels];
    updatedCustomOptionLabels.splice(index + 1, 0, customOptionLabels[index]);
    setCustomOptionLabels(updatedCustomOptionLabels);
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
    const updatedCustomOptionLabels = [...customOptionLabels];
    updatedCustomOptionLabels.splice(index, 1);
    setCustomOptionLabels(updatedCustomOptionLabels);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    // Logika untuk pengiriman data ke server
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
              { label: 'Materi' },
              { label: 'Pretest' },
              { label: 'Post Test' },
              { label: 'Sharing Expert'},
              { label: 'Forum'  }
            ]}
            activeStep={5} 
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
            Add New Post Test
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
              <div className="col-lg-2">
                <Button
                  onClick={() => addQuestion("essay")}
                  iconName="plus"
                  classType="primary btn-sm px-3 py-1"
                  
                />
                <Button
                  iconName="upload"
                  classType="primary btn-sm mx-2 px-3 py-1"
                />
              </div>
            </div>
            {formContent.map((question, index) => (
              <div key={index} className="card mb-4">
                <div className="card-header bg-white fw-medium text-black d-flex justify-content-between align-items-center">
                  <span>Question</span>
                  <span>Point: {question.point}</span> {/* Tampilkan point di sini */}
                  <div className="col-lg-2">
                    <select className="form-select" aria-label="Default select example" onChange={(e) => handleQuestionTypeChange(e, index)}>
                     
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
                            <div key={optionIndex}>
                              <input
                                type="radio"
                                id={`option_${index}_${optionIndex}`}
                                name={`option_${index}`}
                                value={option.value}
                                checked={selectedOptions[index] === option.value}
                                onChange={(e) => handleOptionChange(e, index)}
                                style={{ marginRight: '15px' }}
                              />
                              <label htmlFor={`option_${index}_${optionIndex}`}>{option.label}</label>
                            </div>
                          ))}
                        </div>
                        <Input
    type="text"
    label="Correct Answer"
    value={question.correctAnswer || ""}
    onChange={(e) => {
      const updatedFormContent = [...formContent];
      updatedFormContent[index].correctAnswer = e.target.value;
      setFormContent(updatedFormContent);
    }}
  />
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
                      {question.type === "essay" && (
                        <div className="col-lg-2">
                          <Button
                            iconName="picture"
                            classType="btn-sm ms-2 px-3 py-1"
                          />
                          <Button
                            iconName="file-pdf"
                            classType="btn-sm ms-2 px-3 py-1"
                          />
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
                                checked={selectedOptions[index] === option.value}
                                onChange={(e) => handleOptionChange(e, index)}
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
    classType="primary btn-sm ms-2 px-3 py-1"
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
            label="BATAL"
            onClick={() => onChangePage("add")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="SIMPAN"
            onClick={() => onChangePage("sharingexpert")}
          />
        </div>
      </form>
    </>
  );
}
