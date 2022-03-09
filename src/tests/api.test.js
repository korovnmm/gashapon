import { generateTickets, call } from 'api'
import { 
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    getAuth, 
    signOut
} from 'auth'
import { getPrizeInfo } from 'db'

// Setup
let auth = getAuth();
let exampleUserEmail = "itsjoe@example.com";
let examplePassword = "superSecretPassword123";
afterAll(() => {
    return auth.currentUser.delete();
});

describe('Server', () => {
    
    it("is running (hello world)", () => {
        return call("helloWorld").then((json) => {
            expect(json).toEqual({ "data": "World!" });
            expect(json.data).toMatch("World!");
        });
    });

});



// --- Tests ---

describe('Shopkeeper', () => {

    it("can create a new user account", () => {
        return createUserWithEmailAndPassword(auth, exampleUserEmail, examplePassword)
            .then(() => {
                return call("userLoggedIn")
                    .then((json) => {
                        expect(json.data.result).toMatch("created");
                        return signOut(auth);
                    });
            });
    });

    it("can sign in", () => {
        return signInWithEmailAndPassword(auth, exampleUserEmail, examplePassword)
            .then(() => {
                expect(auth.currentUser.email).toMatch(exampleUserEmail);
                return call("userLoggedIn")
                    .then((json) => {
                        expect(json.data.result).toMatch("success");
                    });
            });
    });
    
    it("can generate a play ticket without errors", () => {
        return generateTickets("customer@example.com", "blank memo", 1)
            .then((result) => {
                let keys = Object.keys(result.data); 
                expect(keys.length).toBe(1);
                for (let key of keys) {
                    expect(key.substring(0,7)).toMatch("itsjo-");
                    expect(result.data[key]["email"]).toMatch("customer@example.com");
                    expect(result.data[key]["memo"]).toMatch("blank memo");
                }
            });
    });

    it("can generate multiple play tickets without errors", () => {
        return generateTickets("customer2@example.com", "", 10)
            .then((result) => {
                let keys = Object.keys(result.data);
                expect(keys.length).toBe(10);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    expect(keys.slice(i+1).indexOf(key)).toBe(-1); // checks for duplicates
                    expect(key.substring(0, 7)).toMatch("itsjo-");
                    expect(result.data[key]["email"]).toMatch("customer2@example.com");
                    expect(result.data[key]["memo"]).toMatch("");
                }
            });
    });

    /**
     * This test expects 2 documents to have been created: one in 'prizes', and one in 'prize-info',
     * the call to addNewPrize should return data from the document that was created in 'prizes'.
     */
    it("can add prizes via functions endpoint", () => {
        const prizeData = {
            description: "It's really cool!",
            image: "assume we have uploaded an image earlier, its url goes here",
            name: "Cool Prize #1",
            quantity: 11
        };

        return call("addNewPrize", prizeData)
            .then((result) => {
                let keys = Object.keys(result.data); 
                expect(keys.length).toBe(1); // should have only returned 1 prize object
                
                // Should have these keys: createdAt, creatorUserID, quantity
                let prizeID = keys[0];
                let prize = result.data[prizeID];
                expect(prize).toMatchObject({
                    createdAt: expect.any(String),
                    creatorUserID: auth.currentUser.uid,
                    quantity: prizeData.quantity
                });
                expect(Object.keys(prize).length).toBe(3); // only 3 variables in the dictionary
                
                // Verify that the corresponding prize-info document has been created
                // Should have these keys: description, image, name, lastModified
                let infoData = await getPrizeInfo(prizeID);
                expect(infoData).toMatchObject({
                    name: prizeData.name,
                    description: prizeData.description,
                    image: prizeData.image,
                    lastModified: expect.any(String)
                });
                expect(Object.keys(infoData).length).toBe(4);
            });
    });

});