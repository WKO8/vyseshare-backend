# VyseShare Backend

## Description
VyseShare is a backend system developed to manage and process data for a web application. This project is part of the discipline interdisciplinary work 5 of the Computer Science course.

## Installation
To install and set up the project, follow the steps below:

1. Clone the repository:
    ```bash
    git clone https://github.com/WKO8/vyseshare-backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd vysenet-backend
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage
To start the development server, run:
```bash
npm start
```
The server will be available at `http://localhost:3000`.

## Contribution
To contribute to the project, follow the steps below:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b my-new-feature
    ```
3. Make the desired changes and commit:
    ```bash
    git commit -m 'Add new feature'
    ```
4. Push to the remote repository:
    ```bash
    git push origin my-new-feature
    ```
5. Open a Pull Request.


## Usages

### Upload a new file to the server
- **Linux:**
```bash
curl -X POST http://localhost:8888/upload -F "file=@teste.txt"
```
- **Windows (PowerShell):**
```bash
curl.exe -X POST http://localhost:8888/upload -F "file=@teste.txt"
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

