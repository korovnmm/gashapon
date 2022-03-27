import logo from "assets/gashapon_pink.png"

export const About = () => {
    
    
    return (
        
        <>
            <div class = "banner"><h1 class = "kattapon">KATTAPON!</h1></div>
            <div class = "move-right">
                <div class="circle1"><div class="circle2"><div class="circle3"></div></div></div>
                
                <h1>Welcome to Project Gashapon!</h1>
                <h2>What is Gashapon?</h2>
                <h4>
                    Based on the Japanese toy machine that dispenses capsules with random prizes of toys, merch, or candy,
                    we wanted to bring that idea online and help shopkeepers automate that process! Teaming up with your favorite shops, 
                    we made it so you can interactively play and try your luck in obtaining
                    real prizes!
                </h4>
                
                <img
                class="image"
                src={logo}
                alt=""
                />
            </div>
        </>
        
    );
}