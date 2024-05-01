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
import Label from "../../part/Label";

export default function MasterPelangganEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [listProvinsi, setListProvinsi] = useState({});
  const [listKabupaten, setListKabupaten] = useState({});
  const [listKecamatan, setListKecamatan] = useState({});
  const [listKelurahan, setListKelurahan] = useState({});

  const formDataRef = useRef({
    idPelanggan: "",
    kodePelanggan: "",
    namaPelanggan: "",
    alamatPelanggan: "",
    provinsiPelanggan: "",
    kabupatenPelanggan: "",
    kecamatanPelanggan: "",
    kelurahanPelanggan: "",
    nomorTeleponPelanggan: "",
    faxPelanggan: "",
    emailPelanggan: "",
    nomorNPWPPelanggan: "",
    kontakPersonPenagihan: "",
    emailPenagihan: "",
    kontakPersonPajak: "",
    emailPajak: "",
    berkasNPWPPelanggan: "",
    berkasSPPKPPelanggan: "",
    berkasSKTPelanggan: "",
    berkasLainPelanggan: "",
  });

  const fileNPWPRef = useRef(null);
  const fileSPPKPRef = useRef(null);
  const fileSKTRef = useRef(null);
  const fileLainRef = useRef(null);

  const userSchema = object({
    idPelanggan: string(),
    kodePelanggan: string(),
    namaPelanggan: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    alamatPelanggan: string().required("harus diisi"),
    provinsiPelanggan: string(),
    kabupatenPelanggan: string(),
    kecamatanPelanggan: string(),
    kelurahanPelanggan: string(),
    nomorTeleponPelanggan: string()
      .max(15, "maksimum 15 karakter")
      .required("harus diisi"),
    faxPelanggan: string().max(15, "maksimum 15 karakter"),
    emailPelanggan: string()
      .max(100, "maksimum 100 karakter")
      .email("format email tidak valid")
      .required("harus diisi"),
    nomorNPWPPelanggan: string().max(30, "maksimum 30 karakter"),
    kontakPersonPenagihan: string().max(100, "maksimum 100 karakter"),
    emailPenagihan: string()
      .max(100, "maksimum 100 karakter")
      .email("format email tidak valid"),
    kontakPersonPajak: string().max(100, "maksimum 100 karakter"),
    emailPajak: string()
      .max(100, "maksimum 100 karakter")
      .email("format email tidak valid"),
    berkasNPWPPelanggan: string(),
    berkasSPPKPPelanggan: string(),
    berkasSKTPelanggan: string(),
    berkasLainPelanggan: string(),
  });

  // MENGAMBIL DAFTAR PROVINSI -- BEGIN
  useEffect(() => {
    setIsError((prevError) => {
      return { ...prevError, error: false };
    });
    UseFetch(API_LINK + "Utilities/GetListProvinsi", {}).then((data) => {
      if (data === "ERROR") {
        setIsError((prevError) => {
          return {
            ...prevError,
            error: true,
            message: "Terjadi kesalahan: Gagal mengambil daftar provinsi.",
          };
        });
        setListProvinsi({});
      } else setListProvinsi(data);
    });
  }, []);
  // MENGAMBIL DAFTAR PROVINSI -- END

  // MENGAMBIL DAFTAR KABUPATEN/KOTA -- BEGIN
  useEffect(() => {
    setIsError((prevError) => {
      return { ...prevError, error: false };
    });
    UseFetch(API_LINK + "Utilities/GetListKabupaten", {
      provinsi: formDataRef.current["provinsiPelanggan"],
    }).then((data) => {
      if (data === "ERROR") {
        setIsError((prevError) => {
          return {
            ...prevError,
            error: true,
            message:
              "Terjadi kesalahan: Gagal mengambil daftar kabupaten/kota.",
          };
        });
        setListKabupaten({});
      } else setListKabupaten(data);
    });
  }, [formDataRef.current["provinsiPelanggan"], listProvinsi]);
  // MENGAMBIL DAFTAR KABUPATEN/KOTA -- END

  // MENGAMBIL DAFTAR KECAMATAN -- BEGIN
  useEffect(() => {
    setIsError((prevError) => {
      return { ...prevError, error: false };
    });
    UseFetch(API_LINK + "Utilities/GetListKecamatan", {
      provinsi: formDataRef.current["provinsiPelanggan"],
      kabupaten: formDataRef.current["kabupatenPelanggan"],
    }).then((data) => {
      if (data === "ERROR") {
        setIsError((prevError) => {
          return {
            ...prevError,
            error: true,
            message: "Terjadi kesalahan: Gagal mengambil daftar kecamatan.",
          };
        });
        setListKecamatan({});
      } else setListKecamatan(data);
    });
  }, [formDataRef.current["kabupatenPelanggan"], listKabupaten]);
  // MENGAMBIL DAFTAR KECAMATAN -- END

  // MENGAMBIL DAFTAR KELURAHAN -- BEGIN
  useEffect(() => {
    setIsError((prevError) => {
      return { ...prevError, error: false };
    });
    UseFetch(API_LINK + "Utilities/GetListKelurahan", {
      provinsi: formDataRef.current["provinsiPelanggan"],
      kabupaten: formDataRef.current["kabupatenPelanggan"],
      kecamatan: formDataRef.current["kecamatanPelanggan"],
    }).then((data) => {
      if (data === "ERROR") {
        setIsError((prevError) => {
          return {
            ...prevError,
            error: true,
            message: "Terjadi kesalahan: Gagal mengambil daftar kelurahan.",
          };
        });
        setListKelurahan({});
      } else setListKelurahan(data);
    });
  }, [formDataRef.current["kecamatanPelanggan"], listKecamatan]);
  // MENGAMBIL DAFTAR KELURAHAN -- END

  useEffect(() => {
    setIsError((prevError) => {
      return { ...prevError, error: false };
    });
    UseFetch(API_LINK + "MasterPelanggan/GetDataPelangganById", {
      id: withID,
    })
      .then((data) => {
        if (data === "ERROR" || data.length === 0) {
          setIsError((prevError) => {
            return {
              ...prevError,
              error: true,
              message: "Terjadi kesalahan: Gagal mengambil data pelanggan.",
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

      if (fileNPWPRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileNPWPRef.current).then(
            (data) => (formDataRef.current["berkasNPWPPelanggan"] = data.Hasil)
          )
        );
      }
      if (fileSPPKPRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileSPPKPRef.current).then(
            (data) => (formDataRef.current["berkasSPPKPPelanggan"] = data.Hasil)
          )
        );
      }
      if (fileSKTRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileSKTRef.current).then(
            (data) => (formDataRef.current["berkasSKTPelanggan"] = data.Hasil)
          )
        );
      }
      if (fileLainRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(fileLainRef.current).then(
            (data) => (formDataRef.current["berkasLainPelanggan"] = data.Hasil)
          )
        );
      }

      Promise.all(uploadPromises).then(() => {
        UseFetch(
          API_LINK + "MasterPelanggan/EditPelanggan",
          formDataRef.current
        )
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data pelanggan.",
                };
              });
            } else {
              SweetAlert(
                "Sukses",
                "Data pelanggan berhasil disimpan",
                "success"
              );
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
            Ubah Data Pelanggan
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-3">
                <Label
                  forLabel="kodePelanggan"
                  title="Kode Pelanggan"
                  data={formDataRef.current.kodePelanggan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="namaPelanggan"
                  label="Nama Pelanggan"
                  isRequired
                  value={formDataRef.current.namaPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.namaPelanggan}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="alamatPelanggan"
                  label="Alamat"
                  isRequired
                  value={formDataRef.current.alamatPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.alamatPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <DropDown
                  forInput="provinsiPelanggan"
                  label="Provinsi"
                  arrData={listProvinsi}
                  value={formDataRef.current.provinsiPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.provinsiPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <DropDown
                  forInput="kabupatenPelanggan"
                  label="Kabupaten/Kota"
                  arrData={listKabupaten}
                  value={formDataRef.current.kabupatenPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.kabupatenPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <DropDown
                  forInput="kecamatanPelanggan"
                  label="Kecamatan"
                  arrData={listKecamatan}
                  value={formDataRef.current.kecamatanPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.kecamatanPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <DropDown
                  forInput="kelurahanPelanggan"
                  label="Kelurahan/Desa"
                  arrData={listKelurahan}
                  value={formDataRef.current.kelurahanPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.kelurahanPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="nomorTeleponPelanggan"
                  label="Nomor HP/Telepon"
                  isRequired
                  value={formDataRef.current.nomorTeleponPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.nomorTeleponPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="faxPelanggan"
                  label="Nomor Fax"
                  value={formDataRef.current.faxPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.faxPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="email"
                  forInput="emailPelanggan"
                  label="Email"
                  isRequired
                  value={formDataRef.current.emailPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.emailPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="nomorNPWPPelanggan"
                  label="Nomor NPWP"
                  value={formDataRef.current.nomorNPWPPelanggan}
                  onChange={handleInputChange}
                  errorMessage={errors.nomorNPWPPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="kontakPersonPenagihan"
                  label="Contact Person Penagihan"
                  value={formDataRef.current.kontakPersonPenagihan}
                  onChange={handleInputChange}
                  errorMessage={errors.kontakPersonPenagihan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="email"
                  forInput="emailPenagihan"
                  label="Email Penagihan"
                  value={formDataRef.current.emailPenagihan}
                  onChange={handleInputChange}
                  errorMessage={errors.emailPenagihan}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="kontakPersonPajak"
                  label="Contact Person Pajak"
                  value={formDataRef.current.kontakPersonPajak}
                  onChange={handleInputChange}
                  errorMessage={errors.kontakPersonPajak}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="email"
                  forInput="emailPajak"
                  label="Email Pajak"
                  value={formDataRef.current.emailPajak}
                  onChange={handleInputChange}
                  errorMessage={errors.emailPajak}
                />
              </div>
              <div className="col-lg-3">
                <FileUpload
                  forInput="berkasNPWPPelanggan"
                  label="Berkas NPWP (.pdf, .jpg, .png)"
                  formatFile=".pdf,.jpg,.png"
                  ref={fileNPWPRef}
                  onChange={() => handleFileChange(fileNPWPRef, "pdf,jpg,png")}
                  errorMessage={errors.berkasNPWPPelanggan}
                  hasExisting={formDataRef.current.berkasNPWPPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <FileUpload
                  forInput="berkasSPPKPPelanggan"
                  label="Berkas SPPKP (.pdf, .jpg, .png)"
                  formatFile=".pdf,.jpg,.png"
                  ref={fileSPPKPRef}
                  onChange={() => handleFileChange(fileSPPKPRef, "pdf,jpg,png")}
                  errorMessage={errors.berkasSPPKPPelanggan}
                  hasExisting={formDataRef.current.berkasSPPKPPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <FileUpload
                  forInput="berkasSKTPelanggan"
                  label="Berkas SKT (.pdf, .jpg, .png)"
                  formatFile=".pdf,.jpg,.png"
                  ref={fileSKTRef}
                  onChange={() => handleFileChange(fileSKTRef, "pdf,jpg,png")}
                  errorMessage={errors.berkasSKTPelanggan}
                  hasExisting={formDataRef.current.berkasSKTPelanggan}
                />
              </div>
              <div className="col-lg-3">
                <FileUpload
                  forInput="berkasLainPelanggan"
                  label="Berkas Lainnya (.pdf, .jpg, .png, .zip)"
                  formatFile=".pdf,.jpg,.png,.zip"
                  ref={fileLainRef}
                  onChange={() =>
                    handleFileChange(fileLainRef, "pdf,jpg,png,zip")
                  }
                  errorMessage={errors.berkasLainPelanggan}
                  hasExisting={formDataRef.current.berkasLainPelanggan}
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
