// DataGrid Documentation: https://mui.com/api/data-grid/data-grid/#component-name
import { useCallback, useEffect } from 'react'
import { 
    Autocomplete,
    Box,
    Button,
    Snackbar,
    TextField,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { generateTickets } from 'api'
import { useAuthState } from 'auth'
import { getTicketsGeneratedByUser, saveTicketsToMemory } from 'db';
import { useState } from 'react'

const columns = [
    //{ field: 'orderID', headerName: 'Order #', width: 100 },
    { field: 'email', headerName: 'Email Address', width: 170 },
    { field: 'code', headerName: 'Play Code', width: 170 },
    { field: 'prizeID', headerName: 'Prize', width: 150 },
    { field: 'memo', headerName: 'Memo', width: 170 },
    { field: 'redeemed', headerName: 'Redeemed?', width: 110, type: "boolean" },
    { field: 'createdAt', headerName: 'Time Generated', width: 220, type: "dateTime",
        valueGetter: ({value}) => value && (new Date(value.seconds*1000)) },
    { field: 'shipped', headerName: 'Shipped?', width: 90, type: "boolean" }
];

const amountOptions = Array.from({length:10}, (v,k)=>k+1); // a list from 1 to 10


export const Tickets = () => {
    const { user } = useAuthState();
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false); // snackbar state 
    
    useEffect(() => {
        getTicketsGeneratedByUser(user)
            .then((ticketData) => {
                setRows(ticketData)
            });
    }, [rows, user]);

    const handleClose = (event, reason) => { // snackbar close
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const sendGenerateTicketsRequest = useCallback(async e => {
        e.preventDefault();
        
        const { email, memo, amount } = e.target.elements;
        generateTickets(email.value, memo.value, amount.value)
            .then((result) => {
                const data = result.data;
                const tickets = []
                for(const [key, value] of Object.entries(data)){
                    value.code = key;
                    tickets.push(value);
                }
                setRows(saveTicketsToMemory(tickets));
                setOpen(true);
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                //const details = error.details;
                alert(`${code}: ${message}`);
            });
    }, []);

    return (
        <>
            <div class="tickets-header"></div>
            <div class="tickets-body">
                <DataGrid
                    autoHeight={true}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                />
            </div>
            <Box component="form" class="tickets-footer" onSubmit={sendGenerateTicketsRequest}>
                <TextField required id="email" type="email" label="Email Address" />
                <TextField id="memo" type="text" label="Memo" />
                <Autocomplete required
                    disablePortal
                    disableClearable
                    id="amount"
                    defaultValue={1}
                    options={amountOptions}
                    sx={{ width: 80, display: "inline-flex"}}
                    renderInput={(params) => <TextField {...params} label="Amount" />}
                />
                <Button variant="contained" type="submit">Generate New Code</Button>
            </Box>
            <Snackbar message="Ticket successfully generated" open={open} autoHideDuration={6000} onClose={handleClose}/>
        </>
    );
}