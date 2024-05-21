import { useEffect, useState } from "react";
import { PAGE_SIZE, API_LINK, ROOT_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Alert from "../../part/Alert";
import profilePicture from "../../../assets/tes.jpg";
import KMS_Rightbar from "../../backbone/KMS_RightBar";

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
  const [marginRight, setMarginRight] = useState("40vh");
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState([]);

  function handlePreTestClick_close() {
    setMarginRight("0vh");
  }

  function handlePreTestClick_open() {
    setMarginRight("40vh");
  }

  function getCurrentFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = monthNames[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
  }
  

  function handleSendReply() {
    if (replyText.trim() !== "") {
      const newMessage = {
        text: replyText,
        sender: "Me",
        dateTime: getCurrentFormattedDateTime(),
      };
      setMessages([...messages, newMessage]);
      setReplyText("");
    }
  }

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div key={index} className={message.sender === "Me" ? "text-right" : ""}>
        <div className="card p-3 mb-3">
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
              style={{ ...circleStyle, ...profileStyle }}
            >
              <img
                src={profilePicture}
                alt="Profile Picture"
                className="align-self-start"
                style={{
                  width: "680%",
                  height: "auto",
                  position: "relative",
                  right: "25px",
                  bottom: "40px",
                }}
              />
            </div>
            <div>
              <h6 className="mb-0" style={{ fontSize: "14px" }}>
                Re : Contoh Secondary Memory
              </h6>
              <h6 className="mb-0" style={nameStyle}>
                I Made Dananjaya Adyatma - {message.dateTime}
              </h6>
            </div>
          </div>
          <p
            className="mb-0"
            style={{
              maxWidth: "1500px",
              marginBottom: "0px",
              fontSize: "14px",
              textAlign: "left",
              marginLeft: "10px",
            }}
          >
            {message.text}
          </p>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    setIsError(false);
    UseFetch(API_LINK + "MasterTest/GetDataTest", currentFilter)
      .then((data) => {
        if (data === "ERROR") setIsError(false);
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

  const circleStyle = {
    width: "30px",
    height: "30px",
    backgroundColor: "lightgray",
    marginRight: "20px",
  };

  const profileStyle = {
    backgroundColor: "lightgray",
    padding: "5px",
    borderRadius: "50%",
  };

  const nameStyle = {
    fontSize: "12px",
    marginBottom: "15px",
  };

  return (
    <>
      <div className="d-flex flex-column">
        <KMS_Rightbar
          handlePreTestClick_close={handlePreTestClick_close}
          handlePreTestClick_open={handlePreTestClick_open}
        />
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data Test."
            />
          </div>
        )}
        <div className="flex-fill"></div>
        <div className="mt-3">
          <>
            <div style={{ marginRight: marginRight }}>
              <div className="card p-3 mb-3">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                    style={{ ...circleStyle, ...profileStyle }}
                  >
                    <img
                      src={profilePicture}
                      alt="Profile Picture"
                      className="align-self-start"
                      style={{
                        width: "680%",
                        height: "auto",
                        position: "relative",
                        right: "25px",
                        bottom: "40px",
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ fontSize: "14px" }}>
                      Contoh Secondary Memory
                    </h6>
                    <h6 className="mb-0" style={nameStyle}>
                      Fahriel Dwifaldi - 03 Agustus 2022 - 14:30:15
                    </h6>
                  </div>
                </div>
                <div className="text-center">
                  <p
                    className="mb-0"
                    style={{
                      maxWidth: "600px",
                      marginBottom: "0px",
                      fontSize: "14px",
                      textAlign: "left",
                      marginLeft: "10px",
                    }}
                  >
                    1. Apa pengertian dari secondary memory!<br />
                    2. Sebutkan dan Jelaskan contoh secondary memory!<br />
                    3. Laptop yang kalian guanakan menggunakan secondary memory
                    tipe apa?
                  </p>
                </div>
              </div>
              <div className="card p-3 mb-3">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                    style={{ ...circleStyle, ...profileStyle }}
                  >
                    <img
                      src={profilePicture}
                      alt="Profile Picture"
                      className="align-self-start"
                      style={{
                        width: "680%",
                        height: "auto",
                        position: "relative",
                        right: "25px",
                        bottom: "40px",
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ fontSize: "14px" }}>
                      Re : Contoh Secondary Memory
                    </h6>
                    <h6 className="mb-0" style={nameStyle}>
                      I Made Dananjaya Adyatma - 03 Agustus 2022 - 14:30:15
                    </h6>
                  </div>
                </div>
                <p
                  className="mb-0"
                  style={{
                    maxWidth: "1500px",
                    marginBottom: "0px",
                    fontSize: "14px",
                    textAlign: "left",
                    marginLeft: "10px",
                  }}
                >
                  Nama : I Made Dananjaya Adyatma <br />
                  Kelas : MI 2C<br />
                  NIM : 0320220067<br />
                  <br />
                  1. Secondary Memory ialah Secondary memory, dalam konteks
                  komputer, mengacu pada media penyimpanan data yang dapat
                  menyimpan informasi secara permanen atau semi-permanen di luar
                  memori utama komputer. <br />
                  <br />
                  2. Contoh dari secondary memory termasuk:<br />
                  Hard Disk Drive: Ini adalah media penyimpanan yang paling umum
                  digunakan di komputer pribadi. HDD menggunakan piringan
                  magnetis yang berputar dengan kecepatan tinggi untuk menyimpan
                  data.<br />
                  Solid State Drive: Mirip dengan HDD, tetapi tidak memiliki
                  bagian yang bergerak. SSD menggunakan sirkuit terintegrasi
                  untuk menyimpan data, membuatnya lebih cepat daripada HDD
                  dalam membaca dan menulis data.<br />
                  Flash Drive: Ini adalah perangkat penyimpanan portabel yang
                  menggunakan teknologi flash memory untuk menyimpan data. Mereka
                  kecil, ringan, dan mudah dibawa-bawa.<br />
                  Memory Cards: Kartu memori seperti Secure Digital (SD),
                  CompactFlash (CF), dan lainnya digunakan dalam perangkat
                  seperti kamera digital, ponsel cerdas, dan perangkat portabel
                  lainnya untuk menyimpan foto, video, dan data lainnya.<br />
                  Optical Drives: Termasuk CD-ROM, DVD-ROM, dan Blu-ray Disc,
                  optical drives menggunakan cahaya laser untuk membaca dan
                  menulis data ke dalam media optik.<br />
                  <br />
                  3. SSD
                </p>
              </div>
              {renderMessages()}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ketik pesan..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSendReply}
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
