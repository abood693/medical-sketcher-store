import crypto from "node:crypto";
import readline from "node:readline";

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const password = await new Promise<string>(resolve => {
  terminal.question("Admin password: ", answer => {
    terminal.close();
    process.stdout.write("\n");
    resolve(answer);
  });
});

if (password.length < 12) {
  throw new Error("Use an admin password with at least 12 characters.");
}

const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`);
