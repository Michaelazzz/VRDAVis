import { observer } from "mobx-react";
import { useContext } from "react";
import { RootContext } from "../../store.context";

const WebRTCMenuView: React.FC = () => {
    const { signallingStore } = useContext(RootContext);
    const logs = signallingStore.logs
    return (
        <>
            <h2>Web RTC</h2>
            <p>Log</p>
            {logs.length >= 5 && logs.slice(logs.length-5, logs.length).map((item: any, index: number) => (
                <p key={index}>
                    {item}
                </p>
            ))}
        </>
    );
}

const WebRTCMenu = observer(WebRTCMenuView);
export { WebRTCMenu };
