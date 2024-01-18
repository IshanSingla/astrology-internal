import { google, people_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../types';

// TODO: Load your OAuth2 credentials from a secure place
const YOUR_CLIENT_ID = 'your-client-id';
const YOUR_CLIENT_SECRET = 'your-client-secret';
const YOUR_REDIRECT_URL = 'your-redirect-url';

// Scopes for the People API
const SCOPES = ['https://www.googleapis.com/auth/contacts'];

// Initialize the OAuth2 client
const oauth2Client = new OAuth2Client(
    YOUR_CLIENT_ID,
    YOUR_CLIENT_SECRET,
    YOUR_REDIRECT_URL
);

// TODO: Retrieve and set the user's access and refresh tokens
// This usually comes from your application's database after the user has authenticated
oauth2Client.setCredentials({
    access_token: 'user-access-token',
    refresh_token: 'user-refresh-token'
});

// Function to get authenticated People API client
const getPeopleService = async (): Promise<people_v1.People> => {
    return google.people({ version: 'v1', auth: oauth2Client });
};

export const listContacts = async () => {
    const service = await getPeopleService();
    const res = await service.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses',
    });
    console.log(res.data);
    return res.data;
};

export const createContact = async (userData: User) => {
    const service = await getPeopleService();
    const contact: people_v1.Schema$Person = {
        names: [{ givenName: userData.name }],
        phoneNumbers: [
            { value: userData.mobile_number, type: 'mobile' },
            { value: userData.whatsapp_number, type: 'mobile' }
        ],
        birthdays: [{ date: { year: userData.dob.getFullYear(), month: userData.dob.getMonth() + 1, day: userData.dob.getDate() } }],
        addresses: [{
            streetAddress: `${userData.place_of_birth.city}, ${userData.place_of_birth.district}`,
            region: userData.place_of_birth.state,
            country: 'India', // Add country if available
            type: 'home'
        }]
    };

    const res = await service.people.createContact({
        requestBody: contact,
    });
    console.log('Contact created:', res.data);
    return res.data;
};
