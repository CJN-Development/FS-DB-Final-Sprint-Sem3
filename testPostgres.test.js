const { Pool } = require("pg");
describe("Database connection", () => {
  it("should connect to PostgreSQL", async () => {
    const pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "sprint_2_cjn",
      password: "Keyin2023",
      port: 5432,
    });
    const client = await pool.connect();
    expect(client).toBeDefined();
    client.release();
    await pool.end();
  });
});
