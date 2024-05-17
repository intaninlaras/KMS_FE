import React, { useState, useEffect  } from "react";
import Button from "../part/Button";
import { ROOT_LINK } from "../util/Constants";
import Icon from "../part/Icon";
import KMS_ProgressBar from "../part/KMS_ProgressBar";

export default function KMS_Rightbar({ handlePreTestClick_close, handlePreTestClick_open }) {
  const [progress, setProgress] = useState(50);
  const [dropdowns, setDropdowns] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [widthDynamic, setwidthDynamic] = useState("");
  const [showElement, setShowElement] = useState(false);
  const [showMainContent_SideBar, setShowMainContent_SideBar] = useState(true);
  

  const toggleDropdown = (name) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const sidebarStyles = {
    position: "fixed",
    top: 0,
    right: sidebarVisible ? 0 : -300, 
    height: "100%",
    width: 300,
    backgroundColor: "#fff",
    transition: "right 0.3s ease",
    zIndex: 1000,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    overflowY: "auto"
  };

  const listOfLearningStyle = {
    paddingLeft: '20px', 
    paddingRight: '20px', 
    display: 'flex', 
    alignItems: 'center',
    paddingBottom: '7%'
  }

  const button_listOfLearningStyle = {
    backgroundColor: '#0275D8', 
    borderRadius: '50%', 
    width: '40px', 
    height: '40px', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '40px',
    borderColor: '#0275D8'
  }

  const progressStyle = {
    paddingTop:"7%",
    paddingLeft: '20px', 
    paddingRight: '20px', 
    paddingBottom: '7%'
  }
  
  const contentSidebarStyle = {
    paddingTop:"7%",
    paddingLeft: '20px', 
    paddingRight: '20px', 
    paddingBottom: '7%',
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto'
  }

  const styles = {
    sidebarItem: {
      fontFamily: 'Arial, sans-serif',
      paddingBottom: '7%',
      paddingTop:"7%",
      width:"100%"
    },
    buttonDropdown: {
      cursor: 'pointer'
    },
    dropdownContent: {
      borderTop: 'none',
      backgroundColor: 'white',
      paddingLeft: '25px',
      paddingTop: '15px'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      margin: '5px 0',
      padding: '10px'
    },
    radio: {
      marginRight: '10px',
    },
    link: {
      fontSize: '14px',
      color: 'black',
      textDecoration: 'none',
    }
  };

  const dropdownData = [
    { 
      name: 'Materi', 
      items: [
        { label: 'Sub-materi 1', href: ROOT_LINK + "/master_test/sub_materi1" },
        { label: 'Sub-materi 2', href: ROOT_LINK + "/master_test/sub_materi2" },
        { label: 'Sub-materi 3', href: ROOT_LINK + "/master_test/sub_materi3" },
        { label: 'Sub-materi 4', href: ROOT_LINK + "/master_test/sub_materi4" },
        { label: 'Sub-materi 5', href: ROOT_LINK + "/master_test/sub_materi5" }
      ], 
      countDone: 5 
    },
    { 
      name: 'Sharing Expert', 
      items: [
        { label: 'Materi PDF', href: ROOT_LINK + "/sharing_expert/materi_pdf" },
        { label: 'Materi Video', href: ROOT_LINK + "/sharing_expert/materi_video" }
      ], 
      countDone: 2 
    }
  ];
  
  function handleOpenClick() {
      setShowElement(false);
      setShowMainContent_SideBar(true);
      setwidthDynamic("");
  }

  function handleCloseClick() {
      setShowMainContent_SideBar(false);
      setShowElement(true);
      setwidthDynamic("4%");
  }

  function handleCombinedClick_open(){
    handleOpenClick();
    handlePreTestClick_open();
  }
  
  function handleCombinedClick_close(){
    handleCloseClick();
    handlePreTestClick_close();
  }

  function onClick_forum() {
    window.location.href = ROOT_LINK + "/master_test/forum";
  }


  function onClick_postTest() {
    window.location.href = ROOT_LINK + "/master_test/post-test";
  }

  function onClick_preTest() {
    window.location.href = ROOT_LINK + "/master_test/soal-preTest";
  }

  return (
    <div className="border-start h-100 pt-2 overflow-y-auto position-fixed" style={{right:"10px", width: widthDynamic}}>
      <div className="px-2 collapseTrue">
        { showElement && 
          <div className="" style={button_listOfLearningStyle}>
            <Icon 
            name="angle-left"
            type="Bold"
            cssClass="btn text-light ms-0 "
            onClick={handleCombinedClick_open}  />
          </div>
        }
      </div>
      { showMainContent_SideBar && 
        <div className="collapseFalse"> 
          <div style={listOfLearningStyle}>
            <div style={button_listOfLearningStyle}>
              <Icon 
              name="angle-right"
              type="Bold"
              cssClass="btn text-light ms-0 "
              onClick={handleCombinedClick_close}  />
            </div>
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: '22px'
            }}>
              List of Learning
            </span>
          </div>
          <div className="border-top border-bottom" style={progressStyle}>
            <KMS_ProgressBar progress={progress}/>
            <span style={{ fontSize: '14px' }}>
              {progress}% Complete</span>
          </div>
          <div className="border-top" style={contentSidebarStyle}>
            <div style={styles.sidebarItem}>
              <a href="#" style={styles.link} onClick={onClick_preTest}>Pre-Test</a>
            </div>
            <div className="dropDown_menu">
              {dropdownData.map((dropdown, index) => (
                <div key={index} style={styles.sidebarItem}>
                  <div onClick={() => toggleDropdown(dropdown.name)} style={styles.buttonDropdown}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {dropdowns[dropdown.name] ? 
                          <Icon 
                            name="caret-up"
                            type="Bold"
                            cssClass="text-black ms-0" 
                          /> 
                          : 
                          <Icon 
                            name="caret-down"
                            type="Bold"
                            cssClass="text-black ms-0" 
                          />
                        }
                        <div style={{ paddingLeft: "20px", fontSize: '14px' }}>{dropdown.name}</div>
                      </div>
                      
                    </div>

                  </div>
                  {dropdowns[dropdown.name] && (
                    <div style={styles.dropdownContent}>
                      {dropdown.items.map((item, itemIndex) => (
                        <label key={itemIndex} style={styles.item}>
                          <Icon 
                            name="check"
                            type="Bold"
                            cssClass="text-black ms-0"
                            style={{paddingRight:'10px'}} 
                          /> 
                          <a href={item.href} style={styles.link}>{item.label}</a>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={styles.sidebarItem}>
              <a href="#" style={styles.link} onClick={onClick_forum}>Forum</a>
            </div>
            <div style={styles.sidebarItem}>
              <a href="#" style={styles.link} onClick={onClick_postTest}>Post-Test</a>
            </div>
          </div>
        </div>
      }
    
    </div>
    
  );
}
