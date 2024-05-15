import { useRef, useState, useEffect } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function KKEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listProdi, setListProdi] = useState({});
  const [listKaryawan, setListKaryawan] = useState({});

  const formDataRef = useRef({
    Key: "",
    ["Nama Kelompok Keahlian"]: "",
    Prodi: "",
    PIC: "",
    Deskripsi: "",
  });

  const userSchema = object({
    ["Nama Kelompok Keahlian"]: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    Prodi: string().required("harus dipilih"),
    PIC: string().required("harus dipilih"),
    Deskripsi: string(),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      setIsLoading(true);

      try {
        const data = await UseFetch(API_LINK + "KKs/GetDataKKByID", {
          id: withID,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data kelompok keahlian."
          );
        } else {
          formDataRef.current = { ...formDataRef.current, ...data[0] };
        }
      } catch (error) {
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  useEffect(() => {
    const fetchProdi = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "KKs/GetListProdi", {});

        if (data === "ERROR" || !Array.isArray(data)) {
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
        setListProdi([]);
      }
    };

    fetchProdi();
  }, []);

  useEffect(() => {
    const fetchKaryawan = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "KKs/GetListKaryawan", {});

        if (data === "ERROR" || !Array.isArray(data)) {
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
        setListKaryawan([]);
      }
    };

    fetchKaryawan();
  }, []);

  useEffect(() => {
    console.log(formDataRef.current);
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

  const handleAdd = async (e) => {};

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
                  forInput="Nama Kelompok Keahlian"
                  label="Nama Kelompok Keahlian"
                  isRequired
                  placeholder="Nama Kelompok Keahlian"
                  value={formDataRef.current["Nama Kelompok Keahlian"]}
                  onChange={handleInputChange}
                  errorMessage={errors["Nama Kelompok Keahlian"]}
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
                  id="Deskripsi"
                  name="Deskripsi"
                  value={formDataRef.current.Deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi"
                  required
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="Prodi"
                  label="Program Studi"
                  arrData={listProdi}
                  isRequired
                  value={formDataRef.current.Prodi}
                  onChange={handleInputChange}
                  errorMessage={errors.jenisProduk}
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="PIC"
                  label="PIC Kelompok Keahlian"
                  arrData={listKaryawan}
                  value={formDataRef.current.PIC || ""}
                  onChange={handleInputChange}
                  errorMessage={errors.jenisProduk}
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
