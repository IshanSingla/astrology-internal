export interface PlaceOfBirth {
    district: string;
    state: string;
    city: string;
  }
  
  export interface User {
    name: string;
    mobile_number: string;
    whatsapp_number: string;
    dob: Date;
    place_of_birth: PlaceOfBirth;
    series_number: number;
  }
  