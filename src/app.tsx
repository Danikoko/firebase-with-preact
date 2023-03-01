import { 
  useEffect,
  useState 
} from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import './app.css'
import { 
  booksColRef,
  queryBooksByCreatedAt,
  addBook,
  updateBook,
  deleteBook
} from './utils/firebase/books'
import { 
  // doc,
  onSnapshot 
} from 'firebase/firestore'
// import { db } from './utils/firebase'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from './utils/firebase'

export function App() {
  
  const [currentBook, setCurrentBook] = useState({
    id: '',
    title: '',
    author: ''
  });
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [books, setBooks] = useState([] as any[]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [titleForUpdate, setTitleForUpdate] = useState('');
  const [authorForUpdate, setAuthorForUpdate] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [idToUpdateIsSetInitially, setIdToUpdateIsSetInitially] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToDeleteIsSetInitially, setIdToDeleteIsSetInitially] = useState(false);

  const signUp = (e: any) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((credential: any) => {
        console.log(credential)
        console.log('user created: ', credential.user)
        setEmail('');
        setPassword('');
        setUser(credential.user);
      })
      .catch((error: any) => {
        console.log(error.message);
      });
  }

  const signIn = (e: any) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((credential: any) => {
        console.log(credential)
        console.log('user login: ', credential.user)
        setLoginEmail('');
        setLoginPassword('');
        setUser(credential.user);
      })
      .catch((error: any) => {
        console.log(error.message);
      });
  }

  const signOutUser = (e: any) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        setUser(null);
      });
  }

  const handleSetCurrentBook = (id: string, booksParam: any[] = books) => {
    const [value] = booksParam.filter((bookItem: any) => bookItem.id === id);
    setCurrentBook(value || {
      id: '',
      title: '',
      author: ''
    });
    setAuthorForUpdate(value.author);
    setTitleForUpdate(value.title);
  }
  
  const fetchBooks = () => {
    //booksColRef
    onSnapshot(queryBooksByCreatedAt, (snapshot: any) => {
        let booksRes: any[] = [];
        snapshot.docs.forEach((doc: any) => {
            booksRes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        setBooks(booksRes);
        if (booksRes.length >= 1 && idToUpdateIsSetInitially === false) {
          setIdToUpdate(booksRes[0].id);
          // getBook(booksRes[0].id);
          setIdToUpdateIsSetInitially(true);
          handleSetCurrentBook(booksRes[0].id, booksRes);
        } else {
          handleSetCurrentBook(idToUpdate, booksRes);
        }
        if (booksRes.length >= 1 && idToDeleteIsSetInitially === false) {
          setIdToDelete(booksRes[0].id);
          setIdToDeleteIsSetInitially(true);
        }
    })
  }

  // Get a Single Document
  // const getBook = (id: string) => {
  //   const docRef: any = doc(db, 'books', id);
  //   let bookRes = currentBook;
  //   onSnapshot(docRef, (doc: any) => {
  //       console.log(doc.id, doc.data());
  //       bookRes = {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //       setCurrentBook(bookRes);
  //   });
  // };

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

  const handleUpdateBook = (e: any) => {
    e.preventDefault();
    const payload = {
      id: idToUpdate,
      title: titleForUpdate,
      author: authorForUpdate
    }
    updateBook(payload)
      .then(({success, errorInfo}: any) => {
        if (success) {
          // setTitleForUpdate('');
          // setAuthorForUpdate('');
        } else {
          console.log(errorInfo);
        }
      });
  }

  const handleDeleteBook = (e: any) => {
    e.preventDefault();
    deleteBook(idToDelete)
      .then(({success, errorInfo}: any) => {
        if (success) {
          if (books.length >= 1) {
            setIdToDelete(books[0].id);
          }
        } else {
          console.log(errorInfo);
        }
      });
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // setAuthorForUpdate(currentBook.author);
    // setTitleForUpdate(currentBook.title);
  }, [currentBook]);

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

      <form method="POST" onSubmit={(e: any) => handleUpdateBook(e)}>
        <div className="form-group">
            <label for="book-title">Document to Update</label>
            <select 
            onChange={(e: any) => {
              setIdToUpdate(e.target.value);
              handleSetCurrentBook(e.target.value);
            }} 
            id="book-id-to-update" 
            name="book-id" 
            required>
              {
                books.map((book: any) => {
                  return (
                    <option selected={book.id === idToUpdate} value={book.id} key={book.id}>
                      { `${book.title} - ${book.author}` }
                    </option>
                  )
                })
              }
            </select>
          </div>

        <div className="form-group">
          <label for="book-title">Book Title</label>
          <input onInput={(e: any) => setTitleForUpdate(e.target.value)} value={titleForUpdate} type="text" id="book-title-update" name="book-title" required />
        </div>
        
        <div className="form-group">
          <label for="author-name">Author Name</label>
          <input onInput={(e: any) => setAuthorForUpdate(e.target.value)} value={authorForUpdate} type="text" id="author-name-update" name="author-name" required />
        </div>
        
        <button className="submit-button" type="submit">Update Book</button>
      </form>
      
      <form method="POST" onSubmit={(e: any) => handleDeleteBook(e)}>
        <div className="form-group">
          <label for="book-title">Document to Delete</label>
          <select onChange={(e: any) => setIdToDelete(e.target.value)} id="book-id-to-delete" name="book-id" required>
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

      {
        user 
        ?
        <form method="POST" onSubmit={(e: any) => signOutUser(e)}>
          <button className="submit-button" type="submit">Sign Out</button>
        </form>
        :
        <>
          <form method="POST" onSubmit={(e: any) => signUp(e)}>
            <div className="form-group">
              <label for="user-email">Email</label>
              <input onInput={(e: any) => setEmail(e.target.value)} value={email} type="text" id="user-email" name="user-email" required />
            </div>
            
            <div className="form-group">
              <label for="user-password">Password</label>
              <input onInput={(e: any) => setPassword(e.target.value)} value={password} type="password" id="user-password" name="user-password" required />
            </div>
            
            <button className="submit-button" type="submit">Sign Up</button>
          </form>

          <form method="POST" onSubmit={(e: any) => signIn(e)}>
            <div className="form-group">
              <label for="user-email">Email</label>
              <input onInput={(e: any) => setLoginEmail(e.target.value)} value={loginEmail} type="text" id="user-email-to-login" name="user-email-to-login" required />
            </div>
            
            <div className="form-group">
              <label for="user-password">Password</label>
              <input onInput={(e: any) => setLoginPassword(e.target.value)} value={loginPassword} type="password" id="user-password-to-login" name="user-password-to-login" required />
            </div>
            
            <button className="submit-button" type="submit">Sign In</button>
          </form>
        </>
      }
      
    </>
  )
}
