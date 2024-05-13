import {useState} from 'react'
import './uploader.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'

function KMS_Uploader(){
    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState("No selected file")
    return (
        <main>
            {/* <form className='form-file-upload-kms position-fixed'
            onClick={() => document.querySelector(".input-field").click()}>
                <input type='file' accept='iamge/*' className='input-field ' hidden
                onChange={({ target: {files}}) => {
                    files[0] && setFileName(files[0].name)
                    if(files){
                        setImage(URL.createObjectURL(files[0]))
                    }
                }}
                />
                {image ? <img src={image} width={60} height={60} alt='fileName' />
                :
                <>
                <MdCloudUpload color='#1475cf' size={60} />
                <p>Browse Files to upload</p>
                </>
                }
            </form>

            <section className='uploaded-row'>
                <AiFillFileImage color='#1475cf' />
                <span className='upload-content'>
                    {fileName} -
                    <MdDelete
                    onClick={() => {
                        setFileName("Np selected File")
                        setImage(null)
                    }}
                    />
                </span>
            </section> */}
            <div className="column-container">
                <form
                    className="form-file-upload-kms "
                    onClick={() => document.querySelector(".input-field").click()}
                >
                    <input
                    type="file"
                    accept="image/*"
                    className="input-field"
                    hidden
                    onChange={({ target: { files } }) => {
                        files[0] && setFileName(files[0].name);
                        if (files) {
                        setImage(URL.createObjectURL(files[0]));
                        }
                    }}
                    />
                    {image ? (
                    <img src={image} width={60} height={60} alt="fileName" />
                    ) : (
                    <>
                        <MdCloudUpload color="#1475cf" size={60} />
                        <p>Browse Files to upload</p>
                    </>
                    )}
                </form>

                <section className="uploaded-row" style={{ maxWidth: "51%" }}>
                    <AiFillFileImage color="#1475cf" />
                    <span className="upload-content">
                    {fileName} -
                    <MdDelete
                        onClick={() => {
                        setFileName("Np selected File");
                        setImage(null);
                        }}
                    />
                    </span>
                </section>
                </div>

        </main>
    )
}

export default KMS_Uploader