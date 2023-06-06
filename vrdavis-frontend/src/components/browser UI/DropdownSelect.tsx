import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { observer } from "mobx-react";
import { useContext, useState } from "react";
import { RootContext } from "../../store.context";

const DropdownSelectView: React.FC = () => {
    const { backendStore } = useContext(RootContext);
    const files = backendStore.fileList;

    const [fileName, setFileName] = useState('');

    const onClick = (name: string, size: number) => {
        backendStore.fileName = name;
        backendStore.fileSize = size;
        backendStore.getFileInfo(backendStore.directory, backendStore.fileName)
    }

    const handleChange = (event: SelectChangeEvent) => {
        setFileName(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">File</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fileName}
                label="Files"
                onChange={handleChange}
            >
                {files && files.map((file, index) => <MenuItem onClick={event => onClick(file.name, file.size)} key={index} value={file.name}>{file.name}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

const DropdownSelect = observer(DropdownSelectView);
export { DropdownSelect };