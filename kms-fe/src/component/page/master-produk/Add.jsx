import React, { useRef, useState } from "react";
import { object, string } from "yup";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterProdukAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formContent, setFormContent] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customOptionLabels, setCustomOptionLabels] = useState([]);

  const addQuestion = (questionType) => {
    const newQuestion = {
      type: questionType,
      text: `Pertanyaan ${formContent.length + 1}`,
      options: [],
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
    updatedFormContent[index].options.push({ label: "", value: "" });
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
          .option-input {
            background: transparent;
            border: none;
            outline: none;
          }
          .form-check {
            margin-bottom: 8px; /* Tambahkan jarak antara radio button */
          }
          .question-input {
            margin-bottom: 12px; /* Tambahkan jarak antara textbox pertanyaan dan radio button */
          }
        `}
      </style>
      <form onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Tambah Post Test Baru
          </div>
          <div className="card-body p-4">
            <div className="row mb-4">
              <div className="col-lg-6">
                <Input
                  type="number"
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
                  <div className="col-lg-2">
                    <select className="form-select" aria-label="Default select example" onChange={(e) => handleQuestionTypeChange(e, index)}>
                      <option selected disabled>Pilih jenis pertanyaan...</option>
                      <option value="essay">Essay</option>
                      <option value="multiple_choice">Pilihan Ganda</option>
                    </select>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-12 question-input"> {/* Tambahkan kelas question-input di sini */}
                      <Input
                        type="text"
                        forInput={`pertanyaan_${index}`}
                        value={question.text}
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
                        <div className="form-check">
                          <input type="radio" id={`profile1_${index}`} name={`profile_${index}`} value="profile1" checked={selectedOptions[index] === "profile1"} onChange={(e) => handleOptionChange(e, index)} />
                          <input type="text" value={customOptionLabels[index] || ''} onChange={(e) => handleCustomOptionLabelChange(e, index)} className="option-input" />
                        </div>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="form-check">
                            <input type="radio" id={`option_${index}_${optionIndex}`} name={`option_${index}`} value={option.value} checked={selectedOptions[index] === option.value} onChange={(e) => handleOptionChange(e, index)} />
                            <input type="text" value={option.label} onChange={(e) => handleOptionLabelChange(e, index, optionIndex)} className="option-input" />
                          </div>
                        ))}
                        <Button
                          onClick={() => handleAddOption(index)}
                          iconName="add"
                          classType="primary btn-sm px-2 py-1"
                          label="Tambahkan Opsi"
                        />
                      </div>
                    )}
                    <div className="d-flex justify-content-end my-2 mx-1">
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
              </div>
            ))}
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="BATAL"
            onClick={() => onChangePage("index")}
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
