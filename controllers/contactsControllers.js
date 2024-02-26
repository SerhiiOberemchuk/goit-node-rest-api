import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    const result = await contactsService.listContacts();
    res.json(result)
};

export const getOneContact = async (req, res) => {
    // const result = await contactsService.getOneContact()
    // res.json(result)
};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
