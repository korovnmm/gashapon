import {
    Container
} from '@mui/material';
import { 
    createContext, 
    useEffect, 
    useState
} from 'react';
import { useParams } from 'react-router-dom';

import {
    MachineBox,
    PrizeHistoryCarousel,
    PrizePopupBox
} from 'components';
import {
    getPrizeByCode,
    getTicketByCode
} from 'db';


export const PrizeContext = createContext();

export const RedeemScreen = () => {
    const { shopTag, code } = useParams();
    const [ticketData, setTicket] = useState("");
    const [prizeImage, setPrizeImage] = useState("https://source.unsplash.com/random/?product");
    const [prizeInfo, setPrizeInfo] = useState({ name: "Prize Name", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id volutpat arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit."});
    const [popup, showPopup] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const ticket = await getTicketByCode(`${shopTag}-${code}`);
            const prize = await getPrizeByCode(`${shopTag}-${code}`)
            if (ticket)
                setTicket(ticket);
            if (prize) {
                setPrizeImage(prize.image);
                setPrizeInfo({name: prize.name, description: prize.description});
            }
            if (ticket && ticket.redeemed)
                handleCrank();
        }
        fetchData();
    }, [code, shopTag]);

    const handleCrank = () => {
        showPopup(true);
    };
    const handleClose = () => {
        showPopup(false);
    };

    
    return (
        <>
            <PrizeContext.Provider value={{
                        shopTag, code, 
                        ticket: ticketData, 
                        image: prizeImage, 
                        name: prizeInfo.name,
                        description: prizeInfo.description
                    }}>
                <Container maxWidth="lg" className="redeem-wrapper">
                    <MachineBox onCranked={handleCrank}/>
                    <PrizeHistoryCarousel />
                    <PrizePopupBox show={popup} onClick={handleClose} />
                </Container>
            </PrizeContext.Provider>
        </>
    );
}