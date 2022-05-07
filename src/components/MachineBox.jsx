import { useContext, useRef, useState } from "react";
import { 
    Box
} from "@mui/material";
import { PrizeContext } from "pages/home/RedeemScreen";

import MachineVideo from "assets/kattapon_spin2.mp4";

export function MachineBox(props) {
    const videoRef = useRef(null);
    const prize = useContext(PrizeContext);
    const [cranked, setCranked] = useState(false);

    function playVideo() {
        if (!cranked && !prize.ticket.redeemed)
            videoRef.current.play();
    }
    
    function onVideoFinished() {
        setCranked(true);
        props.onCranked();
    }

    return (
        <Box component="center">
            <div id="machine-box-wrap">
                <h1 className="machine-box-header">Click to Spin!</h1>
                <div id="machine-inbox">
                    <video ref={videoRef} onEnded={onVideoFinished} onClick={playVideo} style={{cursor: "pointer", width:"100%" }}>
                        <source src={MachineVideo} type="video/mp4" />
                        Sorry, your browser doesn't support video embeds :(
                    </video>
                </div>
            </div>
        </Box>
    );
}