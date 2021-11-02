import { useAuthState } from '../firebase'

export const About = () => {
    const { user } = useAuthState();

    return (
        <>
            <h1>Welcome to Project Gashapon!</h1>
            <div>Signed in as {user?.email}</div>
        </>
    );
}