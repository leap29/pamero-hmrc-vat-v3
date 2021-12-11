import React, {CSSProperties, useCallback, useMemo} from 'react'
import {useDropzone} from 'react-dropzone'
import {fileParsed, ISubmission, Submission} from "./obligationsSlice";
import {useAppDispatch} from "../../app/hooks";

const baseStyle : CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

//TODO - The parsing of the file, the interface which describes a submission and the adding to the redux store may be
// better in another location
function parseFileContents(rawFileContents : string) : ISubmission{
    let parsedFileContents : ISubmission = {} as ISubmission;
    parsedFileContents.box_1 = '0.00';
    parsedFileContents.box_2 = '1.23';
    parsedFileContents.box_3 = '2.34';
    parsedFileContents.box_4 = '0.00';
    parsedFileContents.box_5 = '1.23';
    parsedFileContents.box_6 = '2.34';
    parsedFileContents.box_7 = '0.00';
    parsedFileContents.box_8 = '1.23';
    parsedFileContents.box_9 = '2.34';

    console.log(rawFileContents);

    console.log(parsedFileContents);

    return parsedFileContents;
}




export function FileDropZone() {
    //Map dispatch to the useAppDispatch hook
    const dispatch = useAppDispatch();


    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
            const reader : FileReader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const textStr : string = reader.result as string;
                const theParsedSubmission : ISubmission = parseFileContents(textStr);
                dispatch(fileParsed(theParsedSubmission));
            }
            reader.readAsText(file)
        })

    }, []);


    //TODO - Figure out why using a single file type does not result in the D&D outline going green
    // Upon hover over for the correct file type makes the outline red but the file is still accepted
    // this odd behaviour only happens if the accepted types are set to something like '.txt' whereas
    // if they are set to something more generic like 'text/*' then the highlighting works fine
    // This only affects the styling but not whether the file is actually accepted or not
    // The acceptance of the file works regardless
        const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}
        = useDropzone({onDrop, accept: '.csv'});

    const style : CSSProperties = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
        ...(isDragAccept ? acceptStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    return (
        <div className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the file here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
        </div>
    )
}