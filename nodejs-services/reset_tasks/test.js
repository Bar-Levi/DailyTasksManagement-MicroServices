const request = require("supertest");
const { app, setTasksCollection } = require("./app");

describe("/reset_tasks endpoint", () => {
  let server;

  beforeAll(() => {
    // Mock tasksCollection
    const mockTasksCollection = {
      deleteMany: jest.fn().mockImplementation(({ username }) => {
        return { deletedCount: username === "testuser" ? 3 : 0 };
      }),
    };
    setTasksCollection(mockTasksCollection);

    server = app.listen(0); // Use a dynamic port
  });

  afterAll((done) => {
    server.close(done); // Close the server after tests
  });

  it("should reset tasks for a valid username", async () => {
    const response = await request(server).delete("/reset_tasks").send({ username: "testuser" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "All tasks for user testuser have been deleted",
      deletedCount: 3,
    });
  });

  it("should return 400 if username is missing", async () => {
    const response = await request(server).delete("/reset_tasks").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Username is required to reset tasks" });
  });

  it("should return 200 with deletedCount as 0 if no tasks are found", async () => {
    const response = await request(server).delete("/reset_tasks").send({ username: "unknownuser" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "All tasks for user unknownuser have been deleted",
      deletedCount: 0,
    });
  });
});

describe("/health endpoint", () => {
  let server;

  beforeAll(() => {
    server = app.listen(0); // Use a dynamic port
  });

  afterAll((done) => {
    server.close(done); // Close the server after tests
  });

  it("should return health status", async () => {
    const response = await request(server).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "alive" });
  });
});
