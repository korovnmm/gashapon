import {
    Backdrop,
    Button,
    Box
} from "@mui/material";
import { useContext, useState } from "react";
import { PrizeContext } from "pages/home/RedeemScreen";

export function PrizePopupBox(props) {
    const prize = useContext(PrizeContext);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <Button fullWidth variant="contained" onClick={handleToggle}>Show Prize PopUp</Button>
            <Backdrop open={open} onClick={handleClose}>
                <Box component="center" sx={{ borderRadius: "2%", backgroundColor: "white" }}>
                    <h1>PrizePopupBox</h1>
                    <img src={prize.image} style={{ height: "200px", width: "200px", borderRadius: "100%" }}/>
                    <div>{prize.name}</div>
                    <div>{prize.description}</div>
                </Box>
            </Backdrop>
        </>
    );
}