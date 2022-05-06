import {
    Button, 
    IconButton
} from '@mui/material';
import { Link } from '@mui/icons-material';

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

export function CopyLinkButton({src: url, ...props}) {
    const onClick = (event) => {
        event.stopPropagation();
        if (props.onClick)
            props.onClick();
        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(url);
        alert("Failed to copy link, this feature is likely not supported by your web browser");
    }
    return (
        <>
            <IconButton {...props} onClick={onClick}>
                <Link fontSize="large"/>
            </IconButton>
        </>
    );
}