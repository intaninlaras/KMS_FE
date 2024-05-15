import { useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import { useNavigate } from "react-router-dom";
import uploadFile from "../../util/UploadFile";

const listKataKunci = [
  { Value: "Alat", Text: "Kat Kunci 1" },
  { Value: "Mesin", Text: "Kat Kunci 2" },
  { Value: "Perangkat Lunak", Text: "Kat Kunci 3" },
  { Value: "Lainnya", Text: "Kat Kunci 4" },
];

export default function MasterDaftarPustakaAdd({ onChangePage, withID }) {
  // console.log("KKE: " + withID);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const gambarInputRef = useRef(null);

  const formDataRef = useRef({
    kke_id: withID,
    pus_file: "",
    pus_judul: "",
    pus_keterangan: "",
    pus_kata_kunci: "",
    pus_gambar: "",
    pus_status: "Aktif",
  });

  const userSchema = object({
    kke_id:string(),
    pus_file: string(),
    pus_judul: string(),
    pus_kata_kunci: string().required("harus dipilih"),
    pus_keterangan: string(),
    pus_gambar: string(),
    pus_status: string(),
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
      setIsError((prevError) => {
        return { ...prevError, error: false };
      });
      setErrors({});

      const uploadPromises = [];

      console.log(fileInputRef.current.files[0])
      if (fileInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(fileInputRef.current).then((data) => {
            // console.log("File Upload Response:", JSON.stringify(data));
            formDataRef.current["pus_file"] = data.newFileName;
          })
        );
      }
      
      if (gambarInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(gambarInputRef.current).then((data) => {
            // console.log("Image Upload Response:", JSON.stringify(data));
            formDataRef.current["pus_gambar"] = data.newFileName;
          })
        );
      }

      Promise.all(uploadPromises).then(() => {
        console.log(formDataRef.current.pus_gambar);
        console.log(formDataRef.current.pus_file);
        // console.log("Final formDataRef:", JSON.stringify(formDataRef.current));
        UseFetch(
          API_LINK + "Pustakas/SaveDataPustaka",
          formDataRef.current
        )
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data Pustaka.",
                };
              });
            } else {
              SweetAlert(
                "Sukses",
                "Data Pustaka berhasil disimpan",
                "success"
              );
              navigate("/daftar_pustaka");
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
            Tambah Pustaka Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="pus_judul"
                  label="Judul Pustaka"
                  isRequired
                  value={formDataRef.current.pus_judul}
                  onChange={handleInputChange}
                  errorMessage={errors.pus_judul}
                />
              </div>
              <div className="col-lg-4">
                {/* Dijadikan text biasa */}
                <Input
                  type="text"
                  forInput="pus_kata_kunci"
                  label="Kata Kunci"
                  isRequired
                  value={formDataRef.current.pus_kata_kunci}
                  onChange={handleInputChange}
                  errorMessage={errors.pus_kata_kunci}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={fileInputRef}
                  forInput="pus_file"
                  label="File Pustaka (.pdf, .mp4)"
                  formatFile=".pdf,.mp4"
                  onChange={() =>
                    handleFileChange(fileInputRef, "pdf,mp4")
                  }
                  errorMessage={errors.pus_file}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={gambarInputRef}
                  forInput="pus_gambar"
                  label="Gambar Cover (.jpg, .png)"
                  formatFile=".pdf,.jpg,.png"
                  onChange={() =>
                    handleFileChange(gambarInputRef, "jpg,png")
                  }
                  errorMessage={errors.pus_gambar}
                />
              </div>
              <div className="col-lg-12">
                  <Input
                    type="textarea"
                    forInput="pus_keterangan"
                    label="Keterangan Pustaka"
                    isRequired
                    value={formDataRef.current.pus_keterangan}
                    onChange={handleInputChange}
                    errorMessage={errors.pus_keterangan}
                  />
                </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("list", withID)}
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