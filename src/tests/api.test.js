/**
 * @jest-environment node
 */
import { generateTickets, call, addNewPrize } from 'api'
import { 
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    getAuth, 
    signOut
} from 'auth'
import { getPrizeMetaData } from 'db';

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
    let prizeData;

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
    
    it("can add prizes to their shop's inventory", () => {
        const dummyPrize = {
            name: "Shiny Sticker",
            description: "It glows!",
            image: "example.com/example.png",
            quantity: 10
        };
        return addNewPrize(dummyPrize.name, dummyPrize.description, dummyPrize.quantity, dummyPrize.image)
            .then((result) => {
                prizeData = result.data;
                expect(prizeData).toMatchObject({
                    id: expect.any(String),
                    prizeMetaData: {
                        createdAt: expect.any(Object),
                        creatorUserID: auth.currentUser.uid,
                        quantity: dummyPrize.quantity
                    },
                    prizeInfoData: {
                      description: dummyPrize.description,
                      image: dummyPrize.image,
                      name: dummyPrize.name,
                      lastModified: expect.any(Object)  
                    }
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
                    expect(result.data[key]).toMatchObject({
                        createdAt: expect.any(Object),
                        email: "customer@example.com",
                        memo: "blank memo",
                        orderID: null,
                        prizeID: prizeData.id,
                        redeemed: false
                    });
                }
                
                // Check that quantity has decremented appropriately
                return getPrizeMetaData(prizeData.id)
                    .then((newPrizeData) => {
                        expect(newPrizeData.quantity).toBe(prizeData.prizeMetaData.quantity - keys.length);
                        prizeData.prizeMetaData = newPrizeData;
                    });
            });
    });

    it("can generate multiple play tickets without errors", () => {
        return generateTickets("customer2@example.com", "", 5)
            .then((result) => {
                let keys = Object.keys(result.data);
                expect(keys.length).toBe(5);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    expect(keys.slice(i+1).indexOf(key)).toBe(-1); // checks for duplicates
                    expect(key.substring(0, 7)).toMatch("itsjo-");
                    expect(result.data[key]).toMatchObject({
                        createdAt: expect.any(Object),
                        email: "customer2@example.com",
                        memo: "",
                        orderID: null,
                        prizeID: prizeData.id,
                        redeemed: false
                    });
                }

                // Check that quantity has decremented appropriately
                return getPrizeMetaData(prizeData.id)
                    .then((newPrizeData) => {
                        expect(newPrizeData.quantity).toBe(prizeData.prizeMetaData.quantity - keys.length);
                        prizeData.prizeMetaData = newPrizeData;
                    });
            });
    });

    it("should not be able to generate more tickets than there are prizes", () => {
        return expect(async () => {
            const amountLeft = prizeData.prizeMetaData.quantity;
            await generateTickets("customer3@example.com", "", amountLeft + 1);
        }).rejects.toThrow(/not enough/i);
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
                expect(result.data).toMatchObject({
                    id: expect.any(String), 
                    prizeMetaData: expect.any(Object),
                    prizeInfoData: expect.any(Object)
                });
                
                // Should have these keys: createdAt, creatorUserID, quantity
                let prizeID = result.data.id;
                let prize = result.data.prizeMetaData;
                expect(prize).toMatchObject({
                    createdAt: expect.any(Object),
                    creatorUserID: auth.currentUser.uid,
                    quantity: prizeData.quantity
                });
                expect(Object.keys(prize).length).toBe(3); // only 3 variables in the dictionary
                
                // Verify that the corresponding prize-info document has been created
                // Should have these keys: description, image, name, lastModified
                let infoData = result.data.prizeInfoData;
                expect(infoData).toMatchObject({
                    name: prizeData.name,
                    description: prizeData.description,
                    image: prizeData.image,
                    lastModified: expect.any(Object)
                });
                expect(Object.keys(infoData).length).toBe(4);
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
                expect(result.data).toMatchObject({
                    id: expect.any(String), 
                    prizeMetaData: expect.any(Object),
                    prizeInfoData: expect.any(Object)
                });
                
                // Should have these keys: createdAt, creatorUserID, quantity
                let prizeID = result.data.id;
                let prize = result.data.prizeMetaData;
                expect(prize).toMatchObject({
                    createdAt: expect.any(Object),
                    creatorUserID: auth.currentUser.uid,
                    quantity: prizeData.quantity
                });
                expect(Object.keys(prize).length).toBe(3); // only 3 variables in the dictionary
                
                // Verify that the corresponding prize-info document has been created
                // Should have these keys: description, image, name, lastModified
                let infoData = result.data.prizeInfoData;
                expect(infoData).toMatchObject({
                    name: prizeData.name,
                    description: prizeData.description,
                    image: prizeData.image,
                    lastModified: expect.any(Object)
                });
                expect(Object.keys(infoData).length).toBe(4);
            });
    });

});