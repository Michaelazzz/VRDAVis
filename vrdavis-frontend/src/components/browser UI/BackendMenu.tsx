import { observer } from "mobx-react";
import { useContext } from "react";
import { RootContext } from "../../store.context";
import { ConnectionStatus } from "../../stores/backend.store";


const BackendMenuView: React.FC = () => {
    const { backendStore } = useContext(RootContext);
    
    return (
        <>
            <h2>Remote Server</h2>
            {backendStore.connectionStatus === ConnectionStatus.CLOSED && <p>No Connection</p>}
            {backendStore.connectionStatus === ConnectionStatus.PENDING && <p>Connection pending...</p>}
            {backendStore.connectionStatus === ConnectionStatus.ACTIVE && <p>Connected to server!</p>}
            {backendStore.sessionId !== 0 &&<p>Current Session ID: <br/> {backendStore.sessionId}</p>}
        </>
    )
}

const BackendMenu = observer(BackendMenuView);
export { BackendMenu };