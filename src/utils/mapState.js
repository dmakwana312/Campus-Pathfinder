import { entity } from 'simpler-state';

export const map = entity(null);

export const setMap = (mapToView) => {

    map.set(mapToView);

}