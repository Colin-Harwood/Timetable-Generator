import { Module } from "../models/module.model.js"

const addModule = async (req, res) => {
    try {
        const newModule = new Module(req.body);
        await newModule.save();
        res.status(201).json(newModule);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error" });
    }
}

export { 
    addModule
};