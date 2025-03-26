import { contact } from "../models/contact";
import { deal } from "../models/deal";
import dotenv from "dotenv";
import { filter } from "../models/filter";
dotenv.config();

export const postContact = async (body: contact) => {
  try {
    const response = await fetch(`${process.env.URL_HUBSPOT}/` + "contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.API_KEY_HUBSPOT}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const r = await response.json();
      console.error(r);
      throw new Error("Error fetching api");
    }
    return response;
  } catch (e) {
    console.error(e);
    throw new Error(`${e}`);
  }
};
export const postDeal = async (body: deal) => {
  try {
    const response = await fetch(`${process.env.URL_HUBSPOT}/` + "deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.API_KEY_HUBSPOT}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const r = await response.json();
      console.error(r);
      throw new Error("Error fetching api");
    }
    return response;
  } catch (e) {
    console.error(e);
    throw new Error(`${e}`);
  }
  5;
};
export const getContact = async (body: filter) => {
  try {
    const response = await fetch(`${process.env.URL_HUBSPOT}/` + "contacts/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.API_KEY_HUBSPOT}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const r = await response.json();
      console.error(r);
      throw new Error("Error fetching api");
    }
    return response;
  } catch (e) {
    console.error(e);
    throw new Error(`${e}`);
  }
};
