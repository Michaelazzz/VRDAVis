import { observer } from "mobx-react";
import { useContext } from "react";
import { RootContext } from "../../store.context";
import { ConnectionStatus } from "../../stores/backend.store";
import { DropdownSelect } from "./DropdownSelect";


const BackendMenuView: React.FC = () => {
    const { rootStore } = useContext(RootContext);
    const backendStore = rootStore.backendStore;
    
    return (
        <>
            <h2>Remote Server</h2>
            <p>
                Connection: {(backendStore.connectionStatus === ConnectionStatus.CLOSED || backendStore.connectionDropped) && <span>CLOSED</span>}
                {backendStore.connectionStatus === ConnectionStatus.PENDING && <span>PENDING</span>}
                {backendStore.connectionStatus === ConnectionStatus.ACTIVE && <span>OPEN</span>}
                <br/>
                {backendStore.connectionStatus === ConnectionStatus.ACTIVE && backendStore.sessionId !== 0 && <span>Current Session ID: {backendStore.sessionId}</span>}
            </p>
            {backendStore.connectionStatus === ConnectionStatus.ACTIVE && !rootStore.backendStore.fileSelected && <DropdownSelect/>}
            {backendStore.connectionStatus === ConnectionStatus.ACTIVE && rootStore.backendStore.fileSelected && <p>Refresh the webpage to select a new file</p>}
        </>
    )
}

const BackendMenu = observer(BackendMenuView);
export { BackendMenu };