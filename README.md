# Tint Your Day
## About the Project
Tint your day is an interactive drawing journal app that allows you to express your mood through coloring on a watercolor canvas and typing text. When browsing past journals, you are free to add comments or add color to previous watercolor work as a record of the change of mindset. You can make it a daily journal book or a subject-based one to document your thoughts and ideas. Each journal content (including text, watercolor image) is stored on our server and can be accessed from multiple devices. My hope is that Tint Your Day will make journaling an enjoyable and meaningful experience for you.

This app was built on MERN stack development (MongoDB, Express, React Native, Node) and Apollo + GraphQL. It was also my final project for [Web Programming Course](https://wp.ee.ntu.edu.tw/) in the National Taiwan University at 2022 Fall.  
![Alt text](/readme_image/presentation-screenshot.png?raw=true)

Watch my [5-min presentation](https://youtu.be/onMap3v3LhU)(in Mandarin) for more details.

## Getting Started
### Setup
- Download [Android Simulator](https://developer.android.com/studio/run/emulator) or [Expo Go App on IOS](https://apps.apple.com/us/app/expo-go/id982107779)
- ```cd frontend && yarn install```
- ```cd backend && yarn install```

### Run
- Frontend: 
    - Run ```yarn start```
    - Open android simlator or use mobile phone to scan the qr-code on the terminal.
    - The app will connect to our server by default. If you want to run on your own server, follow the next step. (Notes: Default server running at NTU CSIE Workstation only has 2GB limit, and might be close in the future.)

- Backend: 
    - Setup global variables: MONGO_URL, JWT_SECRET(a random string. this is for creating tokens), PORT and BASE_URL. You can put them in a single ```.env``` file in ```backend/```.
    - Change BASE_URL, PORT variables in ```frontend/src/data/constants.js``` according to your settings.
    - Run ```yarn server```

## Todo Features
1. Instruction of how to use in app
2. Recorder feature
3. Archive the journals
4. Calendar view
5. Offline mode 
6. Web Version

## Contact
email: b07502165@ntu.edu.tw