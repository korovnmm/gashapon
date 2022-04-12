import React from "react";
import { useHistory } from 'react-router-dom'
//import { getTicketByCode } from 'db'

import { 
    Box,
    Container,
    Typography
} from '@mui/material'  

import { useCallback } from "react";
import { 
    SubmitButton,
    TextField 
} from "components";

export const FormContainer = ({ ...props }) => {
    const location = useHistory();

    const handleClick = useCallback(async e => {
        e.preventDefault(); // prevents auto-refresh

        const { shopTag, digitKey } = e.target.elements;
        console.log(shopTag.value, digitKey.value);
        location.push(`/redeem/${shopTag.value}/${digitKey.value}`);
    }, [location]);

    return (
        <center className="form-container">
            <Box className="form-content"
                component="form"
                onSubmit={handleClick}
                noValidate
                autoComplete="off"
                {...props}
            />
        </center>
    );
}

export const Home = () => {
    return (
        <>
            <Container maxWidth="lg" className="home-wrapper">
                <FormContainer>        
                    <Typography variant="h2" component="h2">Welcome!</Typography>
                    <Typography variant="div" component="div" align="center">Please Enter Play Code</Typography>
                    <TextField required id="shopTag" type="shopTag" label="Prefix" autoComplete="off"/>
                    <TextField required id="digitKey" type="digitKey" label="6-Digit Code" autoComplete="off" />                
                    <SubmitButton>Enter</SubmitButton>
                </FormContainer>
            </Container>
        </>
    )
}
