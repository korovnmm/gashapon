import { useRef, useState } from "react";
import { 
    Box
} from "@mui/material";

import MachineVideo from "assets/kattapon_spin.mp4";

export function MachineBox(props) {
    const videoRef = useRef(null);
    const [cranked, setCranked] = useState(false);

    function playVideo() {
        if (!cranked)
            videoRef.current.play();
    }
    
    function onVideoFinished() {
        setCranked(true);
        props.onCranked();
    }

    return (
        <Box component="center">
            <div id="machine-box-wrap">
                <h1 className="machine-box-header">Click to spin!</h1>
                <div id="machine-inbox">
                    <video ref={videoRef} onEnded={onVideoFinished} onClick={playVideo} width="100%">
                        <source src={MachineVideo} type="video/mp4" />
                        Sorry, your browser doesn't support video embeds :(
                    </video>
                </div>
            </div>
        </Box>
    );
}