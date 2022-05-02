import {
    Backdrop,
    Box
} from "@mui/material";
import { Footnote, SubmitButton } from "components";
import { useCallback, useContext, useEffect, useState } from "react";
import { PrizeContext } from "pages/home/RedeemScreen";
import { markTicketAsRedeemed } from "api";


export function PrizePopupBox(props) {
    const prize = useContext(PrizeContext);
    const [open, setOpen] = useState(false);
    const [anim, setAnim] = useState("");
    
    const verifyRedemptionStatus = useCallback(async () => {
        if (!prize.ticket.redeemed)
            await markTicketAsRedeemed(`${prize.shopTag}-${prize.code}`);
    }, [prize.shopTag, prize.code, prize.ticket.redeemed]);

    useEffect(() => {
        setOpen(props.show);
        if (props.show) {
            setAnim("popup-open-anim");
            verifyRedemptionStatus();
        } else
            setAnim("popup-close-anim");
    }, [props.show, verifyRedemptionStatus]);

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
                        <h1>
                            You Got a <span id="prize-name">{prize.name}</span>
                        </h1>
                        <Footnote hidden={!prize.ticket.redeemed}>This Prize Has Already Been Redeemed</Footnote>
                        <img alt={prize.description} src={prize.image} />
                        <p>{prize.description}</p>
                        <SubmitButton onClick={handleClick}>Close</SubmitButton>
                    </div>
                </Box>
            </Backdrop>
        </>
    );
}