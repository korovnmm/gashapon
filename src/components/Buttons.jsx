import {
    Button
} from '@mui/material';

export function OutlinedButton(props) {
    return (<SubmitButton type="button" {...props} />);
}

export function SubmitButton(props) {
    return (
        <Button 
            className="submit-button katta-button"
            variant="outlined" 
            color="secondary"
            type="submit"  
            {...props} 
        />
    );
}

export function TextButton(props) {
    return (
        <Button 
            className="text-button katta-button"
            variant="text"
            {...props}
        />
    );
}

export function SolidButton(props) {
    return (
        <Button
            disableElevation
            className="solid-button katta-button"
            variant="contained"
            {...props}
        />
    );
}