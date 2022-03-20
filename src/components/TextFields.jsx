import {
    TextField as MuiTextField
} from '@mui/material';

export function TextField(props) {
    return (
        <div className="textfield-default">
            <MuiTextField 
                {...props}
            />
        </div>
    );
}