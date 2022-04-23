import {
    Backdrop,
    Box
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PrizeContext } from "pages/home/RedeemScreen";

export function PrizePopupBox(props) {
    const prize = useContext(PrizeContext);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.show);
    }, [props.show]);

    const handleClick = () => {
        if (props.onClick)
            props.onClick();
    };

    return (
        <>
            <Backdrop open={open} onClick={handleClick}>
                <Box component="center" sx={{ borderRadius: "2%", backgroundColor: "white" }}>
                    <h1>PrizePopupBox</h1>
                    <img alt="" src={prize.image} style={{ height: "200px", width: "200px", borderRadius: "100%" }}/>
                    <div>{prize.name}</div>
                    <div>{prize.description}</div>
                </Box>
            </Backdrop>
        </>
    );
}