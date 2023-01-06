import { Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
export { windowWidth, windowHeight };


export const BASE_URL = 'http://140.112.30.32';
export const PORT = '4001';

// graph url: `${BASE_URL}:${PORT}/graphql`
// 					   http://140.112.30.32:4001/graphql

// image url: `${BASE_URL}:${PORT}/drawing-images/${id}.png`

