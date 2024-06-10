import { useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../../util/Constants";
import { validateAllInputs, validateInput } from "../../../util/ValidateForm";
import SweetAlert from "../../../util/SweetAlert";
import UseFetch from "../../../util/UseFetch";
import UploadFile from "../../../util/UploadFile";
import Button from "../../../part/Button";
import DropDown from "../../../part/Dropdown";
import Input from "../../../part/Input";
import Loading from "../../../part/Loading";
import Alert from "../../../part/Alert";
import { Stepper } from 'react-form-stepper';
import AppContext_test from "../MasterContext";
import FileUpload from "../../../part/FileUpload";
import uploadFile from "../../../util/UploadFile";

export default function MasterSharingAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const gambarInputRef = useRef(null);
  const vidioInputRef = useRef(null);

  const kategori = AppContext_test.kategoriId;
  console.log("kategori di materi: " + AppContext_test.kategoriId);
  const formDataRef = useRef({
    mat_id: "1", 
    mat_sharing_expert_pdf: "",
    mat_sharing_expert_video: "",
  });

  const userSchema = object({
    mat_id: string(),
    mat_sharing_expert_pdf: string(),
    mat_sharing_expert_video: string(),
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

    if (fileSize / 1024 / 1024 > 100) error = "berkas terlalu besar";
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
  
      if (fileInputRef.current && fileInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(fileInputRef.current).then((data) => {
            formDataRef.current["mat_sharing_expert_pdf"] = data.newFileName;
          })
        );
      }
  
      if (vidioInputRef.current && vidioInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(vidioInputRef.current).then((data) => {
            formDataRef.current["mat_sharing_expert_video"] = data.newFileName;
          })
        );
      }
  
      Promise.all(uploadPromises).then(() => {
        console.log('Form Data:', formDataRef.current); // Debugging
        UseFetch(
          API_LINK + "SharingExperts/SaveDataSharing",
          formDataRef.current
        )
          .then((data) => {
            if (data === "ERROR") {
              setIsError({ error: true, message: "Terjadi kesalahan: Gagal menyimpan data Sharing." });
            } else {
              SweetAlert("Sukses", "Data Sharing Expert berhasil disimpan", "success");
              onChangePage("index", kategori);
            }
          })
          .catch((err) => {
            setIsError({ error: true, message: "Terjadi kesalahan: " + err.message });
          })
          .finally(() => setIsLoading(false));
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
        <div>
        <Stepper
             steps={[
              { label: 'Pretest', onClick:() => onChangePage("pretestAdd")},
              { label: 'Materi' ,onClick:() => onChangePage("courseAdd")},
              { label: 'Sharing Expert',onClick:() => onChangePage("sharingAdd")},
              { label: 'Forum' ,onClick:() => onChangePage("forumAdd") },
              { label: 'Post Test',onClick:() => onChangePage("posttestAdd") }
            ]}
            activeStep={2} 
            styleConfig={{
              activeBgColor: '#67ACE9', // Warna latar belakang langkah aktif
              activeTextColor: '#FFFFFF', // Warna teks langkah aktif
              completedBgColor: '#67ACE9', // Warna latar belakang langkah selesai
              completedTextColor: '#FFFFFF', // Warna teks langkah selesai
              inactiveBgColor: '#E0E0E0', // Warna latar belakang langkah non-aktif
              inactiveTextColor: '#000000', // Warna teks langkah non-aktif
              size: '2em', // Ukuran langkah
              circleFontSize: '1rem', // Ukuran font label langkah
              labelFontSize: '0.875rem', // Ukuran font label langkah
              borderRadius: '50%', // Radius sudut langkah
              fontWeight: 500 // Ketebalan font label langkah
            }}
            connectorStyleConfig={{
              completedColor: '#67ACE9', // Warna penghubung selesai
              activeColor: '#67ACE9', // Warna penghubung aktif
              disabledColor: '#BDBDBD', // Warna penghubung non-aktif
              size: 1, // Ketebalan penghubung
              stepSize: '2em', // Ukuran langkah, digunakan untuk menghitung ruang yang dipadatkan antara langkah dan awal penghubung
              style: 'solid' // Gaya penghubung
            }}
          />
        </div>

        <div className="card">
          <div className="card-header bg-outline-primary fw-medium text-black">
            Tambah Sharing Expert
          </div>
          <div className="card-body p-4">
            <div className="row">
              
              <div className="col-lg-6">
                <FileUpload
                  ref={fileInputRef}
                  forInput="mat_sharing_expert_pdf"
                  label="File Sharing Expert (.pdf)"
                  formatFile=".pdf"
                  onChange={() =>
                    handleFileChange(fileInputRef, "pdf")
                  }
                  errorMessage={errors.mat_sharing_expert_pdf}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  ref={vidioInputRef}
                  forInput="mat_sharing_expert_video"
                  label="Vidio Sharing Expert (.mp4, .mov)"
                  formatFile=".mp4,.mov"
                  onChange={() =>
                    handleFileChange(vidioInputRef, "mp4,mov")
                  }
                  errorMessage={errors.mat_sharing_expert_video}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("materiAdd")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Simpan"
          />
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("forumAdd")}
          />
        </div>
      </form>
    </>
  );
}
