import { useCallback } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography
} from '@mui/material'

export const AccountSetup = () => {
    const handleSubmit = useCallback(async e => {
        e.preventDefault();

        const { shopName } = e.target.elements;
        console.log(shopName.value);

    }, []);

    return (
        <>
            <Container>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h3" component="h3" align="left">Account Created! Enter a shop name:</Typography>
                    <TextField fullwidth required id="shopName" type="or" label="Organization / Shop Name" autoComplete="organization" />
                    <Button fullWidth variant="contained" type="submit">Submit</Button>
                </Box>
            </Container>
        </>
    );
}