const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//test token
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjdhZjlhMTE4ZWEzOGQ0MDZjZTYyNSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcxOTIwMzU1MH0.W7kjNa8nfuiIIoe6acuZ-iflhNnG-IYyekjmI0Ov_Uw";

describe("User Test API", () => {
    it("Check for the user created and is existing", async () => {
        // Create User
        const response = await request(app).post("/api/user/register").send({
            fullName: "Pawan Chaudhary",
            email: "pawanchaudhary@example.com",
            password: "password123",
        });
        //check if already exists
        if (!response.body.success) {
            expect(response.body.message).toEqual('User already exists');
        } else {
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toEqual("Registered successfully");
        }
    });

    it("Login with valid data", async () => {
        const response = await request(app).post("/api/user/login").send({
            email: "pawanchaudhary@example.com",
            password: "password123",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Login Successfully");
        expect(response.body.userData.email).toBe("lalitsaud@example.com");
    });

    it("Failed with invilid data", async () => {
        const response = await request(app).post("/api/user/login").send({
            email: "pawanchaudhary@example.com",
            password: "password1234",
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid password");
    });

    it("fail if no user", async () => {
        const response = await request(app).post("/api/user/login").send({
            email: "nouser@example.com",
            password: "password123",
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User not found");
    });

    it("fail if email is missing", async () => {
        const response = await request(app).post("/api/user/login").send({
            password: "password123", // Missing email
        });
    
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Please enter all fields");
    });

    describe("Product Test API", () => {
        it("GET Products | Fetch all products", async () => {
            const response = await request(app)
                .get("/api/products/get_all_products")
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual("Products fetched successfully");
        });

        it("Products Search | products search by product name", async () => {
            const response = await request(app)
                .get("/api/products/search")
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual("Products searched successfully");
        });


        it("Pagination | Fetch products with pagination", async () => {
            const response = await request(app)
                .get("/api/products/pagination")
                .query({ _page: 1 })
                .set("authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Products Fetched");
            expect(response.body.products).toBeDefined();
        });
    });

    describe("Fetch Single Product", () => {
        it("GET Single Product | Fetch product by ID", async () => {
            const productId = '66851d54216b63a8453ba805'; // Replace with an actual valid ID

            const response = await request(app)
                .get(`/api/products/get_single_product/${productId}`)
                .set("authorization", `Bearer ${token}`);

            console.log('Response Status:', response.statusCode);
            console.log('Response Body:', response.body);

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toEqual("Product fetched");
            expect(response.body.product).toBeDefined();
            expect(response.body.product._id).toEqual(productId);
        });

        it("GET Single Product | Product not found", async () => {
            const invalidProductId = '66851d54216b63a8453ba805'; // Use an invalid ID

            const response = await request(app)
                .get(`/api/products/get_single_product/${invalidProductId}`)
                .set("authorization", `Bearer ${token}`);

            console.log('Response Status:', response.statusCode);
            console.log('Response Body:', response.body);

            expect(response.statusCode).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("Server error");
        });
    });

});

