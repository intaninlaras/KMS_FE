import { useRef, useState } from "react";
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


const listJenisProduk = [
  { Value: "Part", Text: "Part" },
  { Value: "Unit", Text: "Unit" },
  { Value: "Konstruksi", Text: "Konstruksi" },
  { Value: "Mass Production", Text: "Mass Production" },
  { Value: "Lainnya", Text: "Lainnya" },
];

export default function MasterProdukAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formContent, setFormContent] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [textField, setTextField] = useState("");
  const [editedField, setEditedField] = useState("");

  const addQuestion = () => {
    const field = {
      "name": `question_${formContent.length}`,
      "label": "Untitled question",
      "question_type": "short_answer", // "paragraph", "multichoice",
      "list": []
    }
    setFormContent([...formContent, field]);
  }

  const formDataRef = useRef({
    namaProduk: "",
    jenisProduk: "",
    gambarProduk: "",
    spesifikasi: "",
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
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };



  const handleAdd = async (e) => {
    e.preventDefault();

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

      if (fileGambarRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileGambarRef.current).then(
            (data) => (formDataRef.current["gambarProduk"] = data.Hasil)
          )
        );
      }

      Promise.all(uploadPromises).then(() => {
        UseFetch(API_LINK + "MasterProduk/CreateProduk", formDataRef.current)
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data produk.",
                };
              });
            } else {
              SweetAlert("Sukses", "Data produk berhasil disimpan", "success");
              onChangePage("index");
            }
          })
          .then(() => setIsLoading(false));
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Tambah Post Test Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Input
                  type="number"
                  forInput="namaProduk"
                  label="Durasi Pengerjaan Post Test"
                  isRequired
                  value={formDataRef.current.namaProduk}
                  onChange={handleInputChange}
                  errorMessage={errors.namaProduk}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="number"
                  label="Nilai Minimum Post Test"
                  arrData={listJenisProduk}
                  isRequired
                  value={formDataRef.current.jenisProduk}
                  onChange={handleInputChange}
                  errorMessage={errors.jenisProduk}
                />
              </div>
              <div className="float-end my-4 mx-1">
                 <Button onClick={() => addQuestion()}
              iconName="plus"
              classType="primary btn-sm ms-2 px-3 py-1"             
            />
            <Button
              iconName="arrow-down"
              classType="primary btn-sm ms-2 px-3 py-1"             
            />
              </div>
              <div className="card">
              <div className="card-header bg-white fw-medium text-black d-flex justify-content-between align-items-center" >
                <span>Pertanyaan</span>
                <div className="col-lg-2">
                  <select className="form-select" aria-label="Default select example">
                    <option selected>Pilih kategori...</option>
                    <option value="1">Essay</option>
                    <option value="2">Pilihan Ganda</option>
                  </select>
                      </div>
                      </div>
                      <div className="card-body p-4">
                        <div className="row">
                          <div className="col-lg-12">
                            <Input
                              type="text"
                              forInput="namaProduk"
                              value="Pertanyaan"

                            />
                
              </div>
              <div className="col-lg-12">
                <div className="form-check">
                  <input type="radio" id="profile1" name="profile" value="profile1" />
                  <label className="form-check-label mt-2 mb-2" htmlFor="profile1"> Opsi 1</label>
                </div>
                <div className="form-check">
                  <input type="radio" id="profile2" name="profile" value="profile2" />
                  <label className="form-check-label mb-2" htmlFor="profile2"> Opsi 2</label>
                </div>
                <div className="form-check">
                  <input type="radio" id="profile3" name="profile" value="profile3" />
                  <label className="form-check-label mb-2" htmlFor="profile3"> Opsi 3</label>
                </div>
              </div>
              <div className="d-flex justify-content-end my-2 mx-1">
              <Button
              iconName="trash"
              classType="btn-sm ms-2 px-3 py-1"             
            />
                          <Button
              iconName="duplicate"
              classType="btn-sm ms-2 px-3 py-1"             
            />
                                      <Button
              iconName="menu-dots-vertical"
              classType="btn-sm ms-2 px-3 py-1"             
            />
                                                  
    </div>
              </div>
              </div>
            </div>
            <div className="card my-4">
              <div className="card-header bg-white fw-medium text-black d-flex justify-content-between align-items-center" >
    <span>Pertanyaan</span>
    <div className="col-lg-2">
      <select className="form-select" aria-label="Default select example">
        <option selected>Pilih kategori...</option>
        <option value="1">Essay</option>
        <option value="2">Pilihan Ganda</option>
       </select>
          </div>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="namaProduk"
                  value="Pertanyaan"

                />
                
              </div>
                  <div className="d-flex justify-content-end my-2 mx-1">
              <Button
              iconName="trash"
              classType="btn-sm ms-2 px-3 py-1"             
            />
                          <Button
              iconName="duplicate"
              classType="btn-sm ms-2 px-3 py-1"             
            />
                                      <Button
              iconName="menu-dots-vertical"
              classType="btn-sm ms-2 px-3 py-1"             
            />
            </div>
            </div>
            </div>
            </div>
            </div>
            
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
