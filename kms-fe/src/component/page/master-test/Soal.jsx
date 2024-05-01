import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK, ROOT_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import profilePicture from "../../../assets/tes.jpg";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Kode Test": null,
    "Nama Test": null,
    "Alamat Test": null,
    Status: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Kode Test] asc", Text: "Kode Test [↑]" },
  { Value: "[Kode Test] desc", Text: "Kode Test [↓]" },
  { Value: "[Nama Test] asc", Text: "Nama Test [↑]" },
  { Value: "[Nama Test] desc", Text: "Nama Test [↓]" },
];

const dataFilterStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

export default function MasterTestIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Kode Test] asc",
    status: "Aktif",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((PostvFilter) => {
      return {
        ...PostvFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((PostvFilter) => {
      return {
        ...PostvFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
        status: searchFilterStatus.current.value,
      };
    });
  }

  function handleSetStatus(id) {
    setIsLoading(true);
    setIsError(false);
    UseFetch(API_LINK + "MasterTest/SetStatusTest", {
      idTest: id,
    })
      .then((data) => {
        if (data === "ERROR" || data.length === 0) setIsError(true);
        else {
          SweetAlert(
            "Sukses",
            "Status data Test berhasil diubah menjadi " + data[0].Status,
            "success"
          );
          handleSetCurrentPage(currentFilter.page);
        }
      })
      .then(() => setIsLoading(false));
  }

  function handleDetailAction() {
    window.location.href = ROOT_LINK + "/master_test";
  }

  useEffect(() => {
    setIsError(false);
    UseFetch(API_LINK + "MasterTest/GetDataTest", currentFilter)
      .then((data) => {
        if (data === "ERROR") 
        //Harusnya true
        setIsError(false);
        else if (data.length === 0) setCurrentData(inisialisasiData);
        else {
          const formattedData = data.map((value) => {
            return {
              ...value,
              Aksi: ["Toggle", "Detail", "Edit"],
              Alignment: [
                "center",
                "center",
                "left",
                "left",
                "center",
                "center",
              ],
            };
          });
          setCurrentData(formattedData);
        }
      })
      .then(() => setIsLoading(false));
  }, [currentFilter]);

  const dummyQuestions = [
    { id: 1, question: 'Pertanyaan 1' },
    { id: 2, question: 'Pertanyaan 2' },
    { id: 3, question: 'Pertanyaan 3' }
  ];

  const dummyAnswers = [
    { id: 1, idSoal:1, answer: 'Jawaban 1 Soal 1' },
    { id: 2, idSoal:1, answer: 'Jawaban 2 Soal 1' },
    { id: 3, idSoal:1, answer: 'Jawaban 3 Soal 1' },
    { id: 4, idSoal:2, answer: 'Jawaban 1 Soal 2' },
    { id: 5, idSoal:2, answer: 'Jawaban 2 Soal 2' },
    { id: 6, idSoal:2, answer: 'Jawaban 3 Soal 2' }
  ];

  return (
    <>
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data Test."
            />
          </div>
        )}
        <div className="flex-fill">
          
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {/* Start Here! */}
              <div className="">
                      {dummyQuestions.map(question => (
                <div key={question.id}>
                  <p>{question.question}</p>
                  {dummyAnswers
                    .filter(answer => answer.idSoal === question.id)
                    .map(answer => (
                      <label key={answer.id}>
                        <input
                          type="radio"
                          name={`question${question.id}`}
                          value={answer.id}
                          onChange={() => handleAnswerChange(question.id, answer.id)}
                        />
                        {answer.answer}
                      </label>
                    ))}
                </div>
              ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
