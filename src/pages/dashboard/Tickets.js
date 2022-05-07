// DataGrid Documentation: https://mui.com/api/data-grid/data-grid/#component-name
import {
    Autocomplete,
    Box,
    Snackbar,
} from '@mui/material';
import { 
    DataGrid, 
    GridPagination, 
    GridToolbarContainer, 
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton
} from '@mui/x-data-grid';
import { 
    useCallback, 
    useEffect, 
    useState 
} from 'react';

import { generateTickets } from 'api';
import { useAuthState } from 'auth';
import { getTicketsGeneratedByUser, saveTicketsToMemory, getPrizeInfo } from 'db';
import { CopyLinkButton, SolidButton, TextField } from 'components';

var columns = [
    //{ field: 'orderID', headerName: 'Order #', width: 100 },
    { field: 'email', headerName: 'Email Address', width: 170 },
    { field: 'code', headerName: 'Play Code', width: 170 },
    { field: 'prizeName', headerName: 'Prize', width: 150 },
    { field: 'memo', headerName: 'Memo', width: 170 },
    { field: 'redeemed', headerName: 'Redeemed?', width: 110, type: "boolean" },
    { field: 'createdAt', headerName: 'Time Generated', width: 220, type: "dateTime",
        valueGetter: ({value}) => {
            if (value && value.seconds)
                return new Date(value.seconds*1000);
            return "Just now"; 
        }},
    //{ field: 'shipped', headerName: 'Shipped?', width: 90, type: "boolean" },
];

const amountOptions = Array.from({length:10}, (v,k)=>k+1); // a list from 1 to 10

function TicketsToolbar() {
    return (
        <>
            <GridToolbarContainer>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <GridPagination sx={{marginLeft: "auto"}}/>
            </GridToolbarContainer>
        </>
    );
}

export const Tickets = () => {
    const { user } = useAuthState();
    const [ticketData, setTicketData] = useState([]);
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false); // snackbar state 
    const [message, setMessage] = useState("");

    const showStatusMessage = (msg) => {
        setMessage(msg);
        setOpen(true);
    }
    
    columns.push({
        field: 'docID', headerName: '', width: 100, sortable: false, filterable: false,
            renderCell: (params) => {
                const baseURL = window.location.host;
                const code = params.getValue(params.id, 'code') || '';
                return (
                    <CopyLinkButton onClick={()=>showStatusMessage("Link copied to clipboard")} 
                        src={`${baseURL}/redeem/${code.replace('-', '/')}`} />
                );
            }
    });

    useEffect(() => {
        async function fetchData() {
            const tickets = await getTicketsGeneratedByUser(user);
            await updateTicketData(tickets);
        }
        fetchData();
    }, [user]);

    useEffect(() => {
        setRows(ticketData);
    }, [ticketData]);

    const handleClose = (event, reason) => { // snackbar close
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const updateTicketData = async (tickets) => {
        let prizeQueries = {};
        for (let ticket of tickets) {
            let prizeName = prizeQueries[ticket.prizeID];
            if (prizeName == null) { // means we haven't queried this ID before
                const result = await getPrizeInfo(ticket.prizeID);
                prizeQueries[ticket.prizeID] = result.name;
                prizeName = prizeQueries[ticket.prizeID];
            }
            ticket.prizeName = prizeName;
        }
        setTicketData(tickets);
    };

    const sendGenerateTicketsRequest = useCallback(async e => {
        e.preventDefault();
        
        const { email, memo, amount } = e.target.elements;
        generateTickets(email.value, memo.value, amount.value)
            .then(async (result) => {
                const data = result.data;
                const tickets = []
                for(const [key, value] of Object.entries(data)){
                    value.code = key;
                    tickets.push(value);
                }
                
                await updateTicketData(saveTicketsToMemory(tickets));
                showStatusMessage("Ticket(s) successfully generated");
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
            <div id="tickets-header"></div>
            <div id="tickets-body">
                <DataGrid
                    className="ticket-data-table"
                    autoHeight={false}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableColumnMenu
                    components={{Footer: TicketsToolbar}}
                />
            </div>
            <Box component="form" id="tickets-footer" onSubmit={sendGenerateTicketsRequest}>
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
                <SolidButton type="submit">Generate Ticket(s)</SolidButton>
            </Box>
            <Snackbar message={message} open={open} autoHideDuration={6000} onClose={handleClose}/>
        </>
    );
}