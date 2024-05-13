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

    const addQuestion = (questionType) => {
      const newQuestion = {
        type: questionType,
        text: `Pertanyaan ${formContent.length + 1}`,
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
      updatedFormContent[index].type = value;
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

      if (updatedFormContent[index].type === "answer") {
        updatedFormContent[index].type = "multiple_choice";
      }

      updatedFormContent[index].options.push({ label: "", value: "" });
      setFormContent(updatedFormContent);
    };

    const handleDeleteQuestion = (index) => {
      const updatedFormContent = [...formContent];
      const question = updatedFormContent[index];
      const updatedSelectedOptions = [...selectedOptions];
      const updatedCustomOptionLabels = [...customOptionLabels];

      if (question.type !== "answer") {
        const answerQuestion = {
          type: "answer",
          text: question.text,
          options: question.options,
          point: question.point,
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
          <Stepper
            steps={[
              { label: 'Materi' },
              { label: 'Pretest' },
              { label: 'Post Test' },
              { label: 'Sharing Expert'},
              { label: 'Forum'  }
            ]}
            activeStep={5} 
          />
          <div className="card">
            <div className="card-header bg-primary fw-medium text-white">
              Tambah Post Test Baru
            </div>
            <div className="card-body p-4">
              <div className="row mb-4">
                <div className="col-lg-6">
                  <Input
                    type="time"
                    forInput="namaProduk"
                    label="Durasi Pengerjaan Post Test"
                    isRequired
                  />
                </div>
                <div className="col-lg-6">
                  <Input
                    type="number"
                    label="Nilai Minimum Post Test"
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
                    <span>Pertanyaan</span>
                    <span>Point: {question.point}</span> {/* Tampilkan point di sini */}
                    <div className="col-lg-2">
                      <select className="form-select" aria-label="Default select example" onChange={(e) => handleQuestionTypeChange(e, index)}>
                        <option selected disabled>Pilih jenis pertanyaan...</option>
                        <option value="essay">Essay</option>
                        <option value="multiple_choice">Pilihan Ganda</option>
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
                                />
                                <label htmlFor={`option_${index}_${optionIndex}`}>{option.label}</label>
                              </div>
                            ))}
                          </div>
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
                            label="Selesai"
                            onClick={() => handleDeleteQuestion(index)}
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
                            <Button
                              onClick={() => handleAddOption(index)}
                              iconName="add"
                              classType="primary btn-sm ms-2 px-3 py-1"
                              label="Tambahkan Opsi"
                              disabled={question.type === "answer"}
                            />
                          </div>
                        )}
                        <div className="d-flex justify-content-between my-2 mx-1">
                          <div>
                            <Button
                              iconName="check"
                              classType="primary btn-sm ms-2 px-3 py-1"
                              label="Kunci Jawaban"
                              onClick={() => handleDeleteQuestion(index)}
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
              type="submit"
              onClick={() => onChangePage("materi")}
            />
            <Button
              classType="primary ms-2 px-4 py-2"
              type="submit"
              label="SIMPAN"
            />
          </div>
        </form>
      </>
    );
  }
