export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "daee3szbl",
  BASE_URL: "https://res.cloudinary.com/daee3szbl/image/upload",
  TRANSFORMS: "q_auto,f_auto",
};

export const CLOUDINARY_ASSETS = {
  BLOOD_DROPS_ANIMATION: `${CLOUDINARY_CONFIG.BASE_URL}/${CLOUDINARY_CONFIG.TRANSFORMS}/v1/bloodbond_frames`,
  BLOOD_DONATION_ILLUSTRATION: `${CLOUDINARY_CONFIG.BASE_URL}/${CLOUDINARY_CONFIG.TRANSFORMS}/v1/bloodbond_assets/bloodDonationIllustration.png`,
};
