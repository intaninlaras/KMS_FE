import React, { useRef, useState } from "react";
import { object, string } from "yup";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

const listJenisProduk = [
  { Value: "Part", Text: "Part" },
  { Value: "Unit", Text: "Unit" },
  { Value: "Konstruksi", Text: "Konstruksi" },
  { Value: "Mass Production", Text: "Mass Production" },
  { Value: "Lainnya", Text: "Lainnya" },
];

export default function MasterProdukAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formContent, setFormContent] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customOptionLabels, setCustomOptionLabels] = useState([]); // State untuk menyimpan label kustom untuk setiap radiobutton
  const formDataRef = useRef({
    namaProduk: "",
    jenisProduk: "",
    gambarProduk: "",
    spesifikasi: "",
    jenisPertanyaan: ""
  });

  const userSchema = object({
    namaProduk: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    jenisProduk: string().required("harus dipilih"),
    gambarProduk: string(),
    spesifikasi: string(),
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    formDataRef.current[name] = value;
    setErrors({});
  };

  const addQuestion = (questionType) => {
    const newQuestion = {
      type: questionType,
      text: `Pertanyaan ${formContent.length + 1}`,
    };
    setFormContent([...formContent, newQuestion]);
    
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

  const handleDeleteQuestion = (index) => {
    const updatedFormContent = [...formContent];
    updatedFormContent.splice(index, 1); // Hapus pertanyaan dari daftar
    setFormContent(updatedFormContent);
  };

  const handleDuplicateQuestion = (index) => {
    const duplicatedQuestion = { ...formContent[index] }; // Salin pertanyaan yang dipilih
    setFormContent((prevFormContent) => {
      const updatedFormContent = [...prevFormContent]; // Salin daftar pertanyaan yang ada
      updatedFormContent.splice(index + 1, 0, duplicatedQuestion); // Sisipkan pertanyaan yang disalin setelah pertanyaan asli
      return updatedFormContent;
    });
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
                    <div className="col-lg-12">
                      <Input
                        type="text"
                        forInput={`pertanyaan_${index}`}
                        value={question.text}
                      />
                    </div>
                    {question.type === "essay" && (
          <div className="col-lg-2">
            <button className="btn btn-sm text-primary"><i class="fa-solid fa-image"></i></button>
            <button className="btn btn-sm text-primary"><i class="fa-solid fa-file-pdf"></i></button>
          </div>
        )}
                    {question.type === "multiple_choice" && (
                      <div className="col-lg-12">
                        <div className="form-check">
                          <input type="radio" id={`profile1_${index}`} name={`profile_${index}`} value="profile1" checked={selectedOptions[index] === "profile1"} onChange={(e) => handleOptionChange(e, index)} />
                          <input type="text" value={customOptionLabels[index] || ''} onChange={(e) => handleCustomOptionLabelChange(e, index)} /> {/* Input teks untuk label kustom */}
                        </div>
                        <div className="form-check">
                          <input type="radio" id={`profile2_${index}`} name={`profile_${index}`} value="profile2" checked={selectedOptions[index] === "profile2"} onChange={(e) => handleOptionChange(e, index)} />
                          <input type="text" value={customOptionLabels[index] || ''} onChange={(e) => handleCustomOptionLabelChange(e, index)} /> {/* Input teks untuk label kustom */}
                        </div>
                        <div className="form-check">
                          <input type="radio" id={`profile3_${index}`} name={`profile_${index}`} value="profile3" checked={selectedOptions[index] === "profile3"} onChange={(e) => handleOptionChange(e, index)} />
                          <input type="text" value={customOptionLabels[index] || ''} onChange={(e) => handleCustomOptionLabelChange(e, index)} /> {/* Input teks untuk label kustom */}
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-end my-2 mx-1">
                      <Button
                        iconName="trash"
                        classType="btn-sm ms-2 px-3 py-1"
                        onClick={() => handleDeleteQuestion(index)} // Menghapus pertanyaan saat tombol trash diklik

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
