const BASE_URL = "http://localhost:3000";

describe("/ -- Todo Feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it("when create a new todo, it must appears in the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        body: {
          todo: {
            id: "a7adb8c2-543a-4f6d-a9ca-e75361f8ca08",
            date: "18/06/2023",
            content: "Test todo",
            done: false,
          },
        },
        statusCode: 201,
      });
    }).as("createTodo");
    cy.visit(BASE_URL);
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("Meu novo todo");
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();
    cy.get("table > tbody").contains("Test todo");
  });
});
