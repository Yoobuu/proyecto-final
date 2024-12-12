const API_URL = "http://localhost:4000"; // URL del backend

// Función para mostrar alertas
function showAlert(message, type = "success") {
  const alertsDiv = document.getElementById("alerts");
  alertsDiv.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  setTimeout(() => alertsDiv.innerHTML = "", 3000);
}

// Función para obtener y mostrar los libros
async function fetchBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    const books = await response.json();

    const booksTable = document.getElementById("books-table");
    booksTable.innerHTML = books.map(book => `
      <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editBook(${book.id}, '${book.title}', '${book.author}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Eliminar</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    showAlert("Error al obtener los libros", "danger");
    console.error(error);
  }
}

// Función para agregar un libro
async function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author }),
    });

    if (response.ok) {
      showAlert("Libro agregado exitosamente");
      document.getElementById("add-book-form").reset();
      fetchBooks();
    } else {
      showAlert("Error al agregar el libro", "danger");
    }
  } catch (error) {
    showAlert("Error al conectar con el servidor", "danger");
    console.error(error);
  }
}

// Función para eliminar un libro
async function deleteBook(id) {
  if (!confirm("¿Seguro que deseas eliminar este libro?")) return;

  try {
    const response = await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });

    if (response.ok) {
      showAlert("Libro eliminado exitosamente");
      fetchBooks();
    } else {
      showAlert("Error al eliminar el libro", "danger");
    }
  } catch (error) {
    showAlert("Error al conectar con el servidor", "danger");
    console.error(error);
  }
}

// Función para editar un libro
async function editBook(id, title, author) {
  const newTitle = prompt("Nuevo título", title);
  const newAuthor = prompt("Nuevo autor", author);

  if (!newTitle || !newAuthor) return;

  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, author: newAuthor }),
    });

    if (response.ok) {
      showAlert("Libro actualizado exitosamente");
      fetchBooks();
    } else {
      showAlert("Error al actualizar el libro", "danger");
    }
  } catch (error) {
    showAlert("Error al conectar con el servidor", "danger");
    console.error(error);
  }
}

// Inicializar
document.getElementById("add-book-form").addEventListener("submit", addBook);
fetchBooks();
