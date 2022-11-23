import { useRef } from "react";
import { Button } from 'react-bootstrap';

const FileUploaderButton = ({ uploadId, children, variant, handleFileFunction }) => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null)

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        // const fileUploaded = event
        handleFileFunction(fileUploaded, uploadId);
    };
    return (
        <>
            <Button variant={variant} onClick={handleClick}>
                {children}
            </Button>
            <input
                type="file"
                id={uploadId}
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
                accept=".xlsx"
            />
        </>
    );
}

export default FileUploaderButton