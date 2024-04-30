import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterProsesEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    idProses: "",
    namaProses: "",
    modul: "",
    deskripsi: "",
  });

  const fileModulRef = useRef(null);

  const userSchema = object({
    idProses: string(),
    namaProses: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    modul: string(),
    deskripsi: string(),
  });

  useEffect(() => {
    setIsError((prevError) => {
      return { ...prevError, error: false };
    });
    UseFetch(API_LINK + "MasterProses/GetDataProsesById", {
      id: withID,
    })
      .then((data) => {
        if (data === "ERROR" || data.length === 0) {
          setIsError((prevError) => {
            return {
              ...prevError,
              error: true,
              message: "Terjadi kesalahan: Gagal mengambil data proses.",
            };
          });
        } else formDataRef.current = { ...formDataRef.current, ...data[0] };
      })
      .then(() => setIsLoading(false));
  }, []);

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

      if (fileModulRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileModulRef.current).then(
            (data) => (formDataRef.current["modul"] = data.Hasil)
          )
        );
      }

      Promise.all(uploadPromises).then(() => {
        UseFetch(API_LINK + "MasterProses/EditProses", formDataRef.current)
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data proses.",
                };
              });
            } else {
              SweetAlert("Sukses", "Data proses berhasil disimpan", "success");
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
            Ubah Data Proses
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="namaProses"
                  label="Nama Proses"
                  isRequired
                  value={formDataRef.current.namaProses}
                  onChange={handleInputChange}
                  errorMessage={errors.namaProses}
                />
              </div>
              <div className="col-lg-3">
                <FileUpload
                  forInput="modul"
                  label="Modul (.pdf, .zip)"
                  formatFile=".pdf,.zip"
                  ref={fileModulRef}
                  onChange={() => handleFileChange(fileModulRef, "pdf,zip")}
                  errorMessage={errors.modul}
                  hasExisting={formDataRef.current.modul}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="deskripsi"
                  label="Deskripsi"
                  value={formDataRef.current.deskripsi}
                  onChange={handleInputChange}
                  errorMessage={errors.deskripsi}
                />
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