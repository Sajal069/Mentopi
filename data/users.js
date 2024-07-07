import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataFilePath = path.join(__dirname, "usersData.json");

// Load users from file
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync(dataFilePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return {};
  }
};

// Save users to file
const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync(dataFilePath, dataJSON);
};

// Initial load
const users = loadUsers();

export { users, saveUsers };
