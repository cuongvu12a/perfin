# drcloud-purna
A ReactJs project. 

This project is administation website for Clinic in the Dr.Cloud platform.

# How to run
1. Environment
    - Node v14
    - Yarn latest version
2. Configuation
    - Create .env file in the root directory
```
SKIP_PREFLIGHT_CHECK=true
PORT=6002
BUILD_PATH='./build/staging'
REACT_APP_BASENAME= ""
REACT_APP_ENV=debug
REACT_APP_API_URL=https://staging-api.drcloud.vn
```
3. Run ``yarn``
4. Run ``yarn start``
5. Visit http://localhost:6002 to access the web app.

# How to deploy

## Environment
- Linux (Ubuntu/Debian)
- Nginx
- Node v14
- Yarn latest version
- Gitlab Runner

## Configuaration
1. Nginx
    - staging-app.drcloud.vn -> /var/www/staging-app.drcloud.vn
2. Gitlab Runner
    - Register a new runner for this project.

## Publish to folder
1. Push code to branch "main" or "staging"
2. Let GitLab CI/CD do the rest.

# This project contains


# Project Structure


# About
© 2021 Perfin Technology JSC