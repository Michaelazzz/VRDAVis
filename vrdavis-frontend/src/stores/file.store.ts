import { makeAutoObservable } from "mobx";
import { VRDAVis } from "vrdavis-protobuf";
import { RootStore } from "./root.store";
import { BackendStore } from "./backend.store";

export class FileStore {
    rootStore: RootStore;

    directory: string = '';

    fileList: any[] = [];

    // selected file info
    fileSelected: boolean = false;
    fileName: string = '';
    fileSize: number = 0;

    fileDimesions = 0;
    fileWidth = 0;
    fileHeight = 0;
    fileLength = 0;
    
    constructor (rootStore: RootStore) {
        makeAutoObservable(this, {rootStore: false});
        this.rootStore = rootStore;
    }

    setFileList = (list: any[]) => {
        this.fileList = list;
    };

    setFileName = (name: string) => {
        this.fileName = name;
    }

    setFileSize = (size: number) => {
        this.fileSize = size;
    }

    setDirectory = (directory: string) => {
        this.directory = directory;
    }

    setDimensions = (dims: number, fileWidth: number, fileHeight: number, fileLength: number) => {
        this.fileDimesions = dims;
        this.fileWidth = fileWidth;
        this.fileHeight = fileHeight;
        this.fileLength = fileLength;
    }
}