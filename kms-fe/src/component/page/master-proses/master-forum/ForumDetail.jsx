import React, { useState, useEffect } from "react";
import Button from "../../../part/Button";
import { Stepper } from 'react-form-stepper';
import UseFetch from "../../../util/UseFetch"; 
import AppContext_test from "../MasterContext";
import { API_LINK } from "../../../util/Constants"; 

export default function DetailForum({ onChangePage, withID }) {
  const [forumData, setForumData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const data = await UseFetch(API_LINK + "Forum/GetDataForumByMateri", {
          p1: withID.Key
        });

        if (data === "ERROR") {
          setIsError(true);
        } else {
          setForumData(data.length > 0 ? data[0] : null);
        }
      } catch (error) {
        setIsError(true);
        console.error("Error fetching forum data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <>
      {/* Tampilkan Stepper */}
      <div>
        <Stepper
          steps={[
            { label: 'Pretest', onClick: () => onChangePage("pretestDetail") },
            { label: 'Materi', onClick: () => onChangePage("courseDetail") },
            { label: 'Sharing Expert', onClick: () => onChangePage("sharingDetail") },
            { label: 'Forum', onClick: () => onChangePage("forumDetail") },
            { label: 'Post Test', onClick: () => onChangePage("posttestDetail") }
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

      {/* Tampilkan data forum jika sudah diambil */}
      <div className="card">
        <div className="card-header bg-outline-primary fw-medium text-black">
          Detail Forum
        </div>
        <div className="card-body p-4">
          <div className="row">
            {forumData ? (
              <div className="col-lg-12">
                {/* Tampilkan informasi forum */}
                {console.log("data forum: ", forumData)}
                <h6 className="mb-3 mt-0">Materi Forum</h6>
                <p className="pb-3">{forumData["Judul Materi"]}</p>
                <h6 className="mb-3 mt-0">Judul Forum</h6>
                <p className="pb-3">{forumData["Nama Forum"]}</p>
                <h6 className="mb-3 mt-0">Pembahasan Forum</h6>
                <p className="pb-3">{forumData["Isi Forum"]}</p>
                <h6 className="mb-3 mt-0">Penanggung Jawab</h6>
                <p className="pb-3">{forumData.PIC}</p>
              </div>
            ) : (
              <div className="alert alert-warning" role="alert">
                Tidak ada data forum yang tersedia.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tampilkan tombol navigasi */}
      <div className="float my-4 mx-1">
        <Button
          classType="outline-secondary me-2 px-4 py-2"
          label="Kembali"
          onClick={() => onChangePage("sharingDetail", AppContext_test.DetailMateri)}
        />
        <Button
          classType="dark ms-3 px-4 py-2"
          label="Berikutnya"
          onClick={() => onChangePage("posttestDetail", AppContext_test.DetailMateri)}
        />
      </div>
    </>
  );
}
