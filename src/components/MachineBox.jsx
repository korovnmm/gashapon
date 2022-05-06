import { 
    Box
} from "@mui/material";

export function MachineBox(props) {
    
    /*
     * Once cranking has finished, you should call props.onCranked()
     * to display the prize pop-up
     * 
     * 
     * src = {}?
     */
    
    return (
        <Box component="center">
            <div id="machine-box-wrap">
                <h1 class="machine-box-header">Click to spin!</h1>
                <div id="machine-inbox">
                    <img id="machine-img" onclick="changeImage()" src="./assets/kattapon_spin.mp4"></img>
                </div>
            </div>

        </Box>
    );

    function changeImage() {
        if (document.getElementById("machine-img").src == "./assets/kattapon_spin.mp4"){
            document.getElementById("machine-img").src = "./assets/kattapon_spin.mp4";
        } else {
            document.getElementById("machine-img").src = "./assets/kattapon_spin.mp4";
        }
        props.onCranked();
    }
}