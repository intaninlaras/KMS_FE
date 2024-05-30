import { useRef, useState ,useEffect} from "react";
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
import { Stepper } from 'react-form-stepper';
import uploadFile from "../../util/UploadFile";


export default function MasterCourseAdd({ onChangePage}) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listKategori, setListKategori] = useState([]);

  const fileInputRef = useRef(null);
  const gambarInputRef = useRef(null);
  const vidioInputRef = useRef(null);

  const formDataRef = useRef({
    kat_id:"",
    mat_judul: "", 
    mat_file_pdf: "",
    mat_file_vidio: "",
    mat_pengenalan: "",
    mat_keterangan: "",
    kry_id: "1",
    mat_kata_kunci: "",
    mat_gambar: "",
    createBy: "dummy",
  });

  const userSchema = object({
    kat_id: string(),
    mat_judul: string(),
    mat_file_pdf: string(),
    mat_file_vidio: string(),
    mat_pengenalan: string(),
    mat_keterangan: string(),
    kry_id: string(),
    mat_kata_kunci: string(),
    mat_gambar: string(),
    createBy: string(),
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
            formDataRef.current["mat_file_pdf"] = data.newFileName;
          })
        );
      }

      if (gambarInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(gambarInputRef.current).then((data) => {
            // console.log("Image Upload Response:", JSON.stringify(data));
            formDataRef.current["mat_gambar"] = data.newFileName;
          })
        );
      }
      if (vidioInputRef.current.files.length > 0) {
        uploadPromises.push(
          uploadFile(vidioInputRef.current).then((data) => {
            // console.log("Image Upload Response:", JSON.stringify(data));
            formDataRef.current["mat_file_vidio"] = data.newFileName;
          })
        );
      }

      Promise.all(uploadPromises).then(() => {
        // console.log(formDataRef.current.mat_gambar);
        // console.log(formDataRef.current.mat_sharing_expert);
        // console.log(formDataRef.current.mat_file);
        // console.log(formDataRef.current.kat_id);
        // console.log("Final formDataRef:", JSON.stringify(formDataRef.current));
        console.log("Filter: " + JSON.stringify(formDataRef.current));
        UseFetch(
          API_LINK + "Materis/SaveDataMateri",
          formDataRef.current
        )
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data Materi.",
                };
              });
            } else {
              SweetAlert(
                "Sukses",
                "Data Materi berhasil disimpan",
                "success"
              );
              onChangePage("index")
            }
          })
          .then(() => setIsLoading(false));
      });
    }
  };

  useEffect(() => {
    const fetchDataKategori = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "Materis/GetListKategoriProgram", {
          page: 1,
          query: "",
          sort: "[Nama Kategori] asc",
          status: "Aktif",
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar kategori program.");
        } else {
          // Mengubah data menjadi format yang diinginkan
          const formattedData = data.map(item => ({
            Value: item["Key"],
            Text: item["Nama Kategori"]
          }));
          setListKategori(formattedData);
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListKategori([]);
      }
    };
    fetchDataKategori();
  }, []);
    
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
            { label: 'Course' ,onClick:() => onChangePage("courseAdd")},
            { label: 'Sharing Expert',onClick:() => onChangePage("sharingAdd")},
            { label: 'Forum' ,onClick:() => onChangePage("forumAdd") },
            { label: 'Post Test',onClick:() => onChangePage("posttestAdd") }
          ]}
            activeStep={1} 
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
          <div className="card-header bg-outline-primary fw-medium text-white">
            Tambah Materi Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="mat_judul"
                  label="Kelompok Keahlian"
                  placeholder="Kelompok Keahlian"
                  value={formDataRef.current.mat_judul}
                  onChange={handleInputChange}
                  errorMessage={errors.mat_judul}
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="kat_id"
                  label="Kategori program"
                  placeholder="Kategori program"
                  arrData={listKategori}
                  isRequired
                  value={formDataRef.current.kat_id}
                  onChange={handleInputChange}
                  errorMessage={errors.kat_id}
                />
                
              </div>
              <div className="col-lg-6">
              <Input
                  type="text"
                  forInput="mat_judul"
                  label="Judul Materi"
                  placeholder="Judul Materi"
                  value={formDataRef.current.mat_judul}
                  onChange={handleInputChange}
                  errorMessage={errors.mat_judul}
                />
              </div>
              <div className="col-lg-6">
              <Input
                  type="text"
                  forInput="mat_kata_kunci"
                  label="Kata Kunci Materi"
                  placeholder="Kata Kunci Materi"
                  value={formDataRef.current.mat_kata_kunci}
                  onChange={handleInputChange}
                  errorMessage={errors.mat_kata_kunci}
                />
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label htmlFor="deskripsiMateri" className="form-label fw-bold">
                  Deskripsi Materi <span style={{color:"Red"}}> *</span>
                  </label>
                  <textarea
                    className="form-control mb-3"
                    id="mat_keterangan"
                    name="mat_keterangan"
                    forInput="mat_keterangan"
                    value={formDataRef.current.mat_keterangan}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.deskripsiMateri && (
                    <div className="invalid-feedback">{errors.deskripsiMateri}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label htmlFor="deskripsiMateri" className="form-label fw-bold">
                  Pengenalan Materi <span style={{color:"Red"}}> *</span>
                  </label>
                  <textarea
                    className="form-control mb-3"
                    id="mat_pengenalan"
                    name="mat_pengenalan"
                    forInput="mat_pengenalan"
                    value={formDataRef.current.mat_pengenalan}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.deskripsiMateri && (
                    <div className="invalid-feedback">{errors.deskripsiMateri}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={gambarInputRef}
                  forInput="mat_gambar"
                  label="Gambar Cover (.jpg, .png)"
                  formatFile=".jpg,.png"
                  onChange={() =>
                    handleFileChange(gambarInputRef, "jpg,png")
                  }
                  errorMessage={errors.mat_gambar}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={fileInputRef}
                  forInput="mat_file_pdf"
                  label="File Materi (.pdf)"
                  formatFile=".pdf"
                  onChange={() =>
                    handleFileChange(fileInputRef, "pdf")
                  }
                  errorMessage={errors.mat_file_pdf}
                />
              </div>
              <div className="col-lg-4">
                <FileUpload
                  ref={vidioInputRef}
                  forInput="mat_file_vidio"
                  label="File Materi (.mp4, .mov)"
                  formatFile=".mp4,.mov"
                  onChange={() =>
                    handleFileChange(vidioInputRef, "mp4,mov")
                  }
                  errorMessage={errors.mat_file_vidio}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("pretestAdd")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Simpan"
          />
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("sharingAdd")}
          />
        </div>
      </form>
    </>
  );
}
