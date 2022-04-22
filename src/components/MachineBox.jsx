import { 
    Box
} from "@mui/material";
import { useContext } from "react";
import { PrizeContext } from "pages/home/RedeemScreen";

export function MachineBox(props) {
    const prize = useContext(PrizeContext);

    return (
        <Box component="center" sx={{backgroundColor:"white"}}>
            <h1>MachineBox</h1>
        </Box>
    );
}