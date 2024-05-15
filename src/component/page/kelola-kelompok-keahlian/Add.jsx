import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function KKAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listProdi, setListProdi] = useState({});
  const [listKaryawan, setListKaryawan] = useState({});

  const formDataRef = useRef({
    nama: "",
    programStudi: "",
    personInCharge: "",
    deskripsi: "",
  });

  const userSchema = object({
    nama: string().max(100, "maksimum 100 karakter").required("harus diisi"),
    deskripsi: string(),
    programStudi: string().required("harus dipilih"),
    personInCharge: string().required("harus dipilih"),
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    try {
      await userSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }

    formDataRef.current[name] = value;
  };

  useEffect(() => {
    const fetchDataProdi = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "KKs/GetListProdi", {});

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else {
          setListProdi(data);
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListProdi({});
      }
    };

    fetchDataProdi();
  }, []);

  useEffect(() => {
    const fetchDataKaryawan = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "KKs/GetListKaryawan", {});

        if (data === "ERROR") {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil daftar karyawan."
          );
        } else {
          setListKaryawan(data);
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListKaryawan({});
      }
    };

    fetchDataKaryawan();
  }, []);

  useEffect(() => {
    console.log(formDataRef.current);
  }, []);

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

      UseFetch(API_LINK + "KKs/CreateKK", formDataRef.current)
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
            SweetAlert(
              "Sukses",
              "Data kelompok keahlian berhasil disimpan",
              "success"
            );
            onChangePage("index");
          }
        })
        .then(() => setIsLoading(false));
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
            Tambah Kelompok Keahlian{" "}
            <span className="badge text-bg-dark">Draft</span>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="nama"
                  label="Nama"
                  isRequired
                  placeholder="Nama"
                  value={formDataRef.current.nama}
                  onChange={handleInputChange}
                  errorMessage={errors.nama}
                />
              </div>
              <div className="col-lg-12">
                <label style={{ paddingBottom: "5px", fontWeight: "bold" }}>
                  Deskripsi <span style={{ color: "red" }}> *</span>
                </label>
                <textarea
                  className="form-control mb-3"
                  style={{
                    height: "200px",
                  }}
                  id="deskripsi"
                  name="deskripsi"
                  forInput="deskripsi"
                  value={formDataRef.current.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi"
                  required
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="programStudi"
                  label="Program Studi"
                  arrData={listProdi}
                  isRequired
                  value={formDataRef.current.programStudi}
                  onChange={handleInputChange}
                  errorMessage={errors.programStudi}
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="personInCharge"
                  label="PIC Kelompok Keahlian"
                  arrData={listKaryawan}
                  value={formDataRef.current.personInCharge}
                  onChange={handleInputChange}
                  errorMessage={errors.personInCharge}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="Batal"
            onClick={() => onChangePage("index")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="Simpan"
          />
        </div>
      </form>
    </>
  );
}
