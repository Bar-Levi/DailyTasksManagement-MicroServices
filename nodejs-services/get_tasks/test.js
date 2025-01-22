const request = require("supertest");
const { app, setTasksCollection } = require("./app");

describe("/tasks endpoint", () => {
  let server;

  beforeAll(() => {
    // Mock tasksCollection
    const mockTasksCollection = {
      find: jest.fn().mockImplementation((query) => ({
        toArray: jest.fn().mockResolvedValue(
          query.username === "testuser"
            ? [
                { task_name: "Task 1", due_hour: "12:00", username: "testuser", is_done: false },
                { task_name: "Task 2", due_hour: "14:00", username: "testuser", is_done: true },
              ]
            : []
        ),
      })),
    };
    setTasksCollection(mockTasksCollection);

    server = app.listen(0); // Use a dynamic port
  });

  afterAll((done) => {
    server.close(done); // Close the server after tests
  });

  it("should fetch tasks for a valid username", async () => {
    const response = await request(server).get("/tasks?username=testuser");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { task_name: "Task 1", due_hour: "12:00", username: "testuser", is_done: false },
      { task_name: "Task 2", due_hour: "14:00", username: "testuser", is_done: true },
    ]);
  });

  it("should return 400 if username is missing", async () => {
    const response = await request(server).get("/tasks");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Username is required to fetch tasks" });
  });

  it("should return an empty array if no tasks are found for the username", async () => {
    const response = await request(server).get("/tasks?username=unknownuser");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
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
