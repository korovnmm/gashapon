// DataGrid Documentation: https://mui.com/api/data-grid/data-grid/#component-name
import { useCallback, useEffect } from 'react'
import { 
    Autocomplete,
    Box,
    Button,
    TextField,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { generateTickets } from 'api'
import { useAuthState } from 'auth'
import { getTicketsGeneratedByUser } from 'db';
import { useState } from 'react'

const columns = [
    //{ field: 'orderID', headerName: 'Order #', width: 100 },
    { field: 'email', headerName: 'Email Address', width: 170 },
    { field: 'code', headerName: 'Play Code', width: 170 },
    //{ field: 'prizeID', headerName: 'Prize', width: 150 },
    //{ field: 'memo', headerName: 'Memo', width: 170 },
    //{ field: 'shipped', headerName: 'Shipped?', width: 150, type: "boolean" },
    //{ field: 'redeemed', headerName: 'Redeemed?', width: 150, type: "boolean" },
    //{ field: 'createdAt', headerName: 'Time Generated', width: 150, type: "dateTime", valueGetter: ({value}) => value && new Date(value.seconds) }
];

/*
[
    {id: 1, email: "123@abc.com", orderID:"QWER-1357", code:"shopname-0A0A0A", prizeName: "Prize A", memo: "", shipped: true},
    { id: 2, email: "321@abc.com", orderID: "ASDF-2468", code: "shopname-1B1B1B", prizeName: "Prize B", memo: "ship after thanksgiving", shipped: false }
];
*/
const amountOptions = Array.from({length:10}, (v,k)=>k+1); // a list from 1 to 10


export const Tickets = () => {
    const { user } = useAuthState();
    const [rows, setRows] = useState([]);
    /*
    useEffect(() => {
        var tickets = getTicketsGeneratedByUser(user);
        setRows(tickets);
    }, [rows]);
    useEffect(() => { console.log(rows)}, [rows]);
    */
    const sendGenerateTicketsRequest = useCallback(async e => {
        e.preventDefault();
        
        const { email, memo, amount } = e.target.elements;
        generateTickets(email.value, memo.value, amount.value)
            .then((result) => {
                const data = result.data;
                console.log(data);
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                const details = error.details;
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
            <div>{JSON.stringify(rows)}</div>
        </>
    );
}