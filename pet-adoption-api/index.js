const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

let pets = [
    { id: 1, name: 'Buddy', species: 'Dog', age: 3, adopted: false },
    { id: 2, name: 'Mittens', species: 'Cat', age: 2, adopted: true },
    { id: 3, name: 'Goldie', species: 'Fish', age: 1, adopted: false },
    { id: 4, name: 'Snowball', species: 'Rabbit', age: 4, adopted: false },
    { id: 5, name: 'Luna', species: 'Cat', age: 3, adopted: true }
];

let adopters = [
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', adoptedPets: [2] },
    { id: 2, name: 'John Smith', email: 'john@example.com', adoptedPets: [5] }
];

// GET /pets
// Retrieve all pets. Allows filtering by species using a query parameter.
app.get('/pets', (request, response) => {
    response.json(pets);
});

// GET /pets/:id
// Retrieve a specific pet's details by its ID.
app.get('/pets/:id', (request, response) => {
    const petId = parseInt(request.params.id);

    if (isNaN(petId)) {
         response
           .status(400)
           .json({ error: 'Invalid pet ID' });
        return;
    }

    const pet = pets.find(pet => pet.id === petId);

    if (!pet) {
        response
            .status(404)
            .json({ error: `Error: Pet with ID ${petId} not found` });
        return
    }

    response.json(pet);


});

// POST /pets
// Adds a new pet to the adoption list. Requires name, species, and age in the request body.
app.post('/pets', (request, response) => {
    const { name, species, age } = request.body;

    if (!name || !species || !age) {
        response
            .status(400)
            .json({ error: 'Missing required fields' });
        return;
    }

    const pet = {
        id: pets.length + 1,
        name,
        species,
        age,
        adopted: false
    };

    pets.push(pet);

    response.json(pet);


});

// PUT /pets/:id/adopt
// Marks a pet as adopted by its ID.
app.put('/pets/:id/adopt', (request, response) => {
    const petId = parseInt(request.params.id);

    if (isNaN(petId)) {
        response
            .status(400)
            .json({ error: 'Invalid pet ID' });
        return;
    }

    const pet = pets.find(pet => pet.id === petId);

    if (!pet) {
        response
            .status(404)
            .json({ error: `Error: Pet with ID ${petId} not found` });
        return;
    }

    pet.adopted = true;

    response.json(pet);

});

// DELETE /pets/:id
// Deletes a pet from the adoption list by its ID.
app.delete('/pets/:id', (request, response) => {
    const petId = parseInt(request.params.id);
    if (isNaN(petId)) {
        response
            .status(400)
            .json({ error: 'Invalid pet ID'});
        return;
    }

    const petIndex = pets.findIndex(pet => pet.id === petId);

    if (petIndex === -1) {
        response
            .status(404)
            .json({ error: `Error: Pet with ID ${petId} not found` });
        return;
    }

    pets.splice(petIndex, 1);
    response.status(204).json({ message: `Pet with ID ${petId} deleted` });
    return;


});

// GET /adopters
// Retrieve all adopters registered in the system.
app.get('/adopters', (request, response) => {
    let adoptersList = adopters.map(adopter => {
        return {
            id: adopter.id,
            name: adopter.name,
            email: adopter.email,
            adoptedPets: adopter.adoptedPets.map(petId => {
                return pets.find(pet => pet.id === petId);
            })
        };
    });

    response.json(adoptersList);


});

// POST /adopters
// Adds a new adopter to the system. Requires name and email in the request body.
app.post('/adopters', (request, response) => {
    const newAdopter = request.body;
    if (!newAdopter.name || !newAdopter.email) {
        response
            .status(400)
            .json({ error: 'Name and email are required'});
        return;
    }   

    newAdopter.id = adopters.length + 1;
    newAdopter.adoptedPets = [];
    adopters.push(newAdopter);
    response.json(newAdopter);



});

// PUT /adopters/:id/adopt/:petId
// Associates a pet with an adopter's record.
app.put('/adopters/:id/adopt/:petId', (request, response) => {
    const adopterId = parseInt(request.params.id);
    const petId = parseInt(request.params.petId);

    if (isNaN(adopterId) || isNaN(petId)) {
        response
            .status(400)
            .json({ error: 'Invalid adopter or pet ID' });
        return;
    }

    const adopter = adopters.find(adopter => adopter.id === adopterId);
    if (!adopter) {
        response
            .status(404)
            .json({ error: `Error: Adopter with ID ${adopterId} not found` });
        return;
    }

    const pet = pets.find(pet => pet.id === petId);
    if (!pet) {
        response
            .status(404)
            .json({ error: `Error: Pet with ID ${petId} not found` });
        return;
    }

    adopter.adoptedPets.push(petId);

    response.json(adopter);



});

// GET /adopters/:id/pets
// Retrieves all pets adopted by a specific adopter based on the adopter's ID
app.get('/adopters/:id/pets', (request, response) => {

    const adopterId = parseInt(request.params.id);
    if (isNaN(adopterId)) {
        response
            .status(400)
            .json({ error: 'Invalid adopter ID' });
        return;
    }

    const adopter = adopters.find(adopter => adopter.id === adopterId);
    if (!adopter) {
        response
            .status(404)
            .json({ error: `Error: Adopter with ID ${adopterId} not found` });
        return;
    }

    const adoptedPets = pets.filter(pet => adopter.adoptedPets.includes(pet.id));
    response.json(adoptedPets);



});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
