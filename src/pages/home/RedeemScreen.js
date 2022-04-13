import { 
    getPrizeByCode,
    getTicketByCode
 } from 'db';
import { useEffect, useState } from 'react';
import { 
    useParams
} from 'react-router-dom'

export const RedeemScreen = () => {
    const { shopTag, code } = useParams();
    const [ticketData, setTicket] = useState("");
    const [prizeImage, setPrizeImage] = useState("");
    const [prizeInfo, setPrizeInfo] = useState("");

    useEffect(() => {
        async function fetchData() {
            const ticket = await getTicketByCode(`${shopTag}-${code}`);
            const prize = await getPrizeByCode(`${shopTag}-${code}`)
            setTicket(JSON.stringify(ticket));
            setPrizeImage(prize.image);
            setPrizeInfo(`${prize.name}: ${prize.description}`);
        }
        fetchData();
    }, []);

    return (
        <>
            <div>Your code: {shopTag}-{code}</div>
            <img src={prizeImage} />
            <h1>{prizeInfo}</h1>
            <br></br>
            <div>{ticketData}</div>
        </>
    );
}