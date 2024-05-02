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
import KMS_Sidebar from '../../backbone/KMS_SideBar';

export default function PengerjaanTest({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listProvinsi, setListProvinsi] = useState({});
  const [listKabupaten, setListKabupaten] = useState({});
  const [listKecamatan, setListKecamatan] = useState({});
  const [listKelurahan, setListKelurahan] = useState({});


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
    console.log("Nomor Soal:", selectedQuestion);
    console.log("Jawaban Terpilih:", selectedAnswer);
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

      Promise.all(uploadPromises).then(() => {
        UseFetch(
          API_LINK + "MasterPelanggan/CreatePelanggan",
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
  const questionNumbers = Array.from(Array(30).keys());
  const dummyData = [
    {
      question: "Apa warna langit?",
      options: ["Merah", "Kuning", "Biru", "Hijau"],
      correctAnswer: "Biru",
    },
    {
      question: "Berapakah hasil dari 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
    },
    {
      question: "Apa ibukota Indonesia?",
      options: ["Jakarta", "Surabaya", "Bandung", "Yogyakarta"],
      correctAnswer: "Jakarta",
    },
    {
      question: "Siapakah presiden pertama Indonesia?",
      options: ["Soekarno", "Soeharto", "Megawati", "Jokowi"],
      correctAnswer: "Soekarno",
    },
    {
      question: "Berapa jumlah provinsi di Indonesia?",
      options: ["30", "32", "34", "36"],
      correctAnswer: "34",
    },
    {
      question: "Apa warna bendera Indonesia?",
      options: ["Merah-Putih", "Hijau-Kuning", "Biru-Putih", "Hitam-Kuning"],
      correctAnswer: "Merah-Putih",
    },
    {
      question: "Apa ibukota Amerika Serikat?",
      options: ["Washington D.C.", "New York City", "Los Angeles", "Chicago"],
      correctAnswer: "Washington D.C.",
    },
    {
      question: "Berapa jumlah planet dalam tata surya?",
      options: ["7", "8", "9", "10"],
      correctAnswer: "8",
    },
    {
      question: "Siapakah penemu relativitas umum?",
      options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Stephen Hawking"],
      correctAnswer: "Albert Einstein",
    },
    {
      question: "Berapa banyak huruf dalam alfabet Inggris?",
      options: ["24", "25", "26", "27"],
      correctAnswer: "26",
    },
    {
      question: "Siapakah penulis 'Pride and Prejudice'?",
      options: ["Jane Austen", "Emily Brontë", "Charlotte Brontë", "Virginia Woolf"],
      correctAnswer: "Jane Austen",
    },
    {
      question: "Berapa banyak warna dalam pelangi?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "7",
    },
    {
      question: "Apa nama ilmuwan yang menemukan hukum gravitasi?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
      correctAnswer: "Isaac Newton",
    },
    {
      question: "Berapa banyak gigi manusia dewasa?",
      options: ["28", "30", "32", "34"],
      correctAnswer: "32",
    },
    {
      question: "Siapakah penulis '1984'?",
      options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "F. Scott Fitzgerald"],
      correctAnswer: "George Orwell",
    },
    {
      question: "Berapa banyak benua di dunia?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
    },
    {
      question: "Apa nama senjata tradisional Jepang?",
      options: ["Katan", "Wakizashi", "Naginata", "Tanto"],
      correctAnswer: "Katana",
    },
    {
      question: "Berapa banyak musim di sebagian besar belahan bumi?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
    },
    {
      question: "Siapakah presiden pertama Amerika Serikat?",
      options: ["George Washington", "Thomas Jefferson", "John Adams", "Abraham Lincoln"],
      correctAnswer: "George Washington",
    },
    {
      question: "Berapa banyak mata uang yang beredar di dunia?",
      options: ["100", "150", "180", "200"],
      correctAnswer: "180",
    },
    {
      question: "Apa nama sungai terpanjang di dunia?",
      options: ["Nil", "Amazon", "Yangtze", "Mississippi"],
      correctAnswer: "Nil",
    },
    {
      question: "Berapa banyak hari dalam satu tahun kabisat?",
      options: ["365", "366", "367", "368"],
      correctAnswer: "366",
    },
    {
      question: "Siapakah penulis 'Hamlet'?",
      options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare",
    },
    {
      question: "Berapa umur alam semesta?",
      options: ["13.7 Miliar tahun", "15 Miliar tahun", "20 Miliar tahun", "25 Miliar tahun"],
      correctAnswer: "13.7 Miliar tahun",
    },
    {
      question: "Apa nama benua terbesar di dunia?",
      options: ["Asia", "Afrika", "Amerika", "Eropa"],
      correctAnswer: "Asia",
    },
    {
      question: "Berapa jumlah gigi pada anak-anak?",
      options: ["20", "22", "24", "26"],
      correctAnswer: "20",
    },
    {
      question: "Siapakah penulis 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "F. Scott Fitzgerald", "Ernest Hemingway", "J.D. Salinger"],
      correctAnswer: "Harper Lee",
    },
    {
      question: "Berapa banyak negara di dunia?",
      options: ["190", "195", "200", "205"],
      correctAnswer: "195",
    },
    {
      question: "Apa nama ilmuwan yang menemukan radioaktivitas?",
      options: ["Marie Curie", "Albert Einstein", "Isaac Newton", "Galileo Galilei"],
      correctAnswer: "Marie Curie",
    },
  ];
  const selectPreviousQuestion = () => {
    if (selectedQuestion > 1) {
      setSelectedQuestion(selectedQuestion - 1);
    }
  };

  // Fungsi untuk memilih soal berikutnya
  const selectNextQuestion = () => {
    if (selectedQuestion < dummyData.length) {
      setSelectedQuestion(selectedQuestion + 1);
    }
  };
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const testStyle = {
    sidebarMenu: {
      display: 'none'
    }
  };

  return (
    <>
      <div className="d-flex" style={testStyle.sidebarMenu}>
      <KMS_Sidebar
        questionNumbers={questionNumbers}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
      />
          <div className="flex-fill p-3 d-flex flex-column">
              {dummyData.map((data, index) => {
                if (index + 1 !== selectedQuestion) return null;
                return (
                  <div key={index} className="mb-3">
                    {/* Soal */}
                    <div className="mb-3">
                      <h4>Soal {index + 1}</h4>
                      <p>{data.question}</p>
                    </div>
                    <h5 className="font-weight-bold">Jawaban Anda:</h5>
                    {/* Jawaban */}
                    <div className="d-flex flex-column">
                      {/* Opsi jawaban */}
                      {data.options.map((option, index) => (
                        <div key={option} className="mb-2">
                          <button
                            className="btn btn-outline-primary"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {String.fromCharCode(65 + index)}
                          </button>
                          <span className="ms-2">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      <form onSubmit={handleAdd}>
        <div className="float-end my-4 mx-1">
          <Button classType="secondary me-2 px-4 py-2" label="Sebelumnya" onClick={selectPreviousQuestion} />
          <Button classType="primary ms-2 px-4 py-2" label="Berikutnya" onClick={selectNextQuestion} />
        </div>
      </form>
    </>
  );
}