import { useRef, useState } from "react";
import { object, string } from "yup";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import { ListKelompokKeahlian, ListProdi } from "../../util/Dummy";

export default function KKDetailDraft({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const data = ListKelompokKeahlian.find((item) => item.data.id === withID);

  const formDataRef = useRef({
    namaProduk: "",
    jenisProduk: "",
    gambarProduk: "",
    spesifikasi: "",
  });

  const userSchema = object({
    namaProduk: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    jenisProduk: string().required("harus dipilih"),
    gambarProduk: string(),
    spesifikasi: string(),
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
            Lihat Kelompok Keahlian{" "}
            <span className="badge text-bg-dark">Draft</span>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="namaProduk"
                  label="Nama"
                  isRequired
                  placeholder="Nama"
                  value={data?.data.title || ""}
                  onChange={handleInputChange}
                  errorMessage={errors.namaProduk}
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
                  value={data?.data.desc || ""}
                  onChange={handleInputChange}
                  placeholder="Deskripsi"
                  required
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="jenisProduk"
                  label="Program Studi"
                  arrData={ListProdi}
                  isRequired
                  value={data?.data.prodi || ""}
                  onChange={handleInputChange}
                  errorMessage={errors.jenisProduk}
                  readonly
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="jenisProduk"
                  label="PIC Kelompok Keahlian"
                  arrData={ListProdi}
                  value={formDataRef.current.jenisProduk}
                  onChange={handleInputChange}
                  errorMessage={errors.jenisProduk}
                  readonly
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
        </div>
      </form>
    </>
  );
}
