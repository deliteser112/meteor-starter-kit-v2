
  export default function isOAuthUser(inServices) {
    const services = ['github', 'facebook', 'google'];

    let isOAuthUser = false;

    inServices.map((service) =>{
      if (services.includes(service)) isOAuthUser = true;
    })

    return isOAuthUser;
  }