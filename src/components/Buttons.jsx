import {
    Button
} from '@mui/material';

export function SubmitButton(props) {
    return (
        <Button 
            className="submit-button"
            variant="outlined" 
            color="secondary"
            type="submit"  
            {...props} 
        />
    );
}