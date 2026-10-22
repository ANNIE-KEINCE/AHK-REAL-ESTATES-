export const ADMIN_UID = "n8KRHByOOeWAr5WTHHx7DiOCxRr2";

export const BUSINESS_DETAILS = {
  name: "AHK Real Estate",
  whatsapp: "+91 93458 38101",
  whatsappLink: "https://wa.me/919345838101",
  email: "contact@ahkrealestate.com",
  address: "Polur,Tiruvannamalai district ",
  instagramLink: "https://www.instagram.com/iam.abdul_7/",
  mapsLink: "https://maps.app.goo.gl/ZHYN3wJjJhe91B9FA",
  workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
};

export const WHATSAPP_MESSAGES = {
  general: "Hello AHK Real Estate, I would like to know more about your properties.",
  propertyEnquiry: (title: string, location: string, price: string) => 
    `Hello AHK Real Estate, I am interested in this property:\nProperty: ${title}\nLocation: ${location}\nPrice: ${price}\nPlease share more details.`
};
