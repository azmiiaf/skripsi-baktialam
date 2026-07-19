const pool = require("./config/db");

async function main() {
  try {
    const [rows] = await pool.execute("SELECT id, username, name, email, role FROM users");
    console.log("Registered Users:");
    console.log(rows);
  } catch (err) {
    console.error("Error listing users:", err);
  } finally {
    await pool.end();
  }
}

main();
