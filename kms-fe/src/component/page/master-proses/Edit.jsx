import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { validateInput } from "../../util/ValidateForm";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import FileUpload from "../../part/FileUpload";

// Data Materi (sama dengan data statis sebelumnya)
const sampleData = [
  {
    Key: 1,
    "Nama Materi": "Pemrograman 5",
    "Kelompok Keahlian": "Pemrograman",
    "Deskripsi Materi": "Pengenalan Bahasa Pemrograman PHP dan Framework Laravel",
    "Status Materi": "Aktif",
  },
  {
    Key: 2,
    "Nama Materi": "DDL & DML",
    "Kelompok Keahlian": "Basis Data",
    "Deskripsi Materi": "Pengenalan Query DDL dan DML pada DBMS SQL Server",
    "Status Materi": "Tidak Aktif",
  },
  {
    Key: 3,
    "Nama Materi": "Pengantar Informatika",
    "Kelompok Keahlian": "Informatika",
    "Deskripsi Materi": "Pengenalan Fitur dan Formula Dasar Pada Microsoft Excel",
    "Status Materi": "Aktif",
  },
  {
    Key: 4,
    "Nama Materi": "Router",
    "Kelompok Keahlian": "Jaringan Komputer",
    "Deskripsi Materi": "Dasar Pengenalan Router dan Cara Konfigurasi Router",
    "Status Materi": "Tidak Aktif",
  },
];

export default function MasterProsesEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    namaProses: "",
    deskripsi: "",
  });
  const fileGambarRef = useRef(null);

  const userSchema = object({
    namaProses: string()
      .max(100, "Maksimum 100 karakter")
      .required("Nama materi harus diisi"),
    deskripsi: string().required("Deskripsi materi harus diisi"),
  });

  useEffect(() => {
    // Temukan data materi dengan Key yang sesuai dengan withID
    const selectedMateri = sampleData.find((materi) => materi.Key === withID);

    if (selectedMateri) {
      // Set data materi ke dalam formDataRef
      formDataRef.current = {
        namaProses: selectedMateri["Nama Materi"],
        deskripsi: selectedMateri["Deskripsi Materi"],
      };
    }

    setIsLoading(false);
  }, [withID]);

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

    const validationErrors = await validateInput(formDataRef.current, userSchema);

    if (!validationErrors) {
      // Lakukan sesuatu...
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <form onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Ubah Data Materi
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="namaProses"
                  label="Nama Materi"
                  isRequired
                  value={formDataRef.current.namaProses}
                  onChange={handleInputChange}
                  errorMessage={errors.namaProses}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="kelompokKeahlian"
                  label="Kelompok Keahlian"
                  isRequired
                  value={formDataRef.current.kelompokKeahlian}
                  onChange={handleInputChange}
                  errorMessage={errors.kelompokKeahlian}
                />
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="deskripsi" className="form-label fw-bold">
                    Deskripsi Materi <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    className={`form-control ${errors.deskripsi ? 'is-invalid' : ''}`}
                    value={formDataRef.current.deskripsi}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.deskripsi && (
                    <div className="invalid-feedback">{errors.deskripsi}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="materiPdf"
                  label="Materi (PDF)"
                  isRequired
                  formatFile=".pdf,.jpg,.png"
                  ref={fileGambarRef}
                  onChange={() =>
                    handleFileChange(fileGambarRef, "pdf,jpg,png")
                  }
                  errorMessage={errors.materiPdf}
                />
              </div>
              <div className="col-lg-6">
                <FileUpload
                  forInput="materiPdf"
                  label="Materi (Video)"
                  isRequired
                  formatFile=".pdf,.jpg,.png"
                  ref={fileGambarRef}
                  onChange={() =>
                    handleFileChange(fileGambarRef, "pdf,jpg,png")
                  }
                  errorMessage={errors.materiPdf}
                />
              </div>
              {/* <div className="col-lg-6">
                <FileUpload
                  forInput="gambarProduk"
                  label="Sharing Expert"
                  formatFile=".pdf,.jpg,.png"
                  ref={fileGambarRef}
                  onChange={() =>
                    handleFileChange(fileGambarRef, "pdf,jpg,png")
                  }
                  errorMessage={errors.gambarProduk}
                />
              </div> */}
            </div>
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
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
