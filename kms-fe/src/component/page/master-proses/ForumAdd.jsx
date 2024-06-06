import { useState } from "react";
import { object, string } from "yup";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import { Stepper } from 'react-form-stepper';
import axios from "axios";

const userSchema = object({
  forumJudul: string().max(100, "maksimum 100 karakter").required("harus diisi"),
  forumIsi: string().required("harus diisi"),
});

export default function MasterForumAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    materiId: "00003",
    karyawanId: "1",
    forumJudul: "",
    forumIsi: "",
    forumCreatedBy:"ika",
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const resetForm = () => {
    setFormData({
      materiId: "00003",
      karyawanId: "1",
      forumJudul: "",
      forumIsi: "",
      forumStatus: "Aktif",
    });
    setErrors({});
    setIsError({ error: false, message: "" });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(formData, userSchema, setErrors);
    const isEmptyData = Object.values(formData).some(value => value === "");

    if (isEmptyData) {
      setIsError({
        error: true,
        message: "Data tidak boleh kosong",
      });
      return;
    }

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});
    }

    try {
      console.log("Data yang dikirim ke backend:", formData);
      const response = await axios.post("http://localhost:8080/Forums/SaveDataForum", formData);

      if (response.status === 200) {
        SweetAlert("Success", "Forum data has been successfully saved", "success");
        resetForm();
        setIsLoading(false);
      } else {
        setIsError({
          error: true,
          message: "Failed to save forum data: " + response.statusText,
        });
        setIsLoading(false); 
      }
    } catch (error) {
      setIsError({
        error: true,
        message: "Failed to save forum data: " + error.message,
      });
      setIsLoading(false);
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
              { label: 'Pretest', onClick: () => onChangePage("pretestAdd") },
              { label: 'Materi', onClick: () => onChangePage("courseAdd") },
              { label: 'Sharing Expert', onClick: () => onChangePage("sharingAdd") },
              { label: 'Forum', onClick: () => onChangePage("forumAdd") },
              { label: 'Post Test', onClick: () => onChangePage("posttestAdd") }
            ]}
            activeStep={3} 
            styleConfig={{
              activeBgColor: '#67ACE9',
              activeTextColor: '#FFFFFF',
              completedBgColor: '#67ACE9',
              completedTextColor: '#FFFFFF',
              inactiveBgColor: '#E0E0E0',
              inactiveTextColor: '#000000',
              size: '2em',
              circleFontSize: '1rem',
              labelFontSize: '0.875rem',
              borderRadius: '50%',
              fontWeight: 500
            }}
            connectorStyleConfig={{
              completedColor: '#67ACE9',
              activeColor: '#67ACE9',
              disabledColor: '#BDBDBD',
              size: 1,
              stepSize: '2em',
              style: 'solid'
            }}
          />
        </div>

        <div className="card">
          <div className="card-header bg-outline-primary fw-medium text-black">
            Tambah Forum
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-12">
                <Input
                  type="text"
                  forInput="forumJudul"
                  label="Judul Forum"
                  value={formData.forumJudul}
                  onChange={handleInputChange}
                  errorMessage={errors.forumJudul}
                />
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label htmlFor="forumIsi" className="form-label fw-bold">
                    Isi Forum
                  </label>
                  <textarea
                    id="forumIsi"
                    name="forumIsi"
                    className={`form-control ${errors.forumIsi ? 'is-invalid' : ''}`}
                    value={formData.forumIsi}
                    onChange={handleInputChange}
                  />
                  {errors.forumIsi && (
                    <div className="invalid-feedback">{errors.forumIsi}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="float my-4 mx-1">
          <Button
            classType="outline-secondary me-2 px-4 py-2"
            label="Kembali"
            onClick={() => onChangePage("sharingAdd")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="SImpan"
          />
          <Button
            classType="dark ms-3 px-4 py-2"
            label="Berikutnya"
            onClick={() => onChangePage("posttestAdd")}
          />
        </div>
      </form>
    </>
  );
}
