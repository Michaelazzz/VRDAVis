import { makeAutoObservable } from "mobx";
import { VRDAVis } from "vrdavis-protobuf";

export class FileStore {
    fileList: VRDAVis.IFileListResponse;

    constructor () {
        makeAutoObservable(this);
        // @ts-ignore
        this.fileList = null;
    }

    setFileList = (list: VRDAVis.IFileListResponse) => {
        this.fileList = list;
    };

    getFileList = async (directory: string = "") => {
        
    }
}