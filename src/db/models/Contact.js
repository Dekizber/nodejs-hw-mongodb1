import { model, Schema } from "mongoose";
import { typeList } from "../../constants/contacts.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },

    isFavourite: {
        type: Boolean,
        default: false,
    },

    contactType: {
        type: String,
        enum: typeList,
        required: true,
        default: 'personal',
    },

}, { versionKey: false, timestamps: true });

export const sortByListContact = ['name', 'phoneNumber', 'email', 'contactType'];

contactSchema.post('save', (error, data, next) => {
    error.status = 400;
    next();
});

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
