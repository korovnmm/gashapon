import {
    Backdrop,
    Box
} from "@mui/material";
import { SubmitButton } from "components";
import { useContext, useEffect, useState } from "react";
import { PrizeContext } from "pages/home/RedeemScreen";

export function PrizePopupBox(props) {
    const prize = useContext(PrizeContext);
    const [open, setOpen] = useState(false);
    const [anim, setAnim] = useState("");

    useEffect(() => {
        setOpen(props.show);
        if (props.show)
            setAnim("popup-open-anim");
        else
            setAnim("popup-close-anim");
    }, [props.show]);

    const handleClick = () => {
        if (props.onClick)
            props.onClick();
    };

    return (
        <>
            <Backdrop open={open}>
                <Box className={`popup-box ${anim}`} id="prize-popup"
                    component="center"
                    onAnimationEnd={() => setAnim("")}
                >
                    <div id="content-wrapper">
                        <h1>You Got a {prize.name}!</h1>
                        <img alt={prize.description} src={prize.image} />
                        <p>{prize.description}</p>
                        <SubmitButton onClick={handleClick}>Close</SubmitButton>
                    </div>
                </Box>
            </Backdrop>
        </>
    );
}