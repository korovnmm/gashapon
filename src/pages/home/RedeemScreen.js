import { 
    useParams
} from 'react-router-dom'

export const RedeemScreen = () => {
    const { shopTag, code } = useParams();

    return (
        <>
            <div>Your code: {shopTag}-{code}</div>
        </>
    );
}