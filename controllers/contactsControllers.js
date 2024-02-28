import HttpError from "../helpers/HttpError.js";
import { ctrWrapper } from "../helpers/ctrWrapper.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = ctrWrapper(async (req, res, next) => {
  const result = await contactsService.listContacts();
  res.json(result);
});

export const getOneContact = ctrWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const deleteContact = ctrWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
});

export const createContact = ctrWrapper(async (req, res, next) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
});

export const updateContact = ctrWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
});
