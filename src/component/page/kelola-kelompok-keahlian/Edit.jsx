import { useRef, useState, useEffect } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs } from "../../util/ValidateForm";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import SweetAlert from "../../util/SweetAlert";

export default function KKEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listProdi, setListProdi] = useState({});
  const [listKaryawan, setListKaryawan] = useState({});

  const formDataRef = useRef({
    key: "",
    nama: "",
    programStudi: "",
    personInCharge: "",
    deskripsi: "",
    status: "",
  });

  const userSchema = object({
    key: string(),
    nama: string().max(100, "maksimum 100 karakter").required("harus diisi"),
    programStudi: string().required("harus dipilih"),
    personInCharge: string(),
    deskripsi: string().required("harus diisi"),
    status: string(),
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    try {
      if (name === "personInCharge" && value === "") {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        await userSchema.validateAt(name, { [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }

    formDataRef.current[name] = value;
    if (name === "programStudi") {
      fetchDataKaryawan(value);
    }
  };

  const fetchDataKaryawan = async (idProdi) => {
    setIsError((prevError) => ({ ...prevError, error: false }));
    setIsLoading(true);

    try {
      const data = await UseFetch(API_LINK + "KKs/GetListKaryawan", {
        idProdi,
      });

      if (data === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal mengambil daftar karyawan.");
      } else {
        setListKaryawan(data);
      }
    } catch (error) {
      setIsError({ error: true, message: error.message });
      setListKaryawan([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    formDataRef.current = {
      key: withID.id,
      nama: withID.title,
      programStudi: withID.prodi.key,
      personInCharge: withID.pic.key ? withID.pic.key : "",
      deskripsi: withID.desc,
      status: withID.status,
    };
  }, [withID]);

  useEffect(() => {
    fetchDataKaryawan(withID.prodi.key);
  }, [withID]);

  useEffect(() => {
    const fetchDataProdi = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      setIsLoading(true);

      try {
        const data = await UseFetch(API_LINK + "KKs/GetListProdi", {});

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else {
          setListProdi(data);
        }
      } catch (error) {
        setIsError({ error: true, message: error.message });
        setListProdi([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataProdi();
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

      const dataToSend = { ...formDataRef.current };
      if (!dataToSend.personInCharge) {
        dataToSend.personInCharge = "";
      } else if (
        dataToSend.status === "Menunggu" &&
        dataToSend.personInCharge
      ) {
        dataToSend.status = "Aktif";
      }

      UseFetch(API_LINK + "KKs/EditKK", dataToSend)
        .then((data) => {
          if (data === "ERROR") {
            setIsError((prevError) => {
              return {
                ...prevError,
                error: true,
                message:
                  "Terjadi kesalahan: Gagal mengubah data kelompok keahlian.",
              };
            });
          } else {
            SweetAlert(
              "Sukses",
              "Data kelompok keahlian berhasil diubah",
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
            Edit Kelompok Keahlian{" "}
            <span className="badge text-bg-dark">Draft</span>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="nama"
                  label="Nama Kelompok Keahlian"
                  isRequired
                  placeholder="Nama Kelompok Keahlian"
                  value={formDataRef.current.nama}
                  onChange={handleInputChange}
                  errorMessage={errors.nama}
                />
              </div>
              <div className="col-lg-12">
                <label style={{ paddingBottom: "5px", fontWeight: "bold" }}>
                  Deskripsi/Ringkasan Mengenai Kelompok Keahlian{" "}
                  <span style={{ color: "red" }}> *</span>
                </label>
                <textarea
                  className="form-control mb-3"
                  style={{
                    height: "200px",
                  }}
                  id="deskripsi"
                  name="deskripsi"
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
                  value={formDataRef.current.personInCharge || ""}
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
