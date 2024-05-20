import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
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
import Icon from "../../part/Icon";
import CardProgram from "../../part/CardProgram";

export default function ProgramIndex({ onChangePage }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(null);
  const [listProgram, setListProgram] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Nama Program] asc",
    status: "",
    KKid: "",
  });

  const getKK = async () => {
    setIsError({ error: false, message: "" });
    setIsLoading(true);

    try {
      while (true) {
        let data = await UseFetch(API_LINK + "Program/GetDataKKByPIC");

        if (data === "ERROR") {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data Kelompok Keahlian."
          );
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setCurrentData(data[0]);
          setCurrentFilter((prevFilter) => ({
            ...prevFilter,
            KKid: data[0].Key,
          }));
          setIsLoading(false);
          break;
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      setIsError({ error: true, message: e.message });
    }
  };

  const getListProgram = async (filter) => {
    setIsError({ error: false, message: "" });
    setIsLoading(true);

    try {
      while (true) {
        let data = await UseFetch(API_LINK + "Program/GetProgramByKK", filter);

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil data program.");
        } else if (data === "data kosong") {
          setListProgram([]);
          setIsLoading(false);
          break;
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListProgram(data);
          setIsLoading(false);
          break;
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      setIsError({ error: true, message: e.message });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getKK();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentFilter.KKid) {
      getListProgram(currentFilter);
    }
  }, [currentFilter]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="d-flex flex-column">
          <div className="flex-fill">
            <div className="container">
              <div className="row mt-3 gx-4">
                {/* <CardProgram isOpen={isOpen} isOpenProgram={isOpenProgram} /> */}
                <div className="col-md-12">
                  <div
                    className="card p-0 mb-3"
                    style={{
                      border: "",
                      borderRadius: "10px",
                    }}
                  >
                    <div className="card-body p-0">
                      <h5
                        className="card-title text-white px-3 py-2"
                        style={{
                          borderTopRightRadius: "10px",
                          borderTopLeftRadius: "10px",
                          backgroundColor: "#67ACE9",
                        }}
                      >
                        {currentData["Nama Kelompok Keahlian"]}
                      </h5>
                      <div className="card-body px-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="card-programtitle mb-0">
                            <Icon
                              name="align-left"
                              type="Bold"
                              cssClass="btn px-2 py-0 text-primary"
                              title="Program"
                            />
                            <span>
                              <a
                                href=""
                                className="text-decoration-underline text-dark"
                              >
                                {listProgram.length} Program
                              </a>
                            </span>
                            <Icon
                              name="users"
                              type="Bold"
                              cssClass="btn px-2 py-0 text-primary ms-3"
                              title="Anggota Kelompok Keahlian"
                            />
                            <span>
                              <a
                                href=""
                                className="text-decoration-underline text-dark"
                              >
                                1 Anggota
                              </a>
                            </span>
                          </h6>
                          <div className="action d-flex">
                            <Button
                              iconName="add"
                              classType="primary btn-sm me-2"
                              label="Tambah Program"
                              onClick={() => onChangePage("add", currentData)}
                            />
                            <Button
                              iconName="list"
                              classType="outline-primary btn-sm px-3 me-2"
                              title="Detail Kelompok Keahlian"
                            />
                            {/* <Button
                            iconName={
                              isContentVisible ? "caret-up" : "caret-down"
                            }
                            classType="outline-primary btn-sm px-3"
                            onClick={toggleContentVisibility}
                            title="Detail Kelompok Keahlian"
                          /> */}
                          </div>
                        </div>
                        <hr style={{ opacity: "0.1" }} />
                        <p
                          className="lh-sm"
                          style={{
                            // display: isContentVisible ? "block" : "-webkit-box",
                            display: "block",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {currentData.Deskripsi}
                        </p>
                        <h5 className="text-primary py-2">
                          Daftar Program dalam Kelompok Keahlian{" "}
                          <strong>
                            {currentData["Nama Kelompok Keahlian"]}
                          </strong>
                        </h5>

                        {listProgram.map((value) => (
                          // <p Key={value.Key}>{value["Nama Program"]}</p>
                          <CardProgram isOpen={isOpen} data={value} />
                        ))}

                        {/* <CardProgram isOpen={isOpen} />
                      <CardProgram isOpen={isOpen} /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
