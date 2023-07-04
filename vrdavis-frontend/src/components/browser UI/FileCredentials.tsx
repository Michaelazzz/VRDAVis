import { useContext } from "react";
import { observer } from "mobx-react";

import { RootContext } from "../../store.context";

const FileCredentialsView: React.FC = () => {
    const { rootStore } = useContext(RootContext);
    const fileStore = rootStore.fileStore;

    return (
        <p>
            { fileStore && fileStore.fileName && 
                <span><b>Path: </b>{fileStore.directory}/{fileStore.fileName}</span> } <br/>
            { fileStore && fileStore.fileName && 
                <span><b>Name: </b>{fileStore.fileName}</span> } <br/>
            { fileStore && fileStore.fileSize > 0 && 
                <span><b>Size: </b>{fileStore.fileSize} Kbyte</span> } <br/>
            { fileStore && fileStore.fileWidth > 0 && 
                <span><b>Dimensions: </b>{fileStore.fileWidth}x{fileStore.fileHeight}x{fileStore.fileLength}</span> }
        </p>
    )
}

const FileCredentials = observer(FileCredentialsView);
export { FileCredentials };