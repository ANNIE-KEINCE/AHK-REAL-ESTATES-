export interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  propertyType: 'House' | 'Land' | 'Apartment' | 'Commercial';
  listingType: 'Sale' | 'Rent';
  area: string;
  images: string[];
  status: 'Available' | 'Sold' | 'Rented' | 'Inactive';
  featured: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Update {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  createdAt: any;
  enquiryStatus: 'New' | 'Handled' | 'Archived';
}

export interface Settings {
  businessName: string;
  whatsAppNumber: string;
  email: string;
  address: string;
  workingHours: string;
  socialMediaLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
