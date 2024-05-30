import { useEffect, useState } from "react";
import { PAGE_SIZE, API_LINK, ROOT_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Alert from "../../part/Alert";
import profilePicture from "../../../assets/tes.jpg";
import KMS_Rightbar from "../../backbone/KMS_RightBar";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import axios from "axios";
import Input from "../../part/Input";
import { object, string } from "yup";
import fetchData from "../../util/UseFetch";

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

export default function Forum({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [marginRight, setMarginRight] = useState("48vh");
  const [widthReply, setWidthReply] = useState("75%");
  const [replyMessage, setReplyMessage] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const formDataRef = useRef({
    forumId:"001",
    karyawanId: "1", 
    isiDetailForum: "",
    statusDetailForum: "Aktif",
    createdBy: "I Made Dananjaya Adyatma",
    detailId: "001",
  });

  const handleReply = (item) => {
    formDataRef.current = {
      forumId: "001",
      karyawanId: "1",
      isiDetailForum: "",
      statusDetailForum: "Aktif",
      createdBy: "I Made Dananjaya Adyatma",
      detailId: item.DetailId,
    };
    setReplyMessage(`Membalas: ${item.IsiDetailForum}`); 
    setShowReplyInput(true); 
  };

  const handleCancelReply = () => {
    setReplyMessage(""); 
    formDataRef.current = {
      forumId: "001",
      karyawanId: "1",
      isiDetailForum: "",
      statusDetailForum: "Aktif",
      createdBy: "I Made Dananjaya Adyatma",
      detailId: "001",
    };
    setShowReplyInput(false); 
  };

  const userSchema = object({
    isiDetailForum: string(),
  });


  function handlePreTestClick_close() {
    setMarginRight("10vh");
    setWidthReply("93%")
  }

  function handlePreTestClick_open() {
    setMarginRight("48vh");
    setWidthReply("75%")
  }

  const fetchForumData = async () => {
    try {
      const response = await axios.post("http://localhost:8080/Forum/GetDataForum", {
        materiId: '1',
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching forum data:", error);
      throw error; 
    }
  };
  
  const handleSendReply = async (e) => {
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
    }
    // console.log("Data yang dikirim ke backend:", formDataRef.current);
    try {
      const response = await axios.post(
        "http://localhost:8080/Forum/SaveTransaksiForum",
        formDataRef.current
      );
      const updatedForumData = await fetchForumData();
      setCurrentData(updatedForumData); 
      formDataRef.current.isiDetailForum = "";
      handleCancelReply()
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const data = await fetchForumData();
        setCurrentData(data);
      } catch (error) {
        setIsError(true);
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const renderMessages = () => {
    return currentData.map((item) => (
      item.DetailId !== null && (
        <div key={item.Key} className="text-right">
          <div className="card p-3 mb-3">
            <div className="d-flex align-items-center mb-3">
              <div
                className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                style={{ ...circleStyle, ...profileStyle }}
              >
                <img
                  // src={profilePicture}
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
                  Membalas: 
                  {(() => {
                    const foundItem = currentData.find((dataItem) => dataItem.DetailId === item.ChildDetailId);
                    if (foundItem) {
                      return " " + foundItem.IsiDetailForum;
                    } else {
                      return " " + item.JudulForum;
                    }
                  })()}
                </h6>
                <h6 className="mb-0" style={nameStyle}>
                  {item.CreatedByDetailForum} - {formatDate(item.CreatedDateDetailForum)}
                </h6>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p
                className="mb-0"
                style={{
                  maxWidth: "1500px",
                  marginBottom: "0px",
                  fontSize: "14px",
                  textAlign: "left",
                  marginLeft: "10px",
                  flex: 1
                }}
              >
                {item.IsiDetailForum}
              </p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleReply(item)}
                style={{ marginLeft: "10px" }}
              >
                Balas
              </button>
            </div>
            
          </div>
        </div>
      )
    ));
  };

  const renderJudulForum = () => {
    return currentData.slice(0,1).map((item) => (
      <div key={item.DetailId} className="text-right">
        <div className="card p-3 mb-3">
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
              style={{ ...circleStyle, ...profileStyle }}
            >
              <img
                // src={profilePicture}
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
                {item.JudulForum}
              </h6>
              <h6 className="mb-0" style={nameStyle}>
                {item.CreatedByForum} - {formatDate(item.CreatedDateForum)}
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
            {item.IsiForum}
          </p>
        </div>
      </div>
    ));
  };


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
    color:'grey',
  };

  const textBoxStyle = {
    width: "1170px",
    height: "100px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginTop: "10px",
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--responsiveContainer-margin-left', '0vw');
    const sidebarMenuElement = document.querySelector('.sidebarMenu');
    if (sidebarMenuElement) {
      sidebarMenuElement.classList.add('sidebarMenu-hidden');
    }
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };

    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };


  return (
    <>
      <div className="d-flex flex-column">
        <KMS_Rightbar
          handlePreTestClick_close={handlePreTestClick_close}
          handlePreTestClick_open={handlePreTestClick_open}
        />
        <div className="mt-3 ">
          <>
              <div style={{ marginRight: marginRight }}>
                {renderJudulForum()}
                {renderMessages()}
                <div style={{marginTop:'100px'}}></div>
                {showReplyInput && (
                  <div className="reply-batal input-group mb-3" style={{ position: 'fixed', bottom: '60px', left: '15px', zIndex: '999', maxWidth:widthReply, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', borderRadius: '8px', backgroundColor: '#ffffff', padding: '10px', display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginBottom: '20px', color: 'gray', flex:'1' }}>{replyMessage}</p>
                    
                    <div className="input-group-append">
                      <button
                        className="btn btn-danger btn-sm flex-end"
                        type="button"
                        onClick={handleCancelReply}
                        style={{  marginLeft:'100px', marginBottom:'20px'}}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
                <div className="reply input-group mb-3" style={{ position: 'fixed', bottom: '20px', left: '15px', zIndex: '999', maxWidth:widthReply, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', borderRadius: '8px', backgroundColor: '#ffffff', padding: '10px', display: 'flex', alignItems: 'center' }}>
                  <Input
                    type="text"
                    forInput="isiDetailForum"
                    className="form-control"
                    placeholder="Ketik pesan..."
                    value={formDataRef.current.isiDetailForum}
                    errorMessage={errors.isiDetailForum}
                    onChange={handleInputChange}
                    style={{ flex: '1', marginRight: '10px' }}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSendReply}
                      style={{ minWidth: '80px' }}
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
