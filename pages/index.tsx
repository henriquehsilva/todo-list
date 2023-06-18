import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import "bootstrap/dist/css/bootstrap.min.css";
import { todoController } from "@ui/controller/todo";

const bg = "./bg.jpeg";

interface HomeTodo {
  id?: string;
  content?: string;
  date?: string;
  done?: boolean;
}

function HomePage() {
  const initialLoadComplete = React.useRef(false);
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [todos, setTodos] = React.useState<HomeTodo[]>([]);
  const [newTodoContent, setNewTodoContent] = React.useState("");
  const homeTodos = todoController.filterTodosByContent<HomeTodo>(
    todos,
    search
  );

  const hasMorePages = totalPages > page;
  const hasNoTodos = homeTodos.length === 0 && !isLoading;

  React.useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  return (
    <>
      <main>
        <GlobalStyles themeName="indigo" />
        <header
          style={{
            backgroundImage: `url('${bg}')`,
          }}
        >
          <div className="card" style={{ width: 400 }}>
            <img
              src="https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"
              width={100}
              className="card-img-top"
              alt="user"
            />
            <div className="card-body">
              <h5 className="card-title">Nome genérico</h5>
              <p className="card-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. quasi
                nobis recusandae est necessitatibus voluptatem ipsa. Molestiae
                quasi ratione illo iste, libero quas iure, dignissimos animi
                similique ea, minima natus.
              </p>
            </div>
          </div>
          <div className="typewriter">
            <h1>O que fazer hoje?</h1>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              todoController.create({
                content: newTodoContent,
                onSuccess(todo: HomeTodo) {
                  setTodos((oldTodos) => {
                    return [todo, ...oldTodos];
                  });
                  setNewTodoContent("");
                },
                onError() {
                  alert("Você precisa fornecer um conteúdo válido para o todo");
                },
              });
            }}
          >
            <input
              name="add-todo"
              type="text"
              placeholder="Correr, Estudar..."
              value={newTodoContent}
              onChange={function newTodoHandler(event) {
                setNewTodoContent(event.target.value);
              }}
            />
            <button type="submit" aria-label="Adicionar novo item">
              +
            </button>
          </form>
        </header>

        <section id="section-form">
          <form>
            <input
              type="text"
              placeholder="Filtrar lista atual, ex: Dentista"
              onChange={function handleSearch(event) {
                setSearch(event.target.value);
              }}
            />
          </form>

          <table border={1}>
            <thead>
              <tr>
                <th align="left">
                  <input type="checkbox" disabled />
                </th>
                <th align="left">Id</th>
                <th align="left">Conteúdo</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {homeTodos.map((todo) => {
                return (
                  <tr key={todo.id}>
                    <td>
                      <input
                        type="checkbox"
                        defaultChecked={todo.done}
                        onChange={function handleToggle() {
                          todoController.toggleDone({
                            todoId: todo.id,
                            updateTodoOnScreen() {
                              setTodos((currentTodos) => {
                                return currentTodos.map((currentTodo) => {
                                  if (currentTodo.id === todo.id) {
                                    return {
                                      ...currentTodo,
                                      done: !currentTodo.done,
                                    };
                                  }
                                  return currentTodo;
                                });
                              });
                            },
                          });
                        }}
                      />
                    </td>
                    <td>{todo.id.substring(0, 4)}</td>
                    <td>
                      {!todo.done && todo.content}
                      {todo.done && <s>{todo.content}</s>}
                    </td>
                    <td align="right">
                      <button
                        data-type="delete"
                        onClick={function handleClick() {
                          todoController
                            .deleteById(todo.id)
                            .then(() => {
                              setTodos((currentTodos) => {
                                return currentTodos.filter((currentTodo) => {
                                  if (currentTodo.id === todo.id) {
                                    return false;
                                  }
                                  return true;
                                });
                              });
                            })
                            .catch(() => {
                              alert("Não foi possível apagar o todo");
                            });
                        }}
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                );
              })}

              {isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    align="center"
                    style={{ textAlign: "center" }}
                  >
                    Carregando...
                  </td>
                </tr>
              )}

              {hasNoTodos && (
                <tr>
                  <td colSpan={4} align="center">
                    Nenhum item encontrado
                  </td>
                </tr>
              )}

              {hasMorePages && (
                <tr>
                  <td
                    colSpan={4}
                    align="center"
                    style={{ textAlign: "center" }}
                  >
                    <button
                      data-type="load-more"
                      onClick={() => {
                        setIsLoading(true);
                        const nextPage = page + 1;
                        setPage(nextPage);
                        todoController
                          .get({ page: nextPage })
                          .then(({ todos, pages }) => {
                            setTodos((oldTodos) => {
                              return [...oldTodos, ...todos];
                            });
                            setTotalPages(pages);
                          })
                          .finally(() => {
                            setIsLoading(false);
                          });
                      }}
                    >
                      Página {page} Carregar mais{" "}
                      <span
                        style={{
                          display: "inline-block",
                          marginLeft: "4px",
                          fontSize: "1.2em",
                        }}
                      >
                        ↓
                      </span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}

export default HomePage;
