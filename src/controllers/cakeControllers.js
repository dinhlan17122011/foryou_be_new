// controllers/cakeControllers.js
import CakeModel from '../models/cakeModels.js';

// Get list of cakes
export async function getCakes(req, res) {
    try {
        const cakes = await CakeModel.find();
        res.render('managerCake', { cakes });
    } catch (error) {
        res.status(500).send('Error fetching cake list');
        console.error('Error fetching cakes:', error);
    }
}

// Add a new cake
export async function addCake(req, res) {
    try {
        const { name, price, description } = req.body;
        const newCake = new CakeModel({ name, price, description });
        await newCake.save();
        res.redirect('/cake');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error adding new cake');
    }
}

export function add(req,res){
    res.render('addCake');
}

// Update cake information
export async function updateCake(req, res) {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        await CakeModel.findByIdAndUpdate(id, { name, price, description });
        res.redirect('/managerCakes');
    } catch (error) {
        res.status(500).send('Error updating cake');
    }
}

// Delete a cake
export async function deleteCake(req, res) {
    try {
        const { id } = req.params;
        await CakeModel.findByIdAndDelete(id);
        res.redirect('/managerCakes');
    } catch (error) {
        res.status(500).send('Error deleting cake');
    }
}
