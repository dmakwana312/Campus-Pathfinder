import { entity } from 'simpler-state';

export const loggedInUser = entity(null);

export const setUser = (user) => {

    loggedInUser.set(user);

}