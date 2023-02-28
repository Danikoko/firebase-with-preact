import { 
  useEffect,
  useState 
} from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import './app.css'
import { 
  addBook,
  booksColRef,
  deleteBook
} from './utils/firebase/books'
import { 
  doc,
  onSnapshot 
} from 'firebase/firestore'
import { db } from './utils/firebase'

export function App() {
  
  const [books, setBooks] = useState([] as any[]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [id, setId] = useState('');
  const [idIsSetInitially, setIdIsSetInitially] = useState(false);

  const fetchBooks = () => {
    onSnapshot(booksColRef, (snapshot: any) => {
        let booksResponse: any[] = [];
        snapshot.docs.forEach((doc: any) => {
            booksResponse.push({
                id: doc.id,
                ...doc.data()
            });
        });
        setBooks(booksResponse);
        if (booksResponse.length >= 1 && idIsSetInitially === false) {
          setId(booksResponse[0].id);
          setIdIsSetInitially(true);
        }
    })
  }

  // Get a Single Document
  const getBook = async (id: string) => {
    const docRef: any = doc(db, 'books', id);
    onSnapshot(docRef, (doc: any) => {
        console.log(doc.id, doc.data())
    })
  };

  const handleAddBook = (e: any) => {
    e.preventDefault();
    const payload = {
      title,
      author
    }
    addBook(payload)
      .then(({success, errorInfo}: any) => {
        if (success) {
          setTitle('');
          setAuthor('');
        } else {
          console.log(errorInfo);
        }
      });
  }

  const handleDeleteBook = (e: any) => {
    e.preventDefault();
    deleteBook(id)
      .then(({success, errorInfo}: any) => {
        if (success) {
          if (books.length >= 1) {
            setId(books[0].id);
          }
        } else {
          console.log(errorInfo);
        }
      });
  }

  useEffect(() => {
    fetchBooks();
  }, [])

  useEffect(() => {
    if (books.length >= 1) {
      getBook(books[0].id);
    }
  }, books)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>

      <form method="POST" onSubmit={(e: any) => handleAddBook(e)}>
        <div className="form-group">
          <label for="book-title">Book Title</label>
          <input onInput={(e: any) => setTitle(e.target.value)} value={title} type="text" id="book-title" name="book-title" required />
        </div>
        
        <div className="form-group">
          <label for="author-name">Author Name</label>
          <input onInput={(e: any) => setAuthor(e.target.value)} value={author} type="text" id="author-name" name="author-name" required />
        </div>
        
        <button className="submit-button" type="submit">Add Book</button>
      </form>
      
      <form method="POST" onSubmit={(e: any) => handleDeleteBook(e)}>
        <div className="form-group">
          <label for="book-title">Document to Delete</label>
          <select onChange={(e: any) => setId(e.target.value)} id="book-id" name="book-id" required>
            {
              books.map((book: any) => {
                return (
                  <option value={book.id} key={book.id}>
                    { `${book.title} - ${book.author}` }
                  </option>
                )
              })
            }
          </select>
        </div>
        
        <button className="delete-button" type="submit">Delete Book</button>
      </form>
    </>
  )
}
