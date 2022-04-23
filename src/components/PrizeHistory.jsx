import {
    Box
} from "@mui/material";
import { useContext, useEffect } from "react";
import { PrizeContext } from "pages/home/RedeemScreen";

export function PrizeHistoryCarousel(props) {
    const prize = useContext(PrizeContext);

    useEffect(() => {
        return;
    }, []);

    return (
        <Box component="center" sx={{ backgroundColor: "white" }}>
            <h1>PrizeHistoryCarousel</h1>
        </Box>
    );
}