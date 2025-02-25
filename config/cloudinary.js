import cloudinary from "cloudinary";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const cloudinaryAccounts = [
  {
    name: "account1",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_1,
    api_key: process.env.CLOUDINARY_API_KEY_1,
    api_secret: process.env.CLOUDINARY_API_SECRET_1,
  },
  {
    name: "account2",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_2,
    api_key: process.env.CLOUDINARY_API_KEY_2,
    api_secret: process.env.CLOUDINARY_API_SECRET_2,
  },

];

let currentAccountIndex = 0; 


const checkAccountUsage = async (account) => {
  try {
   

    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${account.cloud_name}/usage`,
      {
        auth: {
          username: account.api_key,
          password: account.api_secret,
        },
      }
    );

    const { storage, credits } = response.data;

    

    return credits.used_percent < 90;
  } catch (error) {
    return false;
  }
};


const switchCloudinaryAccount = async () => {
  for (let i = 0; i < cloudinaryAccounts.length; i++) {
    const accountIndex = (currentAccountIndex + i) % cloudinaryAccounts.length;
    const account = cloudinaryAccounts[accountIndex];

    const isAvailable = await checkAccountUsage(account);

    if (isAvailable) {
      cloudinary.v2.config({
        cloud_name: account.cloud_name,
        api_key: account.api_key,
        api_secret: account.api_secret,
      });

    
      currentAccountIndex = accountIndex;
      return cloudinary.v2;
    }
  }

  throw new Error("All Cloudinary accounts are full or API failed!");
};


const cloudinaryInstance = await switchCloudinaryAccount();

export const getCloudinaryInstance = async () => {
  try {
    await checkAccountUsage(cloudinaryAccounts[currentAccountIndex]);
    return cloudinaryInstance;
  } catch (error) {
    return await switchCloudinaryAccount();
  }
};

export default cloudinaryInstance;




