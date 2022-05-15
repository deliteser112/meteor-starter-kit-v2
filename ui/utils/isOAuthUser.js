/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
export default function isOAuthUser(inServices) {
  const services = ['github', 'facebook', 'google'];

  let isOAuthUser = false;

  inServices.map((service) => {
    if (services.includes(service)) isOAuthUser = true;
  });

  return isOAuthUser;
}
