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
import { Stepper } from 'react-form-stepper';
import axios from "axios";

const userSchema = object({
  forumJudul: string().max(100, "maksimum 100 karakter").required("harus diisi"),
  forumIsi: string().required("harus diisi"),
});

export default function MasterForumAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const formDataRef = useRef({
    materiId:"00003",
    karyawanId: "1",
    forumJudul: "",
    forumIsi: "",
    forumStatus: "Aktif",
    createdBy: "",
  });

  const fileGambarRef = useRef(null);

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

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
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
              setIsError({
                error: true,
                message: "Terjadi kesalahan: Gagal menyimpan data produk.",
              });
            } else {
              SweetAlert("Sukses", "Data produk berhasil disimpan", "success");
              onChangePage("index");
            }
          })
          .then(() => setIsLoading(false));
      });
    }
    console.log("Data yang dikirim ke backend:", formDataRef.current);
    const response = await axios.post("http://localhost:8080/Forums/SaveDataForum", formDataRef.current);
    console.log(response);
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
        <div>
          <Stepper
            steps={[
              { label: 'Pretest', onClick: () => onChangePage("pretestAdd") },
              { label: 'Course', onClick: () => onChangePage("courseAdd") },
              { label: 'Sharing Expert', onClick: () => onChangePage("sharingAdd") },
              { label: 'Forum', onClick: () => onChangePage("forumAdd") },
              { label: 'Post Test', onClick: () => onChangePage("posttestAdd") }
            ]}
            activeStep={3} 
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
            Add Forum
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="forumJudul"
                  label="Forum Title"
                  value={formDataRef.current.forumJudul}
                  onChange={handleInputChange}
                  errorMessage={errors.forumJudul}
                />
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="forumIsi" className="form-label fw-bold">
                    Forum Contents
                  </label>
                  <textarea
                    id="forumIsi"
                    name="forumIsi"
                    className={`form-control ${errors.forumIsi ? 'is-invalid' : ''}`}
                    value={formDataRef.current.forumIsi}
                    onChange={handleInputChange}
                  />
                  {errors.forumIsi && (
                    <div className="invalid-feedback">{errors.forumIsi}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Back"
            onClick={() => onChangePage("sharingAdd")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Save"
          />
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Next"
            onClick={() => onChangePage("posttestAdd")}
          />
        </div>
      </form>
    </>
  );
}
