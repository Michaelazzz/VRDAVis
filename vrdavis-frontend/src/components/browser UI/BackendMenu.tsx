import { observer } from "mobx-react";
import { useContext } from "react";
import { RootContext } from "../../store.context";


const BackendMenuView: React.FC = () => {
    const { backendStore } = useContext(RootContext);
    
    return (
        <>
            <h2>Remote Server</h2>
            {backendStore.connectionStatus === 0 && <p>No Connection</p>}
            {backendStore.connectionStatus === 1 && <p>Connection pending...</p>}
            {backendStore.connectionStatus === 2 && <p>Connected to server!</p>}
            {backendStore.sessionId !== 0 &&<p>Current Session ID: <br/> {backendStore.sessionId}</p>}
        </>
    )
}

const BackendMenu = observer(BackendMenuView);
export { BackendMenu };