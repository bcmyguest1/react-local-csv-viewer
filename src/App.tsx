import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import { readString } from 'react-papaparse';
import {ParseConfig} from 'papaparse';
import ReactJson from 'react-json-view';

function App() {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const noFileSelected = "No file selected";
    const [file, setFile] = useState<null | File>(null);
    const [fileMessage, setfileMessage] = useState<null | string>(noFileSelected);
    const [fileData, setFileData] = useState<object[] | null>(null);

    function handleClick(e: React.MouseEvent) {
        inputFile.current?.click();
    }

    function changeFile(e: ChangeEvent) {
        console.log(e);
        let files: any = (e.target as HTMLInputElement).files;

        if (files.length > 1) {
            setfileMessage("too many files selected");
            return;
        }

        let file = files.length > 0 ? files[0] : null;
        let fileMessage = file != null ? file.name : noFileSelected;
        setFile(file);
        setfileMessage(fileMessage);
    }

    function readCsvFileLocal(file: File) {
        let fileReader: FileReader = new FileReader();
        fileReader.onload = (e) => {
            if (e.target?.result != null) {
                let parseConfig: ParseConfig = {header: true};
                let obj = readString(e.target.result as string, parseConfig);
                console.log(obj);
                console.log(obj.meta);
                setFileData(obj.data);
            }
            console.log("no file to parse");
            return null;
        }

        fileReader.readAsText(file);
    }

    useEffect(() => {
        if (file != null) {
            readCsvFileLocal(file);
        }
    },[file]);

    return (
        <div className="App">
            <header className="App-header">
                CSV File Reader
            </header>
            <input onChange={changeFile} type='file' id='file' accept='.csv' ref={inputFile} style={{display: 'none'}}/>
            <CsvUploader handleClick={handleClick} fileMessage={fileMessage}>
            </CsvUploader>
            <ObjectListDisplay objects={fileData}/>
        </div>
    );
}

function CsvUploader(props: any) {
    return (<React.Fragment>
        <button onClick={props.handleClick}>Upload csv sheet

        </button>

        <h3>file: {props.fileMessage}</h3>
    </React.Fragment>);
}

function ObjectListDisplay(props: {objects: object[] | null}) {
    return (props.objects != null ? props.objects.length > 0 : false) ?
        <React.Fragment>
            <ReactJson style={{flex: 1, flexDirection: 'row', textAlign: 'left'}} src={props.objects || {}}/>
        </React.Fragment> : <NoValuesFound/>;
}


function NoValuesFound() {
    return <React.Fragment>No values found</React.Fragment>;
}

export default App;
