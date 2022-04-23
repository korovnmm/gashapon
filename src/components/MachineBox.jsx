import { 
    Box
} from "@mui/material";

export function MachineBox(props) {
    
    /*
     * Once cranking has finished, you should call props.onCranked()
     * to display the prize pop-up
     */
    
    return (
        <Box component="center" sx={{backgroundColor:"white"}}>
            <h1>MachineBox</h1>
        </Box>
    );
}